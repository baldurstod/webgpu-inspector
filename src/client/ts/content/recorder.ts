import { Map2 } from 'harmony-utils';
import { Controller, RecompileShader } from './controller';
import { getMethod } from './methods';
import { ContextType, Record } from './record';

const GL_FRAGMENT_SHADER = 0x8B30;
const GL_VERTEX_SHADER = 0x8B31;
const SHADER_TYPE = 0x8B4F;

export type ShaderRecord = {
	name: string;
	type: GLenum;
	source?: string;
	contextType: ContextType;
	context: WebGLRenderingContext | WebGL2RenderingContext;
	deleted: boolean;
}

type ProgramRecord = {
	program: WebGLProgram;
	contextType: ContextType;
	context: WebGLRenderingContext | WebGL2RenderingContext;
	vertex?: WebGLShader;
	fragment?: WebGLShader;
	unknown?: WebGLShader;//TODO: remove this
	uniforms?: Map<string, WebGLUniformLocation>;
}

export class Recorder {
	#recording = true;
	#currentId = 0;
	#currentShaderId = 0;
	#lastRequestAnimationFrame = -1;
	readonly #records = new Set<Record>();
	readonly #shaders = new Map<WebGLShader, ShaderRecord>();
	readonly #shadersByName = new Map<string, WebGLShader>();
	readonly #programs = new Map<WebGLProgram, ProgramRecord>();
	/** Uniform locations known to the site */
	readonly #siteUniformLocation = new Map2<WebGLProgram, string, WebGLUniformLocation>();
	/** Map the old uniform location to the new one */
	readonly #uniformLocations = new Map<WebGLUniformLocation, WebGLUniformLocation>();

	constructor() {
		Controller.addEventListener('recompileshader', (event) => this.#recompileShader(event.detail));
	}

	setRecording(recording: boolean): void {
		this.#recording = recording;
	}

	isRecording(): boolean {
		return this.#recording;
	}

	clearRecords(): void {
		this.#currentId = 0;
		this.#records.clear();
	}

	reset(): void {
		this.clearRecords();
		this.#shaders.clear();
	}

	addRecord(contextType: ContextType, context: WebGLRenderingContext | WebGL2RenderingContext, functionName: string, func: Function, args: any[]/*, start: DOMHighResTimeStamp, duration: DOMHighResTimeStamp*/): any {
		//console.debug(`Adding new ${contextType} record ${this.#currentId}`);

		// We process the record whether we record or not: important things can occur, like shader compilation

		const start = performance.now();
		const result = this.#processRecord(contextType, context, functionName, func, args);
		const end = performance.now();

		if (!this.#recording) {
			return result;
		}

		const record = new Record(contextType, functionName, this.#currentId, start, end - start, args);
		this.#records.add(record);
		++this.#currentId;
		return result;
	}

	getRecords(): Set<Record> {
		return this.#records;
	}

	#getShaderName(): string {
		return `Shader ${++this.#currentShaderId}`;
	}

	#processRecord(contextType: ContextType, context: WebGLRenderingContext | WebGL2RenderingContext, functionName: string, func: Function, args: any[]): any {
		switch (functionName) {
			case 'createProgram':
				{
					const program = func.apply(context, args);
					this.#programs.set(program, { program, contextType, context, } as ProgramRecord);
					//console.debug(`A ${contextType} program was created`, result, args[0]);
					return program;
				}
				break;
			case 'attachShader':
				func.apply(context, args);
				const program = this.#getProgram(contextType, context, args[0]);
				const shader = this.#getShader(contextType, context, args[1]);
				const type = getShaderType(shader.type);

				program[type] = args[1];
				//console.debug(`A ${contextType} shader was attached`, args[0], args[1]);
				//console.debug(program);
				break;
			case 'createShader':
				{
					const shader = func.apply(context, args);
					const shaderRecord = { name: this.#getShaderName(), type: args[0] as GLenum, contextType, context, deleted: false, } as ShaderRecord;
					this.#addShader(shader, shaderRecord);
					//console.debug(`A ${contextType} ${getShaderType(args[0])} shader was created`, result, args[0]);
					Controller.dispatchEvent('shaderadded', { detail: shaderRecord });
					return shader;
				}
				break;
			case 'deleteShader':
			case 'deleteProgram':
				// Prevents deletion for the recompile feature
				break;
			case 'shaderSource':
				{
					func.apply(context, args);
					const shader = this.#getShader(contextType, context, args[0]);
					// Store the source
					shader.source = args[1];
					//console.debug(`A ${contextType} ${getShaderType(shader.type)} source was set`, args[0], args[1]);

					Controller.dispatchEvent('shadersource', { detail: shader });
				}
				break;
			case 'linkProgram':
				{
					func.apply(context, args);
					const program = this.#getProgram(contextType, context, args[0]);
					const uniforms = this.#getProgramUniforms(program);
					if (uniforms) {
						program.uniforms = uniforms;
					}
				}
				break;
			case 'getUniformLocation':
				{
					// Store the uniform locations that the site is knowing about
					// We have to do that for the recompile feature cause getUniformLocation
					// returns a different value each time it is called with the same parameters
					const uniformLocation = func.apply(context, args) as WebGLUniformLocation | null;
					const program = args[0] as WebGLProgram;
					const name = args[1] as string;

					if (uniformLocation) {
						this.#siteUniformLocation.set(program, name, uniformLocation);
					}
					return uniformLocation;
				}
				break;
			case 'uniform1f':
			case 'uniform1fv':
			case 'uniform1i':
			case 'uniform1iv':
			case 'uniform2f':
			case 'uniform2fv':
			case 'uniform2i':
			case 'uniform2iv':
			case 'uniform3f':
			case 'uniform3fv':
			case 'uniform3i':
			case 'uniform3iv':
			case 'uniform4f':
			case 'uniform4fv':
			case 'uniform4i':
			case 'uniform4iv':
			case 'uniformMatrix2fv':
			case 'uniformMatrix3fv':
			case 'uniformMatrix4fv':
				{
					const oldLocation = args[0];
					const newLocation = this.#uniformLocations.get(oldLocation);
					if (newLocation) {
						args[0] = newLocation;
					}
					//console.log('uniform1f', args);

					func.apply(context, args);
					/*
					const getError = getMethod(contextType, 'getError');
					if (getError) {
						const error = getError.apply(context);
						if (error) {
							//console.debug('uniform1f failed with error', error, oldLocation);
						}
					}
					*/
				}
				break;
			default:
				return func.apply(context, args);
				break;
		}
	}

	#getProgramUniforms(program: ProgramRecord): Map<string, WebGLUniformLocation> | null {
		const getProgramParameter = getMethod(program.contextType, 'getProgramParameter');
		const getActiveUniform = getMethod(program.contextType, 'getActiveUniform');
		const getUniformLocation = getMethod(program.contextType, 'getUniformLocation');
		if (!getProgramParameter || !getActiveUniform || !getUniformLocation) {
			return null;
		}

		const activeUniforms: GLint = getProgramParameter.apply(program.context, [program.program, program.context.ACTIVE_UNIFORMS]);
		//console.log('Link program activeUniforms', activeUniforms);
		const result = new Map<string, WebGLUniformLocation>();
		for (let i = 0; i < activeUniforms; i++) {
			const attribInfo = getActiveUniform.apply(program.context, [program.program, i]);
			if (!attribInfo) {
				continue;
			}
			const uniformLocation = getUniformLocation.apply(program.context, [program.program, attribInfo.name]) as WebGLUniformLocation | null;

			if (uniformLocation) {
				//program.uniforms.set(attribInfo.name, uniformLocation);
				result.set(attribInfo.name, uniformLocation);
			}

		}
		return result;
	}

	#getShader(contextType: ContextType, context: WebGLRenderingContext | WebGL2RenderingContext, webGLShader: WebGLShader): ShaderRecord {
		let shader = this.#shaders.get(webGLShader);

		// Shader should exist at this point, but just in case
		if (!shader) {
			let shaderType = -1;

			// Get the shader type
			const getShaderParameter = getMethod(contextType, 'getShaderParameter');
			if (getShaderParameter) {
				shaderType = getShaderParameter.apply(context, [webGLShader, SHADER_TYPE]);
			}

			shader = { name: this.#getShaderName(), type: shaderType, contextType, context, deleted: false, } as ShaderRecord;
			this.#addShader(webGLShader, shader);
		}

		return shader;
	}

	#addShader(webGLShader: WebGLShader, shader: ShaderRecord): void {
		this.#shaders.set(webGLShader, shader);
		this.#shadersByName.set(shader.name, webGLShader);
	}

	#deleteShader(webGLShader: WebGLShader): ShaderRecord | null {
		const shader = this.#shaders.get(webGLShader);
		if (!shader) {
			return null;
		}
		this.#shaders.delete(webGLShader);
		this.#shadersByName.delete(shader.name);
		return shader;
	}

	#getProgram(contextType: ContextType, context: WebGLRenderingContext | WebGL2RenderingContext, webGLProgram: WebGLProgram): ProgramRecord {
		let program = this.#programs.get(webGLProgram);
		// Program should exist at this point, but just in case
		if (!program) {
			program = { program: webGLProgram, contextType, context, };
			this.#programs.set(webGLProgram, program);
		}
		return program;
	}

	requestAnimationFrame(time: DOMHighResTimeStamp): void {
		this.#lastRequestAnimationFrame = ++this.#currentId;
		//console.info('request', this.#currentId);

		if (!this.#recording) {
			return;
		}

		Controller.dispatchEvent('requestanimationframe', { detail: time });
	}

	#recompileShader({ name, source }: RecompileShader): void {
		const webGLShader = this.#shadersByName.get(name);
		if (!webGLShader) {
			return;
		}
		const shader = this.#shaders.get(webGLShader);
		if (!shader) {
			return;
		}

		// Get all original methods
		const shaderSource = getMethod(shader.contextType, 'shaderSource');
		const compileShader = getMethod(shader.contextType, 'compileShader');
		const getShaderParameter = getMethod(shader.contextType, 'getShaderParameter');
		const linkProgram = getMethod(shader.contextType, 'linkProgram');
		const getProgramParameter = getMethod(shader.contextType, 'getProgramParameter');
		if (!shaderSource || !compileShader || !getShaderParameter || !linkProgram || !getProgramParameter) {
			return;
		}

		// Recompile the shader
		shaderSource.apply(shader.context, [webGLShader, source]);
		compileShader.apply(shader.context, [webGLShader]);
		const compileStatus = getShaderParameter.apply(shader.context, [webGLShader, shader.context.COMPILE_STATUS]);
		//console.debug('compileShader result', compileStatus);
		if (!compileStatus) {
			console.error('Failed to compile shader', shader);
			return;
		}

		// Link all programs
		for (const [program] of this.#programs) {
			const programRecord = this.#getProgram(shader.contextType, shader.context, program);
			if (!programRecord.uniforms) {
				continue;
			}

			// Link the program
			linkProgram.apply(shader.context, [program]);
			const linkStatus = getProgramParameter.apply(shader.context, [program, shader.context.LINK_STATUS]);
			if (!linkStatus) {
				continue;
			}

			// Get the new uniforms
			const newUniforms = this.#getProgramUniforms(programRecord);
			if (!newUniforms) {
				continue;
			}
			//console.debug('New program uniforms', newUniforms, programRecord);

			// Map the old uniforms to the new uniforms
			const a = this.#siteUniformLocation.getSubMap(program);
			if (!a) {
				continue;
			}
			for (const [name, oldUniform] of a/*programRecord.uniforms*/) {
				const newUniform = newUniforms.get(name);
				if (!newUniform) {
					continue;
				}

				this.#uniformLocations.set(oldUniform, newUniform);
			}
		}

		//console.log('uniformLocations after compilation', this.#uniformLocations);
	}
}

export function getShaderType(type: GLenum): 'vertex' | 'fragment' | 'unknown' {
	switch (type) {
		case GL_VERTEX_SHADER:
			return 'vertex';
		case GL_FRAGMENT_SHADER:
			return 'fragment';
		default:
			return 'unknown';
	}
}
