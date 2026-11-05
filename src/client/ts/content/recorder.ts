import { createElement } from 'harmony-ui';
import { Map2 } from 'harmony-utils';
import { EXTENSION_NAME } from './constants';
import { Controller, IdentifyShader, RecompileShader } from './controller';
import { getOriginalMethod } from './methods';
import { readyPromise } from './ready';
import { ContextType, Record } from './record';
import renderTextureFragment from './shaders/rendertexture_fragment.glsl';
import renderTextureVertex from './shaders/rendertexture_vertex.glsl';
import { WebGLAnyRenderingContext } from './types';


const GL_FRAGMENT_SHADER = 0x8B30;
const GL_VERTEX_SHADER = 0x8B31;
const SHADER_TYPE = 0x8B4F;

export type ShaderRecord = {
	name: string;
	type: GLenum;
	source?: string;
	contextType: ContextType;
	context: WebGLAnyRenderingContext;
	deleted: boolean;
}

type ProgramRecord = {
	program: WebGLProgram;
	contextType: ContextType;
	context: WebGLAnyRenderingContext;
	vertex?: WebGLShader;
	fragment?: WebGLShader;
	unknown?: WebGLShader;//TODO: remove this
}

type UniformValue = {
	method: 'uniform1f' | 'uniform1fv' | 'uniform1i' | 'uniform1iv' | 'uniform2f' | 'uniform2fv' | 'uniform2i' | 'uniform2iv' | 'uniform3f' | 'uniform3fv' | 'uniform3i' | 'uniform3iv' | 'uniform4f' | 'uniform4fv' | 'uniform4i' | 'uniform4iv' | 'uniformMatrix2fv' | 'uniformMatrix3fv' | 'uniformMatrix4fv';
	value: any[];
}

const identify_shader_glsl_v1 = `
precision mediump float;
precision mediump int;
void main() {
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

const identify_shader_glsl_v3 = `#version 300 es

precision mediump float;
precision mediump int;
out vec4 fragColor;
void main() {
	fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;
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
	readonly #siteUniformLocation = new Map2<WebGLProgram, string, WebGLUniformLocation | null>();
	/** Map the old uniform location to the new one */
	readonly #uniformLocations = new Map<WebGLUniformLocation, WebGLUniformLocation | null>();
	readonly #uniformValues = new Map<WebGLUniformLocation, UniformValue>();
	readonly #lastProgramUsage = new Map<WebGLProgram, DOMHighResTimeStamp>();
	readonly #canvases: {
		webgl?: HTMLCanvasElement;
		webgl2?: HTMLCanvasElement;
		webgpu?: HTMLCanvasElement;
	} = {};
	readonly #contexts: {
		webgl?: CanvasContext;
		webgl2?: CanvasContext;
		webgpu?: CanvasContext;
	} = {};
	readonly #textureBinding = new Map<WebGLTexture, GLenum>();//TODO: remove ?
	readonly #seenTextures = new Set<WebGLTexture>();
	readonly #boundTexturesPerContext = new Map<WebGLAnyRenderingContext, WebGLTexture | null>();
	#id = 0;
	#htmlCanvasContainer?: HTMLElement;


	constructor() {
		Controller.addEventListener('recompileshader', (event) => this.#recompileShader(event.detail));
		Controller.addEventListener('identifyshader', (event) => this.#identifyShader(event.detail));
		Controller.addEventListener('resetshader', (event) => this.#resetShader(event.detail));

		readyPromise.then(() =>
			this.#htmlCanvasContainer = createElement('div', {
				//parent: document.body,
				style: 'position:absolute;bottom:0;left:0;width:20rem;height:20rem;z-index:1000;',
				//child: this.#mainCanvas?.canvas,
			})
		);
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

	addRecord(contextType: ContextType, context: WebGLAnyRenderingContext, functionName: string, func: Function, args: any[]/*, start: DOMHighResTimeStamp, duration: DOMHighResTimeStamp*/): any {
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

	#processRecord(contextType: ContextType, context: WebGLAnyRenderingContext, functionName: string, func: Function, args: any[]): any {
		switch (functionName) {
			case 'createProgram':
				{
					const program = func.apply(context, args);
					this.#programs.set(program, { program, contextType, context, } as ProgramRecord);
					//console.debug(`A ${contextType} program was created`, result, args[0]);
					return program;
				}
				break;
			case 'useProgram':
				{
					func.apply(context, args);
					const program = args[0] as WebGLProgram;
					this.#lastProgramUsage.set(program, performance.now());
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

					Controller.dispatchEvent('shadersource', { detail: shader });
				}
				break;
			case 'linkProgram':
				{
					func.apply(context, args);
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

					this.#siteUniformLocation.set(program, name, uniformLocation);

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
			case 'bindTexture':
				this.#textureBinding.set(args[1], args[0]);
				this.#boundTexturesPerContext.set(context, args[1]);
				func.apply(context, args);
				break;
			case 'texImage2D':
				func.apply(context, args);
				break;
			case 'compressedTexImage2D':
				this.#handleCompressedTexImage2D(contextType, context, args);
				func.apply(context, args);
				break;
			default:
				return func.apply(context, args);
				break;
		}
	}

	#handleCompressedTexImage2D(contextType: ContextType, context: WebGLAnyRenderingContext, args: any[]): void {
		const c = this.#getContext(contextType);
		if (!c) {
			return;
		}
		const subContext = c.context;

		const createProgram = getOriginalMethod(contextType, 'createProgram');
		const createShader = getOriginalMethod(contextType, 'createShader');
		const shaderSource = getOriginalMethod(contextType, 'shaderSource');
		const compileShader = getOriginalMethod(contextType, 'compileShader');
		const getShaderParameter = getOriginalMethod(contextType, 'getShaderParameter');
		const linkProgram = getOriginalMethod(contextType, 'linkProgram');
		const attachShader = getOriginalMethod(contextType, 'attachShader');
		const getProgramParameter = getOriginalMethod(contextType, 'getProgramParameter');
		const drawElements = getOriginalMethod(contextType, 'drawElements');
		const useProgram = getOriginalMethod(contextType, 'useProgram');
		const getUniformLocation = getOriginalMethod(contextType, 'getUniformLocation');
		const uniform1i = getOriginalMethod(contextType, 'uniform1i');
		const activeTexture = getOriginalMethod(contextType, 'activeTexture');
		const bindTexture = getOriginalMethod(contextType, 'bindTexture');
		const compressedTexImage2D = getOriginalMethod(contextType, 'compressedTexImage2D');
		const createTexture = getOriginalMethod(contextType, 'createTexture');
		const texParameteri = getOriginalMethod(contextType, 'texParameteri');
		const getExtension = getOriginalMethod(contextType, 'getExtension');
		const viewport = getOriginalMethod(contextType, 'viewport');
		if (!createProgram || !createShader || !shaderSource || !compileShader || !getShaderParameter
			|| !linkProgram || !attachShader || !getProgramParameter || !drawElements || !useProgram || !getUniformLocation
			|| !uniform1i || !activeTexture || !bindTexture || !compressedTexImage2D || !createTexture || !texParameteri || !getExtension
			|| !viewport
		) {
			return;
		}

		getExtension.apply(subContext, ['WEBGL_compressed_texture_s3tc']);//Graphics.getExtension('WEBGL_compressed_texture_s3tc');
		getExtension.apply(subContext, ['WEBGL_compressed_texture_s3tc_srgb']);//Graphics.getExtension('WEBGL_compressed_texture_s3tc_srgb');

		const program = createProgram.apply(subContext) as WebGLProgram;
		const vertexShader = createShader.apply(subContext, [subContext.VERTEX_SHADER]) as WebGLShader | null;
		const fragmentShader = createShader.apply(subContext, [subContext.FRAGMENT_SHADER]) as WebGLShader | null;
		if (!vertexShader || !fragmentShader) {
			return;
		}

		shaderSource.apply(subContext, [vertexShader, renderTextureVertex]);
		shaderSource.apply(subContext, [fragmentShader, renderTextureFragment]);

		compileShader.apply(subContext, [vertexShader]);
		compileShader.apply(subContext, [fragmentShader]);


		const compileStatusVertex = getShaderParameter.apply(subContext, [vertexShader, subContext.COMPILE_STATUS]);
		if (!compileStatusVertex) {
			//TODO: error message
			return;
		}
		const compileStatusFragment = getShaderParameter.apply(subContext, [fragmentShader, subContext.COMPILE_STATUS]);
		if (!compileStatusFragment) {
			//TODO: error message
			return;
		}

		attachShader.apply(subContext, [program, vertexShader]);
		attachShader.apply(subContext, [program, fragmentShader]);

		linkProgram.apply(subContext, [program]);
		const linkStatus = getProgramParameter.apply(subContext, [program, subContext.LINK_STATUS]);
		if (!linkStatus) {
			//TODO: error message
			return;
		}

		console.info('start of operations');

		useProgram.apply(subContext, [program]);

		if (!setupVertexAttributes(contextType, subContext, program,
			{
				index: {
					array: new Uint16Array([0, 2, 1, 2, 3, 1]),
					size: 1,
					attributeName: '',
				},
				position: {
					array: new Float32Array([-1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0]),
					size: 3,
					attributeName: 'aVertexPosition',
				},
				uv: {
					array: new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0]),
					size: 2,
					attributeName: 'aTextureCoord',
				},
			}
		)) {
			console.error(`${EXTENSION_NAME} failed to setup attributes in handleCompressedTexImage2D`);
			return;
		}

		const location = getUniformLocation.apply(subContext, [program, 'colorMap']) as WebGLUniformLocation | null;
		if (!location) {
			console.error(`${EXTENSION_NAME} failed to get colorMap location handleCompressedTexImage2D`);
			return
		}

		uniform1i.apply(subContext, [location, 0]);
		activeTexture.apply(subContext, [subContext.TEXTURE0]);
		const texture = createTexture.apply(subContext) as WebGLTexture;
		bindTexture.apply(subContext, [subContext.TEXTURE_2D, texture]);

		compressedTexImage2D.apply(subContext, args);

		texParameteri.apply(subContext, [subContext.TEXTURE_2D, subContext.TEXTURE_MAG_FILTER, subContext.LINEAR]);
		texParameteri.apply(subContext, [subContext.TEXTURE_2D, subContext.TEXTURE_MIN_FILTER, subContext.LINEAR]);


		const width = args[3];
		const height = args[4];

		c.canvas.width = width;
		c.canvas.height = height;

		viewport.apply(subContext, [0, 0, width, height]);

		drawElements.apply(subContext, [subContext.TRIANGLES, 6, subContext.UNSIGNED_SHORT, 0]);

		const image = new Image();
		image.src = c.canvas.toDataURL();

		if (image) {
			const texture = this.#boundTexturesPerContext.get(context);
			if (texture) {
				Controller.dispatchEvent('textureupdated', {
					detail: {
						contextType,
						context,
						texture,
						image,
					}
				});
			} else {
				console.error(`No texture bound for context ${contextType}`, context, texture);
			}
		}
	}

	#getContext(contextType: ContextType): CanvasContext | null {
		if (this.#contexts[contextType] !== undefined) {
			return this.#contexts[contextType];
		}

		const context = this.#getContext2(contextType);
		this.#contexts[contextType] = context as any;

		return context;
	}

	#getContext2(contextType: ContextType): CanvasContext | null {
		const canvas = this.#getcanvas(contextType, 256, 256);
		if (!canvas) {
			return null;
		}

		this.#htmlCanvasContainer?.append(canvas);

		const getContext = getOriginalMethod('canvas2d', 'getContext');
		if (!getContext) {
			return null;
		}

		const context = getContext.apply(canvas, [contextType]) as WebGLAnyRenderingContext | null;

		if (context) {
			return {
				canvas,
				context,
			};
		}
		return null;
	}

	#getcanvas(contextType: ContextType, width: number, height: number): HTMLCanvasElement {
		if (this.#canvases[contextType]) {
			return this.#canvases[contextType];
		}

		//const canvas = new OffscreenCanvas(width, height);
		const canvas = createElement('canvas', {
			width, height
		}) as HTMLCanvasElement;
		this.#canvases[contextType] = canvas;
		return canvas;
	}

	#getShader(contextType: ContextType, context: WebGLAnyRenderingContext, webGLShader: WebGLShader): ShaderRecord {
		let shader = this.#shaders.get(webGLShader);

		// Shader should exist at this point, but just in case
		if (!shader) {
			let shaderType = -1;

			// Get the shader type
			const getShaderParameter = getOriginalMethod(contextType, 'getShaderParameter');
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

	#getProgram(contextType: ContextType, context: WebGLAnyRenderingContext, webGLProgram: WebGLProgram): ProgramRecord {
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
		const shaderSource = getOriginalMethod(shader.contextType, 'shaderSource');
		const compileShader = getOriginalMethod(shader.contextType, 'compileShader');
		const getShaderParameter = getOriginalMethod(shader.contextType, 'getShaderParameter');
		const linkProgram = getOriginalMethod(shader.contextType, 'linkProgram');
		const getProgramParameter = getOriginalMethod(shader.contextType, 'getProgramParameter');
		const getParameter = getOriginalMethod(shader.contextType, 'getParameter');
		const useProgram = getOriginalMethod(shader.contextType, 'useProgram');
		if (!shaderSource || !compileShader || !getShaderParameter || !linkProgram || !getProgramParameter || !getParameter || !useProgram) {
			return;
		}

		// Recompile the shader
		shaderSource.apply(shader.context, [webGLShader, source]);
		compileShader.apply(shader.context, [webGLShader]);
		const compileStatus = getShaderParameter.apply(shader.context, [webGLShader, shader.context.COMPILE_STATUS]);
		//console.debug('compileShader result', compileStatus);
		if (!compileStatus) {
			const getShaderInfoLog = getOriginalMethod(shader.contextType, 'getShaderInfoLog');
			if (!getShaderInfoLog) {
				console.error(`${EXTENSION_NAME} failed to compile shader ${name} for an unknown reason`);
			} else {
				const shaderInfoLog = getShaderInfoLog.apply(shader.context, [webGLShader]);
				console.error(`${EXTENSION_NAME} failed to compile shader ${name}: ${shaderInfoLog}`);
			}
			return;
		}

		// Store the current program
		const currentProgram = getParameter.apply(shader.context, [shader.context.CURRENT_PROGRAM]) as WebGLProgram | null;

		// Link the program(s) the shader is attached to
		for (const [program, programRecord] of this.#programs) {
			if (programRecord.vertex !== webGLShader && programRecord.fragment !== webGLShader) {
				continue;
			}

			// Link the program
			linkProgram.apply(programRecord.context, [program]);
			const linkStatus = getProgramParameter.apply(programRecord.context, [program, programRecord.context.LINK_STATUS]);
			if (!linkStatus) {
				const getProgramInfoLog = getOriginalMethod(programRecord.contextType, 'getProgramInfoLog');
				if (!getProgramInfoLog) {
					console.error(`${EXTENSION_NAME} failed to link program for an unknown reason`);
				} else {
					const programInfoLog = getProgramInfoLog.apply(programRecord.context, [program]);
					console.error(`${EXTENSION_NAME} failed to link program: ${programInfoLog}`);
				}
				continue;
			}

			// Get the new uniforms
			const newUniforms = getProgramUniforms(programRecord);
			if (!newUniforms) {
				console.error(`${EXTENSION_NAME} failed to get program uniforms after linking `, programRecord);
				continue;
			}
			//console.debug('New program uniforms', newUniforms, programRecord);

			// Map the old uniforms to the new uniforms
			const programUniforms = this.#siteUniformLocation.getSubMap(program);
			if (!programUniforms) {
				console.error(`${EXTENSION_NAME} failed to get site knonw uniforms after linking `, programRecord);
				continue;
			}

			// Use the linked program
			useProgram.apply(programRecord.context, [program]);

			// Restore the uniform values. linkProgram set the uniforms to 0
			for (const [name, oldUniform] of programUniforms) {
				if (oldUniform === null) {
					continue;
				}
				const newUniform = newUniforms.get(name);
				if (!newUniform) {
					// Set the location to null, which will discard calls to uniform[1234][fi][v]
					this.#uniformLocations.set(oldUniform, null);
					continue;
				}

				this.#uniformLocations.set(oldUniform, newUniform);

				// Set the new value, the site may not update the value by itself
				const value = this.#uniformValues.get(oldUniform);
				if (value === undefined) {
					continue;
				}

				const uniformSetter = getOriginalMethod(shader.contextType, value.method);
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

	#identifyShader({ name }: IdentifyShader): void {
		console.info('identifyShader', name);
		const webGLShader = this.#shadersByName.get(name);
		if (!webGLShader) {
			console.error(`${EXTENSION_NAME} can't identify shader ${name}: shader not found`);
			return;
		}

		// Look for every program containg the shader
		// We may have to recompile several fragment shaders if a single vertex shader is attached to several fragment shaders
		const recompileFragments = new Map<string, string>();
		const regex = /^#version\s*(\d*)\s*(.*)\s*$/;
		for (const [program, programRecord] of this.#programs) {

			let fragmentName = '';
			if (programRecord.vertex === webGLShader) {
				// If we identify the vertex shader, search for the corresponding fragment
				const fragmentShader = this.#shaders.get(programRecord.fragment!);
				if (fragmentShader) {
					fragmentName = fragmentShader.name
					//recompileFragments.set(fragmentShader.name, fragmentShader.contextType);
				}
			} else if (programRecord.fragment === webGLShader) {
				fragmentName = name;
			}

			if (fragmentName === '') {
				continue;
			}

			recompileFragments.set(fragmentName, identify_shader_glsl_v1);

			// In case of a webgl2 context, look for the vertex shader version, our injected fragment shader must match
			const vertexShader = this.#shaders.get(programRecord.vertex!);
			if (programRecord.contextType === 'webgl2' && vertexShader && vertexShader.source) {
				const lines = vertexShader.source.split('\n');

				if (lines.length === 0) {
					continue;
				}

				if (lines[0] === '#version 300 es') {
					recompileFragments.set(fragmentName, identify_shader_glsl_v3);
				}
			}

		}

		// Recompile all
		for (const [name, source] of recompileFragments) {
			this.#recompileShader({ name, source });
			/*
			if (contextType == 'webgl') {
			} else if (contextType == 'webgl2') {
				this.#recompileShader({ name, source: identify_shader_webgl2 });
			}
			*/
		}
	}

	#resetShader({ name }: IdentifyShader): void {
		console.info('resetShader', name);
		const webGLShader = this.#shadersByName.get(name);
		if (!webGLShader) {
			console.error(`${EXTENSION_NAME} can't reset shader ${name}: shader not found`);
			return;
		}

		const shader = this.#shaders.get(webGLShader);
		if (!shader) {
			console.error(`${EXTENSION_NAME} can't reset shader ${name}: shader not found`);
			return;
		}

		if (shader.source === undefined) {
			console.error(`${EXTENSION_NAME} can't reset shader ${name}: shader source no set`);
			return;
		}

		this.#recompileShader({ name, source: shader.source });
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

function setupVertexAttributes(contextType: ContextType, context: WebGLAnyRenderingContext, program: WebGLProgram, geometryAttributes: WebGLAttributes): boolean {
	const getProgramParameter = getOriginalMethod(contextType, 'getProgramParameter');
	const getActiveAttrib = getOriginalMethod(contextType, 'getActiveAttrib');
	const getAttribLocation = getOriginalMethod(contextType, 'getAttribLocation');
	const createBuffer = getOriginalMethod(contextType, 'createBuffer');
	const bindBuffer = getOriginalMethod(contextType, 'bindBuffer');
	const bufferData = getOriginalMethod(contextType, 'bufferData');
	const enableVertexAttribArray = getOriginalMethod(contextType, 'enableVertexAttribArray');
	const vertexAttribPointer = getOriginalMethod(contextType, 'vertexAttribPointer');
	if (!getProgramParameter || !getActiveAttrib || !getAttribLocation || !createBuffer || !bindBuffer || !bufferData || !enableVertexAttribArray || !vertexAttribPointer) {
		return false;
	}

	const programAttributes = new Map<string, GLint>();

	const activeAttributes: GLint = getProgramParameter.apply(context, [program, context.ACTIVE_ATTRIBUTES]) as GLint;
	for (let i = 0; i < activeAttributes; i++) {
		const attribInfo = getActiveAttrib.apply(context, [program, i]) as WebGLActiveInfo;//this.#glContext.getActiveAttrib(this.#program, i);
		if (attribInfo) {
			const attributeLocation = getAttribLocation.apply(context, [program, attribInfo.name])
			programAttributes.set(attribInfo.name, attributeLocation);
		}
	}

	for (const name in geometryAttributes) {
		const attribute = geometryAttributes[name as 'index' | 'position' | 'uv'];
		const attributeLocation = programAttributes.get(attribute.attributeName);

		const buffer = createBuffer.apply(context) as WebGLBuffer;
		if (name == 'index') {
			bindBuffer.apply(context, [context.ELEMENT_ARRAY_BUFFER, buffer]);
			bufferData.apply(context, [context.ELEMENT_ARRAY_BUFFER, attribute.array, context.STATIC_DRAW]);
		} else if (attributeLocation !== undefined) {
			bindBuffer.apply(context, [context.ARRAY_BUFFER, buffer]);
			bufferData.apply(context, [context.ARRAY_BUFFER, attribute.array, context.STATIC_DRAW]);
			enableVertexAttribArray.apply(context, [attributeLocation]);
			vertexAttribPointer.apply(context, [attributeLocation, attribute.size, context.FLOAT, false, 0, 0]);
		}
	}
	return true;
}
type WebGLAttribute = {
	size: number,
	array: Uint16Array | Float32Array,
	attributeName: string,
}

type WebGLAttributes = {
	index: WebGLAttribute;
	position: WebGLAttribute;
	uv: WebGLAttribute;
}

type CanvasContext = {
	canvas: HTMLCanvasElement;
	context: WebGLAnyRenderingContext;
}

function getProgramUniforms(program: ProgramRecord): Map<string, WebGLUniformLocation> | null {
	const getProgramParameter = getOriginalMethod(program.contextType, 'getProgramParameter');
	const getActiveUniform = getOriginalMethod(program.contextType, 'getActiveUniform');
	const getUniformLocation = getOriginalMethod(program.contextType, 'getUniformLocation');
	if (!getProgramParameter || !getActiveUniform || !getUniformLocation) {
		return null;
	}

	const activeUniforms: GLint = getProgramParameter.apply(program.context, [program.program, program.context.ACTIVE_UNIFORMS]);
	const result = new Map<string, WebGLUniformLocation>();
	for (let i = 0; i < activeUniforms; i++) {
		const uniformInfo = getActiveUniform.apply(program.context, [program.program, i]) as WebGLActiveInfo | null;
		if (!uniformInfo) {
			console.error(`${EXTENSION_NAME} getActiveUniform returned null for uniform ${i}`, program);
			continue;
		}

		const uniformLocation = getUniformLocation.apply(program.context, [program.program, uniformInfo.name]) as WebGLUniformLocation | null;
		if (!uniformLocation) {
			//program.uniforms.set(attribInfo.name, uniformLocation);
			console.error(`${EXTENSION_NAME} getUniformLocation returned null for uniform ${uniformInfo.name}`, program);
			continue;
		}

		result.set(uniformInfo.name.replace('[0]', ''), uniformLocation);
	}
	return result;
}
