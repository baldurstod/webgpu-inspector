import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';

const isProduction = process.env.BUILD === 'production';
const isFirefox = process.env.BROWSER === 'firefox';

export default [
	{
		input: './src/client/ts/content/content.ts',
		output: {
			file: './build/client/content.js',
			format: 'esm',
			// Prevents a bug in firefox where globalThis['EventTarget'] doesn't work in extensions
			banner: isFirefox ? "globalThis['EventTarget'] = window['EventTarget'];" : '',
		},
		plugins: [
			isProduction ? del({ targets: 'build/client/*' }) : null,
			typescript(),
			//nodeResolve({ dedupe: ['harmony-ui'] }),
			isProduction ? terser() : null,
			copy({
				targets: [
					{ src: isFirefox ? 'src/client/manifest_firefox.json' : 'src/client/manifest.json', dest: 'build/client', rename: 'manifest.json' },
					{ src: 'src/client/img/', dest: 'build/client/' },
				]
			}),
		],
	},
	{
		input: './src/client/ts/background/background.ts',
		output: {
			file: './build/client/background.js',
			format: 'esm',
		},
		plugins: [
			typescript(),
			nodeResolve(),
			isProduction ? terser() : null,
		],
	},
];
