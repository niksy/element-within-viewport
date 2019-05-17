'use strict';

const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const globals = require('rollup-plugin-node-globals');
const babelCore = require('@babel/core');

module.exports = {
	input: 'index.js',
	output: [
		{
			file: 'index.cjs.js',
			format: 'cjs',
			sourcemap: true
		},
		{
			file: 'index.esm.js',
			format: 'esm',
			sourcemap: true
		}
	],
	plugins: [
		babel({
			exclude: 'node_modules/**'
		}),
		resolve({
			only: ['viewprt']
		}),
		{
			async transform ( code, id ) {
				if ( id.includes('viewprt') ) {
					const result = await babelCore.transformAsync(code, {
						sourceMaps: true,
						plugins: [
							babelCore.createConfigItem(({ types: t }) => {
								return {
									visitor: {
										Identifier ( path ) {
											if ( path.get('name').node === 'window' ) {
												path.replaceWith(t.identifier('global'));
											}
										},
										NewExpression ( path ) {
											if (
												path.get('callee.name').node === 'Map' &&
												path.parentPath.isAssignmentExpression()
											) {
												path.replaceWith(
													t.conditionalExpression(
														t.binaryExpression(
															'===',
															t.unaryExpression('typeof', t.identifier('Map')),
															t.stringLiteral('function')
														),
														t.newExpression(t.identifier('Map'), []),
														t.objectExpression([])
													)
												);
											}
										}
									}
								};
							})
						]
					});
					return {
						code: result.code,
						map: result.map
					};
				}
				return {
					code: code,
					map: null
				};
			}
		},
		globals()
	]
};
