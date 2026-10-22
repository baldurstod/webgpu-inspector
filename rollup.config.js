import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import css from 'rollup-plugin-import-css';
import { buildTranslations } from 'translations';

const isProduction = process.env.BUILD === 'production';
const isFirefox = process.env.BROWSER === 'firefox';
const doTranslations = process.env.TRANSLATIONS === 'true';

if (doTranslations) {
	console.info('Building translations');
	await buildTranslations('./src/client/json/i18n/translations.json', './src/client/json/i18n/', undefined, '\t');
}

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
			css(),
			json({
				compact: true,
			}),
			nodeResolve({ dedupe: ['harmony-ui'] }),
			isProduction ? terser() : null,
			copy({
				targets: [
					{ src: isFirefox ? 'src/client/manifest_firefox.json' : 'src/client/manifest.json', dest: 'build/client', rename: 'manifest.json' },
					{ src: 'src/client/css/content.css', dest: 'build/client/css/' },
					{ src: 'src/client/img/', dest: 'build/client/' },
				]
			}),
		],
	},

	{
		input: './src/client/ts/isolated/isolated.ts',
		output: {
			file: './build/client/isolated.js',
			format: 'esm',
		},
		plugins: [
			typescript(),
			isProduction ? terser() : null,
		],
	},
];
