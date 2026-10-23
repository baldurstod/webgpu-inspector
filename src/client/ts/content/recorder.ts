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
}

type UniformValue = {
	method: 'uniform1f' | 'uniform1fv' | 'uniform1i' | 'uniform1iv' | 'uniform2f' | 'uniform2fv' | 'uniform2i' | 'uniform2iv' | 'uniform3f' | 'uniform3fv' | 'uniform3i' | 'uniform3iv' | 'uniform4f' | 'uniform4fv' | 'uniform4i' | 'uniform4iv' | 'uniformMatrix2fv' | 'uniformMatrix3fv' | 'uniformMatrix4fv';
	value: any[];
}

export class Recorder {
	#recording = false;
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
	readonly #uniformLocations = new Map<WebGLUniformLocation, WebGLUniformLocation | null>();
	readonly #uniformValues = new Map<WebGLUniformLocation, UniformValue>();

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

					if (newLocation === null) {
						// The new location is null, meaning the uniform doesn't exist anymore
						break;
					}

					if (newLocation) {
						args[0] = newLocation;
					}

					// Store the value for later use
					this.#uniformValues.set(oldLocation, {
						method: functionName,
						value: args,
					});

					func.apply(context, args);
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
			const uniformInfo = getActiveUniform.apply(program.context, [program.program, i]) as WebGLActiveInfo | null;
			if (!uniformInfo) {
				continue;
			}
			const uniformLocation = getUniformLocation.apply(program.context, [program.program, uniformInfo.name]) as WebGLUniformLocation | null;

			if (uniformLocation) {
				//program.uniforms.set(attribInfo.name, uniformLocation);
				result.set(uniformInfo.name, uniformLocation);
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
		const getParameter = getMethod(shader.contextType, 'getParameter');
		const useProgram = getMethod(shader.contextType, 'useProgram');
		if (!shaderSource || !compileShader || !getShaderParameter || !linkProgram || !getProgramParameter || !getParameter || !useProgram) {
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

		// Store the current program
		const currentProgram = getParameter.apply(shader.context, [shader.context.CURRENT_PROGRAM]) as WebGLProgram | null;

		// Link all programs
		// TODO: only link program(s) using the involved shader
		for (const [program] of this.#programs) {
			const programRecord = this.#getProgram(shader.contextType, shader.context, program);

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
			const programUniforms = this.#siteUniformLocation.getSubMap(program);
			if (!programUniforms) {
				continue;
			}

			// Use the linked program
			useProgram.apply(shader.context, [program]);

			for (const [name, oldUniform] of programUniforms) {
				const newUniform = newUniforms.get(name);
				if (!newUniform) {
					// Set the location to null, which will discard calls to uniform[1234][fi][v]
					this.#uniformLocations.set(oldUniform, null);
					continue;
				}

				this.#uniformLocations.set(oldUniform, newUniform);

				// Set the new value, the site may not update the value by itself
				const value = this.#uniformValues.get(oldUniform);
				if (!value) {
					continue;
				}

				const uniformSetter = getMethod(shader.contextType, value.method);
				if (uniformSetter) {
					value.value[0] = newUniform;
					uniformSetter.apply(shader.context, value.value);
				}
			}
		}

		// Restore the previously used program
		if (currentProgram) {
			useProgram.apply(shader.context, [currentProgram]);
		}
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
