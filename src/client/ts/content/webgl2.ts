
const oldWebGL2RenderingContext = window.WebGL2RenderingContext;

export function initWebGL2() {
	console.log(oldWebGL2RenderingContext);
}

export class MyWebGL2RenderingContext implements WebGL2RenderingContext {
	readonly #renderingContext: WebGL2RenderingContext;
	readonly DEPTH_BUFFER_BIT = 0x00000100;
	readonly STENCIL_BUFFER_BIT = 0x00000400;
	readonly COLOR_BUFFER_BIT = 0x00004000;
	readonly POINTS = 0x0000;
	readonly LINES = 0x0001;
	readonly LINE_LOOP = 0x0002;
	readonly LINE_STRIP = 0x0003;
	readonly TRIANGLES = 0x0004;
	readonly TRIANGLE_STRIP = 0x0005;
	readonly TRIANGLE_FAN = 0x0006;
	readonly ZERO = 0;
	readonly ONE = 1;
	readonly SRC_COLOR = 0x0300;
	readonly ONE_MINUS_SRC_COLOR = 0x0301;
	readonly SRC_ALPHA = 0x0302;
	readonly ONE_MINUS_SRC_ALPHA = 0x0303;
	readonly DST_ALPHA = 0x0304;
	readonly ONE_MINUS_DST_ALPHA = 0x0305;
	readonly DST_COLOR = 0x0306;
	readonly ONE_MINUS_DST_COLOR = 0x0307;
	readonly SRC_ALPHA_SATURATE = 0x0308;
	readonly FUNC_ADD = 0x8006;
	readonly BLEND_EQUATION = 0x8009;
	readonly BLEND_EQUATION_RGB = 0x8009;
	readonly BLEND_EQUATION_ALPHA = 0x883D;
	readonly FUNC_SUBTRACT = 0x800A;
	readonly FUNC_REVERSE_SUBTRACT = 0x800B;
	readonly BLEND_DST_RGB = 0x80C8;
	readonly BLEND_SRC_RGB = 0x80C9;
	readonly BLEND_DST_ALPHA = 0x80CA;
	readonly BLEND_SRC_ALPHA = 0x80CB;
	readonly CONSTANT_COLOR = 0x8001;
	readonly ONE_MINUS_CONSTANT_COLOR = 0x8002;
	readonly CONSTANT_ALPHA = 0x8003;
	readonly ONE_MINUS_CONSTANT_ALPHA = 0x8004;
	readonly BLEND_COLOR = 0x8005;
	readonly ARRAY_BUFFER = 0x8892;
	readonly ELEMENT_ARRAY_BUFFER = 0x8893;
	readonly ARRAY_BUFFER_BINDING = 0x8894;
	readonly ELEMENT_ARRAY_BUFFER_BINDING = 0x8895;
	readonly STREAM_DRAW = 0x88E0;
	readonly STATIC_DRAW = 0x88E4;
	readonly DYNAMIC_DRAW = 0x88E8;
	readonly BUFFER_SIZE = 0x8764;
	readonly BUFFER_USAGE = 0x8765;
	readonly CURRENT_VERTEX_ATTRIB = 0x8626;
	readonly FRONT = 0x0404;
	readonly BACK = 0x0405;
	readonly FRONT_AND_BACK = 0x0408;
	readonly CULL_FACE = 0x0B44;
	readonly BLEND = 0x0BE2;
	readonly DITHER = 0x0BD0;
	readonly STENCIL_TEST = 0x0B90;
	readonly DEPTH_TEST = 0x0B71;
	readonly SCISSOR_TEST = 0x0C11;
	readonly POLYGON_OFFSET_FILL = 0x8037;
	readonly SAMPLE_ALPHA_TO_COVERAGE = 0x809E;
	readonly SAMPLE_COVERAGE = 0x80A0;
	readonly NO_ERROR = 0;
	readonly INVALID_ENUM = 0x0500;
	readonly INVALID_VALUE = 0x0501;
	readonly INVALID_OPERATION = 0x0502;
	readonly OUT_OF_MEMORY = 0x0505;
	readonly CW = 0x0900;
	readonly CCW = 0x0901;
	readonly LINE_WIDTH = 0x0B21;
	readonly ALIASED_POINT_SIZE_RANGE = 0x846D;
	readonly ALIASED_LINE_WIDTH_RANGE = 0x846E;
	readonly CULL_FACE_MODE = 0x0B45;
	readonly FRONT_FACE = 0x0B46;
	readonly DEPTH_RANGE = 0x0B70;
	readonly DEPTH_WRITEMASK = 0x0B72;
	readonly DEPTH_CLEAR_VALUE = 0x0B73;
	readonly DEPTH_FUNC = 0x0B74;
	readonly STENCIL_CLEAR_VALUE = 0x0B91;
	readonly STENCIL_FUNC = 0x0B92;
	readonly STENCIL_FAIL = 0x0B94;
	readonly STENCIL_PASS_DEPTH_FAIL = 0x0B95;
	readonly STENCIL_PASS_DEPTH_PASS = 0x0B96;
	readonly STENCIL_REF = 0x0B97;
	readonly STENCIL_VALUE_MASK = 0x0B93;
	readonly STENCIL_WRITEMASK = 0x0B98;
	readonly STENCIL_BACK_FUNC = 0x8800;
	readonly STENCIL_BACK_FAIL = 0x8801;
	readonly STENCIL_BACK_PASS_DEPTH_FAIL = 0x8802;
	readonly STENCIL_BACK_PASS_DEPTH_PASS = 0x8803;
	readonly STENCIL_BACK_REF = 0x8CA3;
	readonly STENCIL_BACK_VALUE_MASK = 0x8CA4;
	readonly STENCIL_BACK_WRITEMASK = 0x8CA5;
	readonly VIEWPORT = 0x0BA2;
	readonly SCISSOR_BOX = 0x0C10;
	readonly COLOR_CLEAR_VALUE = 0x0C22;
	readonly COLOR_WRITEMASK = 0x0C23;
	readonly UNPACK_ALIGNMENT = 0x0CF5;
	readonly PACK_ALIGNMENT = 0x0D05;
	readonly MAX_TEXTURE_SIZE = 0x0D33;
	readonly MAX_VIEWPORT_DIMS = 0x0D3A;
	readonly SUBPIXEL_BITS = 0x0D50;
	readonly RED_BITS = 0x0D52;
	readonly GREEN_BITS = 0x0D53;
	readonly BLUE_BITS = 0x0D54;
	readonly ALPHA_BITS = 0x0D55;
	readonly DEPTH_BITS = 0x0D56;
	readonly STENCIL_BITS = 0x0D57;
	readonly POLYGON_OFFSET_UNITS = 0x2A00;
	readonly POLYGON_OFFSET_FACTOR = 0x8038;
	readonly TEXTURE_BINDING_2D = 0x8069;
	readonly SAMPLE_BUFFERS = 0x80A8;
	readonly SAMPLES = 0x80A9;
	readonly SAMPLE_COVERAGE_VALUE = 0x80AA;
	readonly SAMPLE_COVERAGE_INVERT = 0x80AB;
	readonly COMPRESSED_TEXTURE_FORMATS = 0x86A3;
	readonly DONT_CARE = 0x1100;
	readonly FASTEST = 0x1101;
	readonly NICEST = 0x1102;
	readonly GENERATE_MIPMAP_HINT = 0x8192;
	readonly BYTE = 0x1400;
	readonly UNSIGNED_BYTE = 0x1401;
	readonly SHORT = 0x1402;
	readonly UNSIGNED_SHORT = 0x1403;
	readonly INT = 0x1404;
	readonly UNSIGNED_INT = 0x1405;
	readonly FLOAT = 0x1406;
	readonly DEPTH_COMPONENT = 0x1902;
	readonly ALPHA = 0x1906;
	readonly RGB = 0x1907;
	readonly RGBA = 0x1908;
	readonly LUMINANCE = 0x1909;
	readonly LUMINANCE_ALPHA = 0x190A;
	readonly UNSIGNED_SHORT_4_4_4_4 = 0x8033;
	readonly UNSIGNED_SHORT_5_5_5_1 = 0x8034;
	readonly UNSIGNED_SHORT_5_6_5 = 0x8363;
	readonly FRAGMENT_SHADER = 0x8B30;
	readonly VERTEX_SHADER = 0x8B31;
	readonly MAX_VERTEX_ATTRIBS = 0x8869;
	readonly MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB;
	readonly MAX_VARYING_VECTORS = 0x8DFC;
	readonly MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
	readonly MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C;
	readonly MAX_TEXTURE_IMAGE_UNITS = 0x8872;
	readonly MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD;
	readonly SHADER_TYPE = 0x8B4F;
	readonly DELETE_STATUS = 0x8B80;
	readonly LINK_STATUS = 0x8B82;
	readonly VALIDATE_STATUS = 0x8B83;
	readonly ATTACHED_SHADERS = 0x8B85;
	readonly ACTIVE_UNIFORMS = 0x8B86;
	readonly ACTIVE_ATTRIBUTES = 0x8B89;
	readonly SHADING_LANGUAGE_VERSION = 0x8B8C;
	readonly CURRENT_PROGRAM = 0x8B8D;
	readonly NEVER = 0x0200;
	readonly LESS = 0x0201;
	readonly EQUAL = 0x0202;
	readonly LEQUAL = 0x0203;
	readonly GREATER = 0x0204;
	readonly NOTEQUAL = 0x0205;
	readonly GEQUAL = 0x0206;
	readonly ALWAYS = 0x0207;
	readonly KEEP = 0x1E00;
	readonly REPLACE = 0x1E01;
	readonly INCR = 0x1E02;
	readonly DECR = 0x1E03;
	readonly INVERT = 0x150A;
	readonly INCR_WRAP = 0x8507;
	readonly DECR_WRAP = 0x8508;
	readonly VENDOR = 0x1F00;
	readonly RENDERER = 0x1F01;
	readonly VERSION = 0x1F02;
	readonly NEAREST = 0x2600;
	readonly LINEAR = 0x2601;
	readonly NEAREST_MIPMAP_NEAREST = 0x2700;
	readonly LINEAR_MIPMAP_NEAREST = 0x2701;
	readonly NEAREST_MIPMAP_LINEAR = 0x2702;
	readonly LINEAR_MIPMAP_LINEAR = 0x2703;
	readonly TEXTURE_MAG_FILTER = 0x2800;
	readonly TEXTURE_MIN_FILTER = 0x2801;
	readonly TEXTURE_WRAP_S = 0x2802;
	readonly TEXTURE_WRAP_T = 0x2803;
	readonly TEXTURE_2D = 0x0DE1;
	readonly TEXTURE = 0x1702;
	readonly TEXTURE_CUBE_MAP = 0x8513;
	readonly TEXTURE_BINDING_CUBE_MAP = 0x8514;
	readonly TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
	readonly TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516;
	readonly TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517;
	readonly TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518;
	readonly TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519;
	readonly TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A;
	readonly MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C;
	readonly TEXTURE0 = 0x84C0;
	readonly TEXTURE1 = 0x84C1;
	readonly TEXTURE2 = 0x84C2;
	readonly TEXTURE3 = 0x84C3;
	readonly TEXTURE4 = 0x84C4;
	readonly TEXTURE5 = 0x84C5;
	readonly TEXTURE6 = 0x84C6;
	readonly TEXTURE7 = 0x84C7;
	readonly TEXTURE8 = 0x84C8;
	readonly TEXTURE9 = 0x84C9;
	readonly TEXTURE10 = 0x84CA;
	readonly TEXTURE11 = 0x84CB;
	readonly TEXTURE12 = 0x84CC;
	readonly TEXTURE13 = 0x84CD;
	readonly TEXTURE14 = 0x84CE;
	readonly TEXTURE15 = 0x84CF;
	readonly TEXTURE16 = 0x84D0;
	readonly TEXTURE17 = 0x84D1;
	readonly TEXTURE18 = 0x84D2;
	readonly TEXTURE19 = 0x84D3;
	readonly TEXTURE20 = 0x84D4;
	readonly TEXTURE21 = 0x84D5;
	readonly TEXTURE22 = 0x84D6;
	readonly TEXTURE23 = 0x84D7;
	readonly TEXTURE24 = 0x84D8;
	readonly TEXTURE25 = 0x84D9;
	readonly TEXTURE26 = 0x84DA;
	readonly TEXTURE27 = 0x84DB;
	readonly TEXTURE28 = 0x84DC;
	readonly TEXTURE29 = 0x84DD;
	readonly TEXTURE30 = 0x84DE;
	readonly TEXTURE31 = 0x84DF;
	readonly ACTIVE_TEXTURE = 0x84E0;
	readonly REPEAT = 0x2901;
	readonly CLAMP_TO_EDGE = 0x812F;
	readonly MIRRORED_REPEAT = 0x8370;
	readonly FLOAT_VEC2 = 0x8B50;
	readonly FLOAT_VEC3 = 0x8B51;
	readonly FLOAT_VEC4 = 0x8B52;
	readonly INT_VEC2 = 0x8B53;
	readonly INT_VEC3 = 0x8B54;
	readonly INT_VEC4 = 0x8B55;
	readonly BOOL = 0x8B56;
	readonly BOOL_VEC2 = 0x8B57;
	readonly BOOL_VEC3 = 0x8B58;
	readonly BOOL_VEC4 = 0x8B59;
	readonly FLOAT_MAT2 = 0x8B5A;
	readonly FLOAT_MAT3 = 0x8B5B;
	readonly FLOAT_MAT4 = 0x8B5C;
	readonly SAMPLER_2D = 0x8B5E;
	readonly SAMPLER_CUBE = 0x8B60;
	readonly VERTEX_ATTRIB_ARRAY_ENABLED = 0x8622;
	readonly VERTEX_ATTRIB_ARRAY_SIZE = 0x8623;
	readonly VERTEX_ATTRIB_ARRAY_STRIDE = 0x8624;
	readonly VERTEX_ATTRIB_ARRAY_TYPE = 0x8625;
	readonly VERTEX_ATTRIB_ARRAY_NORMALIZED = 0x886A;
	readonly VERTEX_ATTRIB_ARRAY_POINTER = 0x8645;
	readonly VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0x889F;
	readonly IMPLEMENTATION_COLOR_READ_TYPE = 0x8B9A;
	readonly IMPLEMENTATION_COLOR_READ_FORMAT = 0x8B9B;
	readonly COMPILE_STATUS = 0x8B81;
	readonly LOW_FLOAT = 0x8DF0;
	readonly MEDIUM_FLOAT = 0x8DF1;
	readonly HIGH_FLOAT = 0x8DF2;
	readonly LOW_INT = 0x8DF3;
	readonly MEDIUM_INT = 0x8DF4;
	readonly HIGH_INT = 0x8DF5;
	readonly FRAMEBUFFER = 0x8D40;
	readonly RENDERBUFFER = 0x8D41;
	readonly RGBA4 = 0x8056;
	readonly RGB5_A1 = 0x8057;
	readonly RGBA8 = 0x8058;
	readonly RGB565 = 0x8D62;
	readonly DEPTH_COMPONENT16 = 0x81A5;
	readonly STENCIL_INDEX8 = 0x8D48;
	readonly DEPTH_STENCIL = 0x84F9;
	readonly RENDERBUFFER_WIDTH = 0x8D42;
	readonly RENDERBUFFER_HEIGHT = 0x8D43;
	readonly RENDERBUFFER_INTERNAL_FORMAT = 0x8D44;
	readonly RENDERBUFFER_RED_SIZE = 0x8D50;
	readonly RENDERBUFFER_GREEN_SIZE = 0x8D51;
	readonly RENDERBUFFER_BLUE_SIZE = 0x8D52;
	readonly RENDERBUFFER_ALPHA_SIZE = 0x8D53;
	readonly RENDERBUFFER_DEPTH_SIZE = 0x8D54;
	readonly RENDERBUFFER_STENCIL_SIZE = 0x8D55;
	readonly FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 0x8CD0;
	readonly FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 0x8CD1;
	readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 0x8CD2;
	readonly FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 0x8CD3;
	readonly COLOR_ATTACHMENT0 = 0x8CE0;
	readonly DEPTH_ATTACHMENT = 0x8D00;
	readonly STENCIL_ATTACHMENT = 0x8D20;
	readonly DEPTH_STENCIL_ATTACHMENT = 0x821A;
	readonly NONE = 0;
	readonly FRAMEBUFFER_COMPLETE = 0x8CD5;
	readonly FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6;
	readonly FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;
	readonly FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9;
	readonly FRAMEBUFFER_UNSUPPORTED = 0x8CDD;
	readonly FRAMEBUFFER_BINDING = 0x8CA6;
	readonly RENDERBUFFER_BINDING = 0x8CA7;
	readonly MAX_RENDERBUFFER_SIZE = 0x84E8;
	readonly INVALID_FRAMEBUFFER_OPERATION = 0x0506;
	readonly UNPACK_FLIP_Y_WEBGL = 0x9240;
	readonly UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
	readonly CONTEXT_LOST_WEBGL = 0x9242;
	readonly UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;
	readonly BROWSER_DEFAULT_WEBGL = 0x9244;

	constructor(renderingContext: WebGL2RenderingContext) {
		this.#renderingContext = renderingContext;
	}
	beginQuery(target: GLenum, query: WebGLQuery, ): void {
		console.info('MyWebGL2RenderingContext beginQuery', target, query, );
		return this.#renderingContext.beginQuery(target, query, );
	}

	beginTransformFeedback(primitiveMode: GLenum, ): void {
		console.info('MyWebGL2RenderingContext beginTransformFeedback', primitiveMode, );
		return this.#renderingContext.beginTransformFeedback(primitiveMode, );
	}

	bindBufferBase(target: GLenum, index: GLuint, buffer: WebGLBuffer | null, ): void {
		console.info('MyWebGL2RenderingContext bindBufferBase', target, index, buffer, );
		return this.#renderingContext.bindBufferBase(target, index, buffer, );
	}

	bindBufferRange(target: GLenum, index: GLuint, buffer: WebGLBuffer | null, offset: GLintptr, size: GLsizeiptr, ): void {
		console.info('MyWebGL2RenderingContext bindBufferRange', target, index, buffer, offset, size, );
		return this.#renderingContext.bindBufferRange(target, index, buffer, offset, size, );
	}

	bindSampler(unit: GLuint, sampler: WebGLSampler | null, ): void {
		console.info('MyWebGL2RenderingContext bindSampler', unit, sampler, );
		return this.#renderingContext.bindSampler(unit, sampler, );
	}

	bindTransformFeedback(target: GLenum, tf: WebGLTransformFeedback | null, ): void {
		console.info('MyWebGL2RenderingContext bindTransformFeedback', target, tf, );
		return this.#renderingContext.bindTransformFeedback(target, tf, );
	}

	bindVertexArray(array: WebGLVertexArrayObject | null, ): void {
		console.info('MyWebGL2RenderingContext bindVertexArray', array, );
		return this.#renderingContext.bindVertexArray(array, );
	}

	blitFramebuffer(srcX0: GLint, srcY0: GLint, srcX1: GLint, srcY1: GLint, dstX0: GLint, dstY0: GLint, dstX1: GLint, dstY1: GLint, mask: GLbitfield, filter: GLenum, ): void {
		console.info('MyWebGL2RenderingContext blitFramebuffer', srcX0, srcY0, srcX1, srcY1, dstX0, dstY0, dstX1, dstY1, mask, filter, );
		return this.#renderingContext.blitFramebuffer(srcX0, srcY0, srcX1, srcY1, dstX0, dstY0, dstX1, dstY1, mask, filter, );
	}

	clearBufferfi(buffer: GLenum, drawbuffer: GLint, depth: GLfloat, stencil: GLint, ): void {
		console.info('MyWebGL2RenderingContext clearBufferfi', buffer, drawbuffer, depth, stencil, );
		return this.#renderingContext.clearBufferfi(buffer, drawbuffer, depth, stencil, );
	}

	clearBufferfv(buffer: GLenum, drawbuffer: GLint, values: Float32List, srcOffset: number, ): void {
		console.info('MyWebGL2RenderingContext clearBufferfv', buffer, drawbuffer, values, srcOffset, );
		return this.#renderingContext.clearBufferfv(buffer, drawbuffer, values, srcOffset, );
	}

	clearBufferiv(buffer: GLenum, drawbuffer: GLint, values: Int32List, srcOffset: number, ): void {
		console.info('MyWebGL2RenderingContext clearBufferiv', buffer, drawbuffer, values, srcOffset, );
		return this.#renderingContext.clearBufferiv(buffer, drawbuffer, values, srcOffset, );
	}

	clearBufferuiv(buffer: GLenum, drawbuffer: GLint, values: Uint32List, srcOffset: number, ): void {
		console.info('MyWebGL2RenderingContext clearBufferuiv', buffer, drawbuffer, values, srcOffset, );
		return this.#renderingContext.clearBufferuiv(buffer, drawbuffer, values, srcOffset, );
	}

	clientWaitSync(sync: WebGLSync, flags: GLbitfield, timeout: GLuint64, ): GLenum {
		console.info('MyWebGL2RenderingContext clientWaitSync', sync, flags, timeout, );
		return this.#renderingContext.clientWaitSync(sync, flags, timeout, );
	}

	compressedTexImage3D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, imageSize: GLsizei, offset: GLintptr, ): void {
		console.info('MyWebGL2RenderingContext compressedTexImage3D', target, level, internalformat, width, height, depth, border, imageSize, offset, );
		return this.#renderingContext.compressedTexImage3D(target, level, internalformat, width, height, depth, border, imageSize, offset, );
	}

	compressedTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, imageSize: GLsizei, offset: GLintptr, ): void {
		console.info('MyWebGL2RenderingContext compressedTexSubImage3D', target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, offset, );
		return this.#renderingContext.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, offset, );
	}

	copyBufferSubData(readTarget: GLenum, writeTarget: GLenum, readOffset: GLintptr, writeOffset: GLintptr, size: GLsizeiptr, ): void {
		console.info('MyWebGL2RenderingContext copyBufferSubData', readTarget, writeTarget, readOffset, writeOffset, size, );
		return this.#renderingContext.copyBufferSubData(readTarget, writeTarget, readOffset, writeOffset, size, );
	}

	copyTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, x: GLint, y: GLint, width: GLsizei, height: GLsizei, ): void {
		console.info('MyWebGL2RenderingContext copyTexSubImage3D', target, level, xoffset, yoffset, zoffset, x, y, width, height, );
		return this.#renderingContext.copyTexSubImage3D(target, level, xoffset, yoffset, zoffset, x, y, width, height, );
	}

	createQuery(): WebGLQuery {
		console.info('MyWebGL2RenderingContext createQuery', );
		return this.#renderingContext.createQuery();
	}

	createSampler(): WebGLSampler {
		console.info('MyWebGL2RenderingContext createSampler', );
		return this.#renderingContext.createSampler();
	}

	createTransformFeedback(): WebGLTransformFeedback {
		console.info('MyWebGL2RenderingContext createTransformFeedback', );
		return this.#renderingContext.createTransformFeedback();
	}

	createVertexArray(): WebGLVertexArrayObject {
		console.info('MyWebGL2RenderingContext createVertexArray', );
		return this.#renderingContext.createVertexArray();
	}

	deleteQuery(query: WebGLQuery | null, ): void {
		console.info('MyWebGL2RenderingContext deleteQuery', query, );
		return this.#renderingContext.deleteQuery(query, );
	}

	deleteSampler(sampler: WebGLSampler | null, ): void {
		console.info('MyWebGL2RenderingContext deleteSampler', sampler, );
		return this.#renderingContext.deleteSampler(sampler, );
	}

	deleteSync(sync: WebGLSync | null, ): void {
		console.info('MyWebGL2RenderingContext deleteSync', sync, );
		return this.#renderingContext.deleteSync(sync, );
	}

	deleteTransformFeedback(tf: WebGLTransformFeedback | null, ): void {
		console.info('MyWebGL2RenderingContext deleteTransformFeedback', tf, );
		return this.#renderingContext.deleteTransformFeedback(tf, );
	}

	deleteVertexArray(vertexArray: WebGLVertexArrayObject | null, ): void {
		console.info('MyWebGL2RenderingContext deleteVertexArray', vertexArray, );
		return this.#renderingContext.deleteVertexArray(vertexArray, );
	}

	drawArraysInstanced(mode: GLenum, first: GLint, count: GLsizei, instanceCount: GLsizei, ): void {
		console.info('MyWebGL2RenderingContext drawArraysInstanced', mode, first, count, instanceCount, );
		return this.#renderingContext.drawArraysInstanced(mode, first, count, instanceCount, );
	}

	drawBuffers(buffers: GLenum[], ): void {
		console.info('MyWebGL2RenderingContext drawBuffers', buffers, );
		return this.#renderingContext.drawBuffers(buffers, );
	}

	drawElementsInstanced(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr, instanceCount: GLsizei, ): void {
		console.info('MyWebGL2RenderingContext drawElementsInstanced', mode, count, type, offset, instanceCount, );
		return this.#renderingContext.drawElementsInstanced(mode, count, type, offset, instanceCount, );
	}

	drawRangeElements(mode: GLenum, start: GLuint, end: GLuint, count: GLsizei, type: GLenum, offset: GLintptr, ): void {
		console.info('MyWebGL2RenderingContext drawRangeElements', mode, start, end, count, type, offset, );
		return this.#renderingContext.drawRangeElements(mode, start, end, count, type, offset, );
	}

	endQuery(target: GLenum, ): void {
		console.info('MyWebGL2RenderingContext endQuery', target, );
		return this.#renderingContext.endQuery(target, );
	}

	endTransformFeedback(): void {
		console.info('MyWebGL2RenderingContext endTransformFeedback', );
		return this.#renderingContext.endTransformFeedback();
	}

	fenceSync(condition: GLenum, flags: GLbitfield, ): WebGLSync | null {
		console.info('MyWebGL2RenderingContext fenceSync', condition, flags, );
		return this.#renderingContext.fenceSync(condition, flags, );
	}

	framebufferTextureLayer(target: GLenum, attachment: GLenum, texture: WebGLTexture | null, level: GLint, layer: GLint, ): void {
		console.info('MyWebGL2RenderingContext framebufferTextureLayer', target, attachment, texture, level, layer, );
		return this.#renderingContext.framebufferTextureLayer(target, attachment, texture, level, layer, );
	}

	getActiveUniformBlockName(program: WebGLProgram, uniformBlockIndex: GLuint, ): string | null {
		console.info('MyWebGL2RenderingContext getActiveUniformBlockName', program, uniformBlockIndex, );
		return this.#renderingContext.getActiveUniformBlockName(program, uniformBlockIndex, );
	}

	getActiveUniformBlockParameter(program: WebGLProgram, uniformBlockIndex: GLuint, pname: GLenum, ): any {
		console.info('MyWebGL2RenderingContext getActiveUniformBlockParameter', program, uniformBlockIndex, pname, );
		return this.#renderingContext.getActiveUniformBlockParameter(program, uniformBlockIndex, pname, );
	}

	getActiveUniforms(program: WebGLProgram, uniformIndices: GLuint[], pname: GLenum, ): any {
		console.info('MyWebGL2RenderingContext getActiveUniforms', program, uniformIndices, pname, );
		return this.#renderingContext.getActiveUniforms(program, uniformIndices, pname, );
	}

	getBufferSubData(target: GLenum, srcByteOffset: GLintptr, dstBuffer: ArrayBufferView<ArrayBufferLike>, dstOffset: number, length: GLuint, ): void {
		console.info('MyWebGL2RenderingContext getBufferSubData', target, srcByteOffset, dstBuffer, dstOffset, length, );
		return this.#renderingContext.getBufferSubData(target, srcByteOffset, dstBuffer, dstOffset, length, );
	}

	getFragDataLocation(program: WebGLProgram, name: string, ): GLint {
		console.info('MyWebGL2RenderingContext getFragDataLocation', program, name, );
		return this.#renderingContext.getFragDataLocation(program, name, );
	}

	getIndexedParameter(target: GLenum, index: GLuint, ): any {
		console.info('MyWebGL2RenderingContext getIndexedParameter', target, index, );
		return this.#renderingContext.getIndexedParameter(target, index, );
	}

	getInternalformatParameter(target: GLenum, internalformat: GLenum, pname: GLenum, ): any {
		console.info('MyWebGL2RenderingContext getInternalformatParameter', target, internalformat, pname, );
		return this.#renderingContext.getInternalformatParameter(target, internalformat, pname, );
	}

	getQuery(target: GLenum, pname: GLenum, ): WebGLQuery | null {
		console.info('MyWebGL2RenderingContext getQuery', target, pname, );
		return this.#renderingContext.getQuery(target, pname, );
	}

	getQueryParameter(query: WebGLQuery, pname: GLenum, ): any {
		console.info('MyWebGL2RenderingContext getQueryParameter', query, pname, );
		return this.#renderingContext.getQueryParameter(query, pname, );
	}

	getSamplerParameter(sampler: WebGLSampler, pname: GLenum, ): any {
		console.info('MyWebGL2RenderingContext getSamplerParameter', sampler, pname, );
		return this.#renderingContext.getSamplerParameter(sampler, pname, );
	}

	getSyncParameter(sync: WebGLSync, pname: GLenum, ): any {
		console.info('MyWebGL2RenderingContext getSyncParameter', sync, pname, );
		return this.#renderingContext.getSyncParameter(sync, pname, );
	}

	getTransformFeedbackVarying(program: WebGLProgram, index: GLuint, ): WebGLActiveInfo | null {
		console.info('MyWebGL2RenderingContext getTransformFeedbackVarying', program, index, );
		return this.#renderingContext.getTransformFeedbackVarying(program, index, );
	}

	getUniformBlockIndex(program: WebGLProgram, uniformBlockName: string, ): GLuint {
		console.info('MyWebGL2RenderingContext getUniformBlockIndex', program, uniformBlockName, );
		return this.#renderingContext.getUniformBlockIndex(program, uniformBlockName, );
	}

	getUniformIndices(program: WebGLProgram, uniformNames: string[], ): GLuint[] | null {
		console.info('MyWebGL2RenderingContext getUniformIndices', program, uniformNames, );
		return this.#renderingContext.getUniformIndices(program, uniformNames, );
	}

	invalidateFramebuffer(target: GLenum, attachments: GLenum[], ): void {
		console.info('MyWebGL2RenderingContext invalidateFramebuffer', target, attachments, );
		return this.#renderingContext.invalidateFramebuffer(target, attachments, );
	}

	invalidateSubFramebuffer(target: GLenum, attachments: GLenum[], x: GLint, y: GLint, width: GLsizei, height: GLsizei, ): void {
		console.info('MyWebGL2RenderingContext invalidateSubFramebuffer', target, attachments, x, y, width, height, );
		return this.#renderingContext.invalidateSubFramebuffer(target, attachments, x, y, width, height, );
	}

	isQuery(query: WebGLQuery | null, ): GLboolean {
		console.info('MyWebGL2RenderingContext isQuery', query, );
		return this.#renderingContext.isQuery(query, );
	}

	isSampler(sampler: WebGLSampler | null, ): GLboolean {
		console.info('MyWebGL2RenderingContext isSampler', sampler, );
		return this.#renderingContext.isSampler(sampler, );
	}

	isSync(sync: WebGLSync | null, ): GLboolean {
		console.info('MyWebGL2RenderingContext isSync', sync, );
		return this.#renderingContext.isSync(sync, );
	}

	isTransformFeedback(tf: WebGLTransformFeedback | null, ): GLboolean {
		console.info('MyWebGL2RenderingContext isTransformFeedback', tf, );
		return this.#renderingContext.isTransformFeedback(tf, );
	}

	isVertexArray(vertexArray: WebGLVertexArrayObject | null, ): GLboolean {
		console.info('MyWebGL2RenderingContext isVertexArray', vertexArray, );
		return this.#renderingContext.isVertexArray(vertexArray, );
	}

	pauseTransformFeedback(): void {
		console.info('MyWebGL2RenderingContext pauseTransformFeedback', );
		return this.#renderingContext.pauseTransformFeedback();
	}

	readBuffer(src: GLenum, ): void {
		console.info('MyWebGL2RenderingContext readBuffer', src, );
		return this.#renderingContext.readBuffer(src, );
	}

	renderbufferStorageMultisample(target: GLenum, samples: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei, ): void {
		console.info('MyWebGL2RenderingContext renderbufferStorageMultisample', target, samples, internalformat, width, height, );
		return this.#renderingContext.renderbufferStorageMultisample(target, samples, internalformat, width, height, );
	}

	resumeTransformFeedback(): void {
		console.info('MyWebGL2RenderingContext resumeTransformFeedback', );
		return this.#renderingContext.resumeTransformFeedback();
	}

	samplerParameterf(sampler: WebGLSampler, pname: GLenum, param: GLfloat, ): void {
		console.info('MyWebGL2RenderingContext samplerParameterf', sampler, pname, param, );
		return this.#renderingContext.samplerParameterf(sampler, pname, param, );
	}

	samplerParameteri(sampler: WebGLSampler, pname: GLenum, param: GLint, ): void {
		console.info('MyWebGL2RenderingContext samplerParameteri', sampler, pname, param, );
		return this.#renderingContext.samplerParameteri(sampler, pname, param, );
	}

	texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, pboOffset: GLintptr, ): void {
		console.info('MyWebGL2RenderingContext texImage3D', target, level, internalformat, width, height, depth, border, format, type, pboOffset, );
		return this.#renderingContext.texImage3D(target, level, internalformat, width, height, depth, border, format, type, pboOffset, );
	}

	texStorage2D(target: GLenum, levels: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei, ): void {
		console.info('MyWebGL2RenderingContext texStorage2D', target, levels, internalformat, width, height, );
		return this.#renderingContext.texStorage2D(target, levels, internalformat, width, height, );
	}

	texStorage3D(target: GLenum, levels: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei, ): void {
		console.info('MyWebGL2RenderingContext texStorage3D', target, levels, internalformat, width, height, depth, );
		return this.#renderingContext.texStorage3D(target, levels, internalformat, width, height, depth, );
	}

	texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr, ): void {
		console.info('MyWebGL2RenderingContext texSubImage3D', target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pboOffset, );
		return this.#renderingContext.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pboOffset, );
	}

	transformFeedbackVaryings(program: WebGLProgram, varyings: string[], bufferMode: GLenum, ): void {
		console.info('MyWebGL2RenderingContext transformFeedbackVaryings', program, varyings, bufferMode, );
		return this.#renderingContext.transformFeedbackVaryings(program, varyings, bufferMode, );
	}

	uniform1ui(location: WebGLUniformLocation | null, v0: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform1ui', location, v0, );
		return this.#renderingContext.uniform1ui(location, v0, );
	}

	uniform1uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform1uiv', location, data, srcOffset, srcLength, );
		return this.#renderingContext.uniform1uiv(location, data, srcOffset, srcLength, );
	}

	uniform2ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform2ui', location, v0, v1, );
		return this.#renderingContext.uniform2ui(location, v0, v1, );
	}

	uniform2uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform2uiv', location, data, srcOffset, srcLength, );
		return this.#renderingContext.uniform2uiv(location, data, srcOffset, srcLength, );
	}

	uniform3ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint, v2: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform3ui', location, v0, v1, v2, );
		return this.#renderingContext.uniform3ui(location, v0, v1, v2, );
	}

	uniform3uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform3uiv', location, data, srcOffset, srcLength, );
		return this.#renderingContext.uniform3uiv(location, data, srcOffset, srcLength, );
	}

	uniform4ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint, v2: GLuint, v3: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform4ui', location, v0, v1, v2, v3, );
		return this.#renderingContext.uniform4ui(location, v0, v1, v2, v3, );
	}

	uniform4uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform4uiv', location, data, srcOffset, srcLength, );
		return this.#renderingContext.uniform4uiv(location, data, srcOffset, srcLength, );
	}

	uniformBlockBinding(program: WebGLProgram, uniformBlockIndex: GLuint, uniformBlockBinding: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniformBlockBinding', program, uniformBlockIndex, uniformBlockBinding, );
		return this.#renderingContext.uniformBlockBinding(program, uniformBlockIndex, uniformBlockBinding, );
	}

	uniformMatrix2x3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniformMatrix2x3fv', location, transpose, data, srcOffset, srcLength, );
		return this.#renderingContext.uniformMatrix2x3fv(location, transpose, data, srcOffset, srcLength, );
	}

	uniformMatrix2x4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniformMatrix2x4fv', location, transpose, data, srcOffset, srcLength, );
		return this.#renderingContext.uniformMatrix2x4fv(location, transpose, data, srcOffset, srcLength, );
	}

	uniformMatrix3x2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniformMatrix3x2fv', location, transpose, data, srcOffset, srcLength, );
		return this.#renderingContext.uniformMatrix3x2fv(location, transpose, data, srcOffset, srcLength, );
	}

	uniformMatrix3x4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniformMatrix3x4fv', location, transpose, data, srcOffset, srcLength, );
		return this.#renderingContext.uniformMatrix3x4fv(location, transpose, data, srcOffset, srcLength, );
	}

	uniformMatrix4x2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniformMatrix4x2fv', location, transpose, data, srcOffset, srcLength, );
		return this.#renderingContext.uniformMatrix4x2fv(location, transpose, data, srcOffset, srcLength, );
	}

	uniformMatrix4x3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniformMatrix4x3fv', location, transpose, data, srcOffset, srcLength, );
		return this.#renderingContext.uniformMatrix4x3fv(location, transpose, data, srcOffset, srcLength, );
	}

	vertexAttribDivisor(index: GLuint, divisor: GLuint, ): void {
		console.info('MyWebGL2RenderingContext vertexAttribDivisor', index, divisor, );
		return this.#renderingContext.vertexAttribDivisor(index, divisor, );
	}

	vertexAttribI4i(index: GLuint, x: GLint, y: GLint, z: GLint, w: GLint, ): void {
		console.info('MyWebGL2RenderingContext vertexAttribI4i', index, x, y, z, w, );
		return this.#renderingContext.vertexAttribI4i(index, x, y, z, w, );
	}

	vertexAttribI4iv(index: GLuint, values: Int32List, ): void {
		console.info('MyWebGL2RenderingContext vertexAttribI4iv', index, values, );
		return this.#renderingContext.vertexAttribI4iv(index, values, );
	}

	vertexAttribI4ui(index: GLuint, x: GLuint, y: GLuint, z: GLuint, w: GLuint, ): void {
		console.info('MyWebGL2RenderingContext vertexAttribI4ui', index, x, y, z, w, );
		return this.#renderingContext.vertexAttribI4ui(index, x, y, z, w, );
	}

	vertexAttribI4uiv(index: GLuint, values: Uint32List, ): void {
		console.info('MyWebGL2RenderingContext vertexAttribI4uiv', index, values, );
		return this.#renderingContext.vertexAttribI4uiv(index, values, );
	}

	vertexAttribIPointer(index: GLuint, size: GLint, type: GLenum, stride: GLsizei, offset: GLintptr, ): void {
		console.info('MyWebGL2RenderingContext vertexAttribIPointer', index, size, type, stride, offset, );
		return this.#renderingContext.vertexAttribIPointer(index, size, type, stride, offset, );
	}

	waitSync(sync: WebGLSync, flags: GLbitfield, timeout: GLint64, ): void {
		console.info('MyWebGL2RenderingContext waitSync', sync, flags, timeout, );
		return this.#renderingContext.waitSync(sync, flags, timeout, );
	}

	bufferData(target: GLenum, size: GLsizeiptr, usage: GLenum, ): void {
		console.info('MyWebGL2RenderingContext bufferData', target, size, usage, );
		return this.#renderingContext.bufferData(target, size, usage, );
	}

	bufferSubData(target: GLenum, dstByteOffset: GLintptr, srcData: AllowSharedBufferSource, ): void {
		console.info('MyWebGL2RenderingContext bufferSubData', target, dstByteOffset, srcData, );
		return this.#renderingContext.bufferSubData(target, dstByteOffset, srcData, );
	}

	compressedTexImage2D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, imageSize: GLsizei, offset: GLintptr, ): void {
		console.info('MyWebGL2RenderingContext compressedTexImage2D', target, level, internalformat, width, height, border, imageSize, offset, );
		return this.#renderingContext.compressedTexImage2D(target, level, internalformat, width, height, border, imageSize, offset, );
	}

	compressedTexSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, imageSize: GLsizei, offset: GLintptr, ): void {
		console.info('MyWebGL2RenderingContext compressedTexSubImage2D', target, level, xoffset, yoffset, width, height, format, imageSize, offset, );
		return this.#renderingContext.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, offset, );
	}

	readPixels(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView<ArrayBufferLike> | null, ): void {
		console.info('MyWebGL2RenderingContext readPixels', x, y, width, height, format, type, dstData, );
		return this.#renderingContext.readPixels(x, y, width, height, format, type, dstData, );
	}

	texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint, format: GLenum, type: GLenum, pixels: ArrayBufferView<ArrayBufferLike> | null, ): void {
		console.info('MyWebGL2RenderingContext texImage2D', target, level, internalformat, width, height, border, format, type, pixels, );
		return this.#renderingContext.texImage2D(target, level, internalformat, width, height, border, format, type, pixels, );
	}

	texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pixels: ArrayBufferView<ArrayBufferLike> | null, ): void {
		console.info('MyWebGL2RenderingContext texSubImage2D', target, level, xoffset, yoffset, width, height, format, type, pixels, );
		return this.#renderingContext.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels, );
	}

	uniform1fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform1fv', location, data, srcOffset, srcLength, );
		return this.#renderingContext.uniform1fv(location, data, srcOffset, srcLength, );
	}

	uniform1iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform1iv', location, data, srcOffset, srcLength, );
		return this.#renderingContext.uniform1iv(location, data, srcOffset, srcLength, );
	}

	uniform2fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform2fv', location, data, srcOffset, srcLength, );
		return this.#renderingContext.uniform2fv(location, data, srcOffset, srcLength, );
	}

	uniform2iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform2iv', location, data, srcOffset, srcLength, );
		return this.#renderingContext.uniform2iv(location, data, srcOffset, srcLength, );
	}

	uniform3fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform3fv', location, data, srcOffset, srcLength, );
		return this.#renderingContext.uniform3fv(location, data, srcOffset, srcLength, );
	}

	uniform3iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform3iv', location, data, srcOffset, srcLength, );
		return this.#renderingContext.uniform3iv(location, data, srcOffset, srcLength, );
	}

	uniform4fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform4fv', location, data, srcOffset, srcLength, );
		return this.#renderingContext.uniform4fv(location, data, srcOffset, srcLength, );
	}

	uniform4iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniform4iv', location, data, srcOffset, srcLength, );
		return this.#renderingContext.uniform4iv(location, data, srcOffset, srcLength, );
	}

	uniformMatrix2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniformMatrix2fv', location, transpose, data, srcOffset, srcLength, );
		return this.#renderingContext.uniformMatrix2fv(location, transpose, data, srcOffset, srcLength, );
	}

	uniformMatrix3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniformMatrix3fv', location, transpose, data, srcOffset, srcLength, );
		return this.#renderingContext.uniformMatrix3fv(location, transpose, data, srcOffset, srcLength, );
	}

	uniformMatrix4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset: number, srcLength: GLuint, ): void {
		console.info('MyWebGL2RenderingContext uniformMatrix4fv', location, transpose, data, srcOffset, srcLength, );
		return this.#renderingContext.uniformMatrix4fv(location, transpose, data, srcOffset, srcLength, );
	}

	activeTexture(texture: GLenum, ): void {
		console.info('MyWebGL2RenderingContext activeTexture', texture, );
		return this.#renderingContext.activeTexture(texture, );
	}

	attachShader(program: WebGLProgram, shader: WebGLShader, ): void {
		console.info('MyWebGL2RenderingContext attachShader', program, shader, );
		return this.#renderingContext.attachShader(program, shader, );
	}

	bindAttribLocation(program: WebGLProgram, index: GLuint, name: string, ): void {
		console.info('MyWebGL2RenderingContext bindAttribLocation', program, index, name, );
		return this.#renderingContext.bindAttribLocation(program, index, name, );
	}

	bindBuffer(target: GLenum, buffer: WebGLBuffer | null, ): void {
		console.info('MyWebGL2RenderingContext bindBuffer', target, buffer, );
		return this.#renderingContext.bindBuffer(target, buffer, );
	}

	bindFramebuffer(target: GLenum, framebuffer: WebGLFramebuffer | null, ): void {
		console.info('MyWebGL2RenderingContext bindFramebuffer', target, framebuffer, );
		return this.#renderingContext.bindFramebuffer(target, framebuffer, );
	}

	bindRenderbuffer(target: GLenum, renderbuffer: WebGLRenderbuffer | null, ): void {
		console.info('MyWebGL2RenderingContext bindRenderbuffer', target, renderbuffer, );
		return this.#renderingContext.bindRenderbuffer(target, renderbuffer, );
	}

	bindTexture(target: GLenum, texture: WebGLTexture | null, ): void {
		console.info('MyWebGL2RenderingContext bindTexture', target, texture, );
		return this.#renderingContext.bindTexture(target, texture, );
	}

	blendColor(red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf, ): void {
		console.info('MyWebGL2RenderingContext blendColor', red, green, blue, alpha, );
		return this.#renderingContext.blendColor(red, green, blue, alpha, );
	}

	blendEquation(mode: GLenum, ): void {
		console.info('MyWebGL2RenderingContext blendEquation', mode, );
		return this.#renderingContext.blendEquation(mode, );
	}

	blendEquationSeparate(modeRGB: GLenum, modeAlpha: GLenum, ): void {
		console.info('MyWebGL2RenderingContext blendEquationSeparate', modeRGB, modeAlpha, );
		return this.#renderingContext.blendEquationSeparate(modeRGB, modeAlpha, );
	}

	blendFunc(sfactor: GLenum, dfactor: GLenum, ): void {
		console.info('MyWebGL2RenderingContext blendFunc', sfactor, dfactor, );
		return this.#renderingContext.blendFunc(sfactor, dfactor, );
	}

	blendFuncSeparate(srcRGB: GLenum, dstRGB: GLenum, srcAlpha: GLenum, dstAlpha: GLenum, ): void {
		console.info('MyWebGL2RenderingContext blendFuncSeparate', srcRGB, dstRGB, srcAlpha, dstAlpha, );
		return this.#renderingContext.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha, );
	}

	checkFramebufferStatus(target: GLenum, ): GLenum {
		console.info('MyWebGL2RenderingContext checkFramebufferStatus', target, );
		return this.#renderingContext.checkFramebufferStatus(target, );
	}

	clear(mask: GLbitfield, ): void {
		console.info('MyWebGL2RenderingContext clear', mask, );
		return this.#renderingContext.clear(mask, );
	}

	clearColor(red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf, ): void {
		console.info('MyWebGL2RenderingContext clearColor', red, green, blue, alpha, );
		return this.#renderingContext.clearColor(red, green, blue, alpha, );
	}

	clearDepth(depth: GLclampf, ): void {
		console.info('MyWebGL2RenderingContext clearDepth', depth, );
		return this.#renderingContext.clearDepth(depth, );
	}

	clearStencil(s: GLint, ): void {
		console.info('MyWebGL2RenderingContext clearStencil', s, );
		return this.#renderingContext.clearStencil(s, );
	}

	colorMask(red: GLboolean, green: GLboolean, blue: GLboolean, alpha: GLboolean, ): void {
		console.info('MyWebGL2RenderingContext colorMask', red, green, blue, alpha, );
		return this.#renderingContext.colorMask(red, green, blue, alpha, );
	}

	compileShader(shader: WebGLShader, ): void {
		console.info('MyWebGL2RenderingContext compileShader', shader, );
		return this.#renderingContext.compileShader(shader, );
	}

	copyTexImage2D(target: GLenum, level: GLint, internalformat: GLenum, x: GLint, y: GLint, width: GLsizei, height: GLsizei, border: GLint, ): void {
		console.info('MyWebGL2RenderingContext copyTexImage2D', target, level, internalformat, x, y, width, height, border, );
		return this.#renderingContext.copyTexImage2D(target, level, internalformat, x, y, width, height, border, );
	}

	copyTexSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, x: GLint, y: GLint, width: GLsizei, height: GLsizei, ): void {
		console.info('MyWebGL2RenderingContext copyTexSubImage2D', target, level, xoffset, yoffset, x, y, width, height, );
		return this.#renderingContext.copyTexSubImage2D(target, level, xoffset, yoffset, x, y, width, height, );
	}

	createBuffer(): WebGLBuffer {
		console.info('MyWebGL2RenderingContext createBuffer', );
		return this.#renderingContext.createBuffer();
	}

	createFramebuffer(): WebGLFramebuffer {
		console.info('MyWebGL2RenderingContext createFramebuffer', );
		return this.#renderingContext.createFramebuffer();
	}

	createProgram(): WebGLProgram {
		console.info('MyWebGL2RenderingContext createProgram', );
		return this.#renderingContext.createProgram();
	}

	createRenderbuffer(): WebGLRenderbuffer {
		console.info('MyWebGL2RenderingContext createRenderbuffer', );
		return this.#renderingContext.createRenderbuffer();
	}

	createShader(type: GLenum, ): WebGLShader | null {
		console.info('MyWebGL2RenderingContext createShader', type, );
		return this.#renderingContext.createShader(type, );
	}

	createTexture(): WebGLTexture {
		console.info('MyWebGL2RenderingContext createTexture', );
		return this.#renderingContext.createTexture();
	}

	cullFace(mode: GLenum, ): void {
		console.info('MyWebGL2RenderingContext cullFace', mode, );
		return this.#renderingContext.cullFace(mode, );
	}

	deleteBuffer(buffer: WebGLBuffer | null, ): void {
		console.info('MyWebGL2RenderingContext deleteBuffer', buffer, );
		return this.#renderingContext.deleteBuffer(buffer, );
	}

	deleteFramebuffer(framebuffer: WebGLFramebuffer | null, ): void {
		console.info('MyWebGL2RenderingContext deleteFramebuffer', framebuffer, );
		return this.#renderingContext.deleteFramebuffer(framebuffer, );
	}

	deleteProgram(program: WebGLProgram | null, ): void {
		console.info('MyWebGL2RenderingContext deleteProgram', program, );
		return this.#renderingContext.deleteProgram(program, );
	}

	deleteRenderbuffer(renderbuffer: WebGLRenderbuffer | null, ): void {
		console.info('MyWebGL2RenderingContext deleteRenderbuffer', renderbuffer, );
		return this.#renderingContext.deleteRenderbuffer(renderbuffer, );
	}

	deleteShader(shader: WebGLShader | null, ): void {
		console.info('MyWebGL2RenderingContext deleteShader', shader, );
		return this.#renderingContext.deleteShader(shader, );
	}

	deleteTexture(texture: WebGLTexture | null, ): void {
		console.info('MyWebGL2RenderingContext deleteTexture', texture, );
		return this.#renderingContext.deleteTexture(texture, );
	}

	depthFunc(func: GLenum, ): void {
		console.info('MyWebGL2RenderingContext depthFunc', func, );
		return this.#renderingContext.depthFunc(func, );
	}

	depthMask(flag: GLboolean, ): void {
		console.info('MyWebGL2RenderingContext depthMask', flag, );
		return this.#renderingContext.depthMask(flag, );
	}

	depthRange(zNear: GLclampf, zFar: GLclampf, ): void {
		console.info('MyWebGL2RenderingContext depthRange', zNear, zFar, );
		return this.#renderingContext.depthRange(zNear, zFar, );
	}

	detachShader(program: WebGLProgram, shader: WebGLShader, ): void {
		console.info('MyWebGL2RenderingContext detachShader', program, shader, );
		return this.#renderingContext.detachShader(program, shader, );
	}

	disable(cap: GLenum, ): void {
		console.info('MyWebGL2RenderingContext disable', cap, );
		return this.#renderingContext.disable(cap, );
	}

	disableVertexAttribArray(index: GLuint, ): void {
		console.info('MyWebGL2RenderingContext disableVertexAttribArray', index, );
		return this.#renderingContext.disableVertexAttribArray(index, );
	}

	drawArrays(mode: GLenum, first: GLint, count: GLsizei, ): void {
		console.info('MyWebGL2RenderingContext drawArrays', mode, first, count, );
		return this.#renderingContext.drawArrays(mode, first, count, );
	}

	drawElements(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr, ): void {
		console.info('MyWebGL2RenderingContext drawElements', mode, count, type, offset, );
		return this.#renderingContext.drawElements(mode, count, type, offset, );
	}

	enable(cap: GLenum, ): void {
		console.info('MyWebGL2RenderingContext enable', cap, );
		return this.#renderingContext.enable(cap, );
	}

	enableVertexAttribArray(index: GLuint, ): void {
		console.info('MyWebGL2RenderingContext enableVertexAttribArray', index, );
		return this.#renderingContext.enableVertexAttribArray(index, );
	}

	finish(): void {
		console.info('MyWebGL2RenderingContext finish', );
		return this.#renderingContext.finish();
	}

	flush(): void {
		console.info('MyWebGL2RenderingContext flush', );
		return this.#renderingContext.flush();
	}

	framebufferRenderbuffer(target: GLenum, attachment: GLenum, renderbuffertarget: GLenum, renderbuffer: WebGLRenderbuffer | null, ): void {
		console.info('MyWebGL2RenderingContext framebufferRenderbuffer', target, attachment, renderbuffertarget, renderbuffer, );
		return this.#renderingContext.framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer, );
	}

	framebufferTexture2D(target: GLenum, attachment: GLenum, textarget: GLenum, texture: WebGLTexture | null, level: GLint, ): void {
		console.info('MyWebGL2RenderingContext framebufferTexture2D', target, attachment, textarget, texture, level, );
		return this.#renderingContext.framebufferTexture2D(target, attachment, textarget, texture, level, );
	}

	frontFace(mode: GLenum, ): void {
		console.info('MyWebGL2RenderingContext frontFace', mode, );
		return this.#renderingContext.frontFace(mode, );
	}

	generateMipmap(target: GLenum, ): void {
		console.info('MyWebGL2RenderingContext generateMipmap', target, );
		return this.#renderingContext.generateMipmap(target, );
	}

	getActiveAttrib(program: WebGLProgram, index: GLuint, ): WebGLActiveInfo | null {
		console.info('MyWebGL2RenderingContext getActiveAttrib', program, index, );
		return this.#renderingContext.getActiveAttrib(program, index, );
	}

	getActiveUniform(program: WebGLProgram, index: GLuint, ): WebGLActiveInfo | null {
		console.info('MyWebGL2RenderingContext getActiveUniform', program, index, );
		return this.#renderingContext.getActiveUniform(program, index, );
	}

	getAttachedShaders(program: WebGLProgram, ): WebGLShader[] | null {
		console.info('MyWebGL2RenderingContext getAttachedShaders', program, );
		return this.#renderingContext.getAttachedShaders(program, );
	}

	getAttribLocation(program: WebGLProgram, name: string, ): GLint {
		console.info('MyWebGL2RenderingContext getAttribLocation', program, name, );
		return this.#renderingContext.getAttribLocation(program, name, );
	}

	getBufferParameter(target: GLenum, pname: GLenum, ): any {
		console.info('MyWebGL2RenderingContext getBufferParameter', target, pname, );
		return this.#renderingContext.getBufferParameter(target, pname, );
	}

	getContextAttributes(): WebGLContextAttributes | null {
		console.info('MyWebGL2RenderingContext getContextAttributes', );
		return this.#renderingContext.getContextAttributes();
	}

	getError(): GLenum {
		console.info('MyWebGL2RenderingContext getError', );
		return this.#renderingContext.getError();
	}

	getExtension(name: string, ): any {
		console.info('MyWebGL2RenderingContext getExtension', name, );
		return this.#renderingContext.getExtension(name, );
	}

	getFramebufferAttachmentParameter(target: GLenum, attachment: GLenum, pname: GLenum, ): any {
		console.info('MyWebGL2RenderingContext getFramebufferAttachmentParameter', target, attachment, pname, );
		return this.#renderingContext.getFramebufferAttachmentParameter(target, attachment, pname, );
	}

	getParameter(pname: GLenum, ): any {
		console.info('MyWebGL2RenderingContext getParameter', pname, );
		return this.#renderingContext.getParameter(pname, );
	}

	getProgramInfoLog(program: WebGLProgram, ): string | null {
		console.info('MyWebGL2RenderingContext getProgramInfoLog', program, );
		return this.#renderingContext.getProgramInfoLog(program, );
	}

	getProgramParameter(program: WebGLProgram, pname: GLenum, ): any {
		console.info('MyWebGL2RenderingContext getProgramParameter', program, pname, );
		return this.#renderingContext.getProgramParameter(program, pname, );
	}

	getRenderbufferParameter(target: GLenum, pname: GLenum, ): any {
		console.info('MyWebGL2RenderingContext getRenderbufferParameter', target, pname, );
		return this.#renderingContext.getRenderbufferParameter(target, pname, );
	}

	getShaderInfoLog(shader: WebGLShader, ): string | null {
		console.info('MyWebGL2RenderingContext getShaderInfoLog', shader, );
		return this.#renderingContext.getShaderInfoLog(shader, );
	}

	getShaderParameter(shader: WebGLShader, pname: GLenum, ): any {
		console.info('MyWebGL2RenderingContext getShaderParameter', shader, pname, );
		return this.#renderingContext.getShaderParameter(shader, pname, );
	}

	getShaderPrecisionFormat(shadertype: GLenum, precisiontype: GLenum, ): WebGLShaderPrecisionFormat | null {
		console.info('MyWebGL2RenderingContext getShaderPrecisionFormat', shadertype, precisiontype, );
		return this.#renderingContext.getShaderPrecisionFormat(shadertype, precisiontype, );
	}

	getShaderSource(shader: WebGLShader, ): string | null {
		console.info('MyWebGL2RenderingContext getShaderSource', shader, );
		return this.#renderingContext.getShaderSource(shader, );
	}

	getSupportedExtensions(): string[] | null {
		console.info('MyWebGL2RenderingContext getSupportedExtensions', );
		return this.#renderingContext.getSupportedExtensions();
	}

	getTexParameter(target: GLenum, pname: GLenum, ): any {
		console.info('MyWebGL2RenderingContext getTexParameter', target, pname, );
		return this.#renderingContext.getTexParameter(target, pname, );
	}

	getUniform(program: WebGLProgram, location: WebGLUniformLocation, ): any {
		console.info('MyWebGL2RenderingContext getUniform', program, location, );
		return this.#renderingContext.getUniform(program, location, );
	}

	getUniformLocation(program: WebGLProgram, name: string, ): WebGLUniformLocation | null {
		console.info('MyWebGL2RenderingContext getUniformLocation', program, name, );
		return this.#renderingContext.getUniformLocation(program, name, );
	}

	getVertexAttrib(index: GLuint, pname: GLenum, ): any {
		console.info('MyWebGL2RenderingContext getVertexAttrib', index, pname, );
		return this.#renderingContext.getVertexAttrib(index, pname, );
	}

	getVertexAttribOffset(index: GLuint, pname: GLenum, ): GLintptr {
		console.info('MyWebGL2RenderingContext getVertexAttribOffset', index, pname, );
		return this.#renderingContext.getVertexAttribOffset(index, pname, );
	}

	hint(target: GLenum, mode: GLenum, ): void {
		console.info('MyWebGL2RenderingContext hint', target, mode, );
		return this.#renderingContext.hint(target, mode, );
	}

	isBuffer(buffer: WebGLBuffer | null, ): GLboolean {
		console.info('MyWebGL2RenderingContext isBuffer', buffer, );
		return this.#renderingContext.isBuffer(buffer, );
	}

	isContextLost(): boolean {
		console.info('MyWebGL2RenderingContext isContextLost', );
		return this.#renderingContext.isContextLost();
	}

	isEnabled(cap: GLenum, ): GLboolean {
		console.info('MyWebGL2RenderingContext isEnabled', cap, );
		return this.#renderingContext.isEnabled(cap, );
	}

	isFramebuffer(framebuffer: WebGLFramebuffer | null, ): GLboolean {
		console.info('MyWebGL2RenderingContext isFramebuffer', framebuffer, );
		return this.#renderingContext.isFramebuffer(framebuffer, );
	}

	isProgram(program: WebGLProgram | null, ): GLboolean {
		console.info('MyWebGL2RenderingContext isProgram', program, );
		return this.#renderingContext.isProgram(program, );
	}

	isRenderbuffer(renderbuffer: WebGLRenderbuffer | null, ): GLboolean {
		console.info('MyWebGL2RenderingContext isRenderbuffer', renderbuffer, );
		return this.#renderingContext.isRenderbuffer(renderbuffer, );
	}

	isShader(shader: WebGLShader | null, ): GLboolean {
		console.info('MyWebGL2RenderingContext isShader', shader, );
		return this.#renderingContext.isShader(shader, );
	}

	isTexture(texture: WebGLTexture | null, ): GLboolean {
		console.info('MyWebGL2RenderingContext isTexture', texture, );
		return this.#renderingContext.isTexture(texture, );
	}

	lineWidth(width: GLfloat, ): void {
		console.info('MyWebGL2RenderingContext lineWidth', width, );
		return this.#renderingContext.lineWidth(width, );
	}

	linkProgram(program: WebGLProgram, ): void {
		console.info('MyWebGL2RenderingContext linkProgram', program, );
		return this.#renderingContext.linkProgram(program, );
	}

	pixelStorei(pname: GLenum, param: GLint | GLboolean, ): void {
		console.info('MyWebGL2RenderingContext pixelStorei', pname, param, );
		return this.#renderingContext.pixelStorei(pname, param, );
	}

	polygonOffset(factor: GLfloat, units: GLfloat, ): void {
		console.info('MyWebGL2RenderingContext polygonOffset', factor, units, );
		return this.#renderingContext.polygonOffset(factor, units, );
	}

	renderbufferStorage(target: GLenum, internalformat: GLenum, width: GLsizei, height: GLsizei, ): void {
		console.info('MyWebGL2RenderingContext renderbufferStorage', target, internalformat, width, height, );
		return this.#renderingContext.renderbufferStorage(target, internalformat, width, height, );
	}

	sampleCoverage(value: GLclampf, invert: GLboolean, ): void {
		console.info('MyWebGL2RenderingContext sampleCoverage', value, invert, );
		return this.#renderingContext.sampleCoverage(value, invert, );
	}

	scissor(x: GLint, y: GLint, width: GLsizei, height: GLsizei, ): void {
		console.info('MyWebGL2RenderingContext scissor', x, y, width, height, );
		return this.#renderingContext.scissor(x, y, width, height, );
	}

	shaderSource(shader: WebGLShader, source: string, ): void {
		console.info('MyWebGL2RenderingContext shaderSource', shader, source, );
		return this.#renderingContext.shaderSource(shader, source, );
	}

	stencilFunc(func: GLenum, ref: GLint, mask: GLuint, ): void {
		console.info('MyWebGL2RenderingContext stencilFunc', func, ref, mask, );
		return this.#renderingContext.stencilFunc(func, ref, mask, );
	}

	stencilFuncSeparate(face: GLenum, func: GLenum, ref: GLint, mask: GLuint, ): void {
		console.info('MyWebGL2RenderingContext stencilFuncSeparate', face, func, ref, mask, );
		return this.#renderingContext.stencilFuncSeparate(face, func, ref, mask, );
	}

	stencilMask(mask: GLuint, ): void {
		console.info('MyWebGL2RenderingContext stencilMask', mask, );
		return this.#renderingContext.stencilMask(mask, );
	}

	stencilMaskSeparate(face: GLenum, mask: GLuint, ): void {
		console.info('MyWebGL2RenderingContext stencilMaskSeparate', face, mask, );
		return this.#renderingContext.stencilMaskSeparate(face, mask, );
	}

	stencilOp(fail: GLenum, zfail: GLenum, zpass: GLenum, ): void {
		console.info('MyWebGL2RenderingContext stencilOp', fail, zfail, zpass, );
		return this.#renderingContext.stencilOp(fail, zfail, zpass, );
	}

	stencilOpSeparate(face: GLenum, fail: GLenum, zfail: GLenum, zpass: GLenum, ): void {
		console.info('MyWebGL2RenderingContext stencilOpSeparate', face, fail, zfail, zpass, );
		return this.#renderingContext.stencilOpSeparate(face, fail, zfail, zpass, );
	}

	texParameterf(target: GLenum, pname: GLenum, param: GLfloat, ): void {
		console.info('MyWebGL2RenderingContext texParameterf', target, pname, param, );
		return this.#renderingContext.texParameterf(target, pname, param, );
	}

	texParameteri(target: GLenum, pname: GLenum, param: GLint, ): void {
		console.info('MyWebGL2RenderingContext texParameteri', target, pname, param, );
		return this.#renderingContext.texParameteri(target, pname, param, );
	}

	uniform1f(location: WebGLUniformLocation | null, x: GLfloat, ): void {
		console.info('MyWebGL2RenderingContext uniform1f', location, x, );
		return this.#renderingContext.uniform1f(location, x, );
	}

	uniform1i(location: WebGLUniformLocation | null, x: GLint, ): void {
		console.info('MyWebGL2RenderingContext uniform1i', location, x, );
		return this.#renderingContext.uniform1i(location, x, );
	}

	uniform2f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat, ): void {
		console.info('MyWebGL2RenderingContext uniform2f', location, x, y, );
		return this.#renderingContext.uniform2f(location, x, y, );
	}

	uniform2i(location: WebGLUniformLocation | null, x: GLint, y: GLint, ): void {
		console.info('MyWebGL2RenderingContext uniform2i', location, x, y, );
		return this.#renderingContext.uniform2i(location, x, y, );
	}

	uniform3f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat, z: GLfloat, ): void {
		console.info('MyWebGL2RenderingContext uniform3f', location, x, y, z, );
		return this.#renderingContext.uniform3f(location, x, y, z, );
	}

	uniform3i(location: WebGLUniformLocation | null, x: GLint, y: GLint, z: GLint, ): void {
		console.info('MyWebGL2RenderingContext uniform3i', location, x, y, z, );
		return this.#renderingContext.uniform3i(location, x, y, z, );
	}

	uniform4f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat, ): void {
		console.info('MyWebGL2RenderingContext uniform4f', location, x, y, z, w, );
		return this.#renderingContext.uniform4f(location, x, y, z, w, );
	}

	uniform4i(location: WebGLUniformLocation | null, x: GLint, y: GLint, z: GLint, w: GLint, ): void {
		console.info('MyWebGL2RenderingContext uniform4i', location, x, y, z, w, );
		return this.#renderingContext.uniform4i(location, x, y, z, w, );
	}

	useProgram(program: WebGLProgram | null, ): void {
		console.info('MyWebGL2RenderingContext useProgram', program, );
		return this.#renderingContext.useProgram(program, );
	}

	validateProgram(program: WebGLProgram, ): void {
		console.info('MyWebGL2RenderingContext validateProgram', program, );
		return this.#renderingContext.validateProgram(program, );
	}

	vertexAttrib1f(index: GLuint, x: GLfloat, ): void {
		console.info('MyWebGL2RenderingContext vertexAttrib1f', index, x, );
		return this.#renderingContext.vertexAttrib1f(index, x, );
	}

	vertexAttrib1fv(index: GLuint, values: Float32List, ): void {
		console.info('MyWebGL2RenderingContext vertexAttrib1fv', index, values, );
		return this.#renderingContext.vertexAttrib1fv(index, values, );
	}

	vertexAttrib2f(index: GLuint, x: GLfloat, y: GLfloat, ): void {
		console.info('MyWebGL2RenderingContext vertexAttrib2f', index, x, y, );
		return this.#renderingContext.vertexAttrib2f(index, x, y, );
	}

	vertexAttrib2fv(index: GLuint, values: Float32List, ): void {
		console.info('MyWebGL2RenderingContext vertexAttrib2fv', index, values, );
		return this.#renderingContext.vertexAttrib2fv(index, values, );
	}

	vertexAttrib3f(index: GLuint, x: GLfloat, y: GLfloat, z: GLfloat, ): void {
		console.info('MyWebGL2RenderingContext vertexAttrib3f', index, x, y, z, );
		return this.#renderingContext.vertexAttrib3f(index, x, y, z, );
	}

	vertexAttrib3fv(index: GLuint, values: Float32List, ): void {
		console.info('MyWebGL2RenderingContext vertexAttrib3fv', index, values, );
		return this.#renderingContext.vertexAttrib3fv(index, values, );
	}

	vertexAttrib4f(index: GLuint, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat, ): void {
		console.info('MyWebGL2RenderingContext vertexAttrib4f', index, x, y, z, w, );
		return this.#renderingContext.vertexAttrib4f(index, x, y, z, w, );
	}

	vertexAttrib4fv(index: GLuint, values: Float32List, ): void {
		console.info('MyWebGL2RenderingContext vertexAttrib4fv', index, values, );
		return this.#renderingContext.vertexAttrib4fv(index, values, );
	}

	vertexAttribPointer(index: GLuint, size: GLint, type: GLenum, normalized: GLboolean, stride: GLsizei, offset: GLintptr, ): void {
		console.info('MyWebGL2RenderingContext vertexAttribPointer', index, size, type, normalized, stride, offset, );
		return this.#renderingContext.vertexAttribPointer(index, size, type, normalized, stride, offset, );
	}

	viewport(x: GLint, y: GLint, width: GLsizei, height: GLsizei, ): void {
		console.info('MyWebGL2RenderingContext viewport', x, y, width, height, );
		return this.#renderingContext.viewport(x, y, width, height, );
	}


}

window.WebGL2RenderingContext = MyWebGL2RenderingContext as any;
