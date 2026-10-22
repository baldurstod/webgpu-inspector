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
	vertex?: WebGLShader;
	fragment?: WebGLShader;
	unknown?: WebGLShader;//TODO: remove this
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

	constructor() {
		Controller.addEventListener('recompileshader', (event) => this.#recompileShader(event.detail));
	}

	setRecording(recording: boolean): void {
		this.#recording = recording;
	}

	clearRecords(): void {
		this.#currentId = 0;
		this.#records.clear();
	}

	reset(): void {
		this.clearRecords();
		this.#shaders.clear();
	}

	addRecord(contextType: ContextType, context: WebGLRenderingContext | WebGL2RenderingContext, functionName: string, args: any[], result: any, start: DOMHighResTimeStamp, duration: DOMHighResTimeStamp) {
		//console.debug(`Adding new ${contextType} record ${this.#currentId}`);

		// We process the record whether we record or not: important things can occur, like shader compilation
		this.#processRecord(contextType, context, functionName, args, result);

		if (!this.#recording) {
			return;
		}

		const record = new Record(contextType, functionName, this.#currentId, start, duration, args);
		this.#records.add(record);
		++this.#currentId;
	}

	getRecords(): Set<Record> {
		return this.#records;
	}

	#getShaderName(): string {
		return `Shader ${++this.#currentShaderId}`;
	}

	#processRecord(contextType: ContextType, context: WebGLRenderingContext | WebGL2RenderingContext, functionName: string, args: any[], result: any): void {
		switch (functionName) {
			case 'createProgram':
				this.#programs.set(result, {});
				//console.debug(`A ${contextType} program was created`, result, args[0]);
				break;
			case 'attachShader':
				const program = this.#getProgram(args[0]);
				const shader = this.#getShader(contextType, context, args[1]);
				const type = getShaderType(shader.type);

				program[type] = args[1];
				//console.debug(`A ${contextType} shader was attached`, args[0], args[1]);
				//console.debug(program);
				break;
			case 'createShader':
				{
					const shader = { name: this.#getShaderName(), type: args[0] as GLenum, contextType, context, deleted: false, } as ShaderRecord;
					this.#addShader(result, shader);
					//console.debug(`A ${contextType} ${getShaderType(args[0])} shader was created`, result, args[0]);
					Controller.dispatchEvent('shaderadded', { detail: shader });
				}
				break;
			case 'deleteShader':
				{
					const shader = this.#deleteShader(args[0]);
					if (shader) {
						Controller.dispatchEvent('shaderdeleted', { detail: shader });
						//console.error(`A ${contextType} ${getShaderType(shader.type)} shader was deleted`, args[0]);
					}
				}
				break;
			case 'shaderSource':
				{
					const shader = this.#getShader(contextType, context, args[0]);
					// Store the source
					shader.source = args[1];
					//console.debug(`A ${contextType} ${getShaderType(shader.type)} source was set`, args[0], args[1]);

					Controller.dispatchEvent('shadersource', { detail: shader });
				}
				break;
		}
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

	#getProgram(webGLProgram: WebGLProgram): ProgramRecord {
		let program = this.#programs.get(webGLProgram);
		// Program should exist at this point, but just in case
		if (!program) {
			program = {};
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

	#recompileShader({ name, source }: RecompileShader) {
		//compileShader
		const webGLShader = this.#shadersByName.get(name);
		if (!webGLShader) {
			return;
		}
		const shader = this.#shaders.get(webGLShader);
		if (!shader) {
			return;
		}

		const shaderSource = getMethod(shader.contextType, 'shaderSource');
		const compileShader = getMethod(shader.contextType, 'compileShader');
		const getShaderParameter = getMethod(shader.contextType, 'getShaderParameter');
		const linkProgram = getMethod(shader.contextType, 'linkProgram');
		if (shaderSource && compileShader && getShaderParameter && linkProgram) {
			shaderSource.apply(shader.context, [webGLShader, source]);
			compileShader.apply(shader.context, [webGLShader]);
			const compileStatus = getShaderParameter.apply(shader.context, [webGLShader, shader.context.COMPILE_STATUS]);
			console.debug('compileShader result', compileStatus);
			if (compileStatus) {
				for (const [program] of this.#programs) {
					linkProgram.apply(shader.context, [program]);
				}

			}
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
