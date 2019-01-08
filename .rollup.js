'use strict';

const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const postprocess = require('rollup-plugin-postprocess');

module.exports = {
	input: 'index.js',
	output: [
		{
			file: 'dist/index.cjs.js',
			format: 'cjs'
		},
		{
			file: 'dist/index.esm.js',
			format: 'esm'
		}
	],
	plugins: [
		babel({
			exclude: 'node_modules/**'
		}),
		resolve({
			only: ['viewprt']
		}),
		postprocess([
			[/viewports=new Map/, 'viewports=(typeof Map==="function"?new Map:{})']
		])
	]
};
