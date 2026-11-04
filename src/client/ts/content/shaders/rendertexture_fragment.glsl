precision highp float;
precision highp int;

#ifdef WEBGL2
	#define varying in

	out vec4 fragColor;
	#define gl_FragColor fragColor
#endif

uniform sampler2D colorMap;

varying vec4 vTextureCoord;

void main(void) {
	gl_FragColor = texture2D(colorMap, vTextureCoord.xy);
	//gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
}
