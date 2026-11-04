precision highp float;
precision highp int;

#ifdef WEBGL2
	#define attribute in
	#define varying out
#endif


attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec4 vTextureCoord;

void main(void) {
	gl_Position = vec4(aVertexPosition, 1.0);
	vTextureCoord.xy = aTextureCoord;
}
