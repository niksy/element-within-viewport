'use strict';

const path = require('path');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const nodeBuiltins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const babel = require('rollup-plugin-babel');
const istanbul = require('rollup-plugin-istanbul');
const rollupConfig = require('./rollup.config');

let config;

const local = typeof process.env.CI === 'undefined' || process.env.CI === 'false';
const port = 9001;

if ( local ) {
	config = {
		browsers: ['Chrome'],
	};
} else {
	config = {
		browserStack: {
			startTunnel: true,
			project: 'element-within-viewport',
			name: 'Automated (Karma)',
			build: 'Automated (Karma)'
		},
		customLaunchers: {
			'BS-Chrome': {
				base: 'BrowserStack',
				browser: 'Chrome',
				os: 'Windows',
				'os_version': '7',
				project: 'element-within-viewport',
				build: 'Automated (Karma)',
				name: 'Chrome'
			},
			'BS-Firefox': {
				base: 'BrowserStack',
				browser: 'Firefox',
				os: 'Windows',
				'os_version': '7',
				project: 'element-within-viewport',
				build: 'Automated (Karma)',
				name: 'Firefox'
			},
			'BS-IE9': {
				base: 'BrowserStack',
				browser: 'IE',
				'browser_version': '9',
				os: 'Windows',
				'os_version': '7',
				project: 'element-within-viewport',
				build: 'Automated (Karma)',
				name: 'IE9'
			},
		},
		browsers: ['BS-Chrome', 'BS-Firefox', 'BS-IE9']
	};
}

module.exports = function ( baseConfig ) {

	baseConfig.set(Object.assign({
		basePath: '',
		frameworks: ['mocha', 'viewport', 'fixture'],
		files: [
			'test/**/*.css',
			'test/**/*.html',
			{ pattern: 'test/**/*.js', watched: false }
		],
		exclude: [],
		preprocessors: {
			'test/**/*.html': ['html2js'],
			'test/**/*.js': ['rollup', 'sourcemap']
		},
		reporters: ['mocha', 'coverage-istanbul'],
		port: port,
		colors: true,
		logLevel: baseConfig.LOG_INFO,
		autoWatch: false,
		client: {
			mocha: {
				timeout: 20000
			},
			captureConsole: true
		},
		browserConsoleLogOptions: {
			level: 'log',
			format: '%b %T: %m',
			terminal: true
		},
		browserNoActivityTimeout: 60000,
		rollupPreprocessor: {
			plugins: [
				nodeBuiltins(),
				babel({
					exclude: 'node_modules/**',
					runtimeHelpers: true
				}),
				resolve({
					preferBuiltins: true
				}),
				commonjs(),
				globals(),
				...rollupConfig.plugins.filter(({ name }) => !['babel'].includes(name)),
				istanbul({
					exclude: ['test/**/*.js', 'node_modules/**/*']
				})
			],
			output: {
				format: 'iife',
				name: 'elementWithinViewport',
				sourcemap: 'inline',
				intro: 'window.TYPED_ARRAY_SUPPORT = false;' // IE9
			}
		},
		coverageIstanbulReporter: {
			dir: path.join(__dirname, 'coverage/%browser%'),
			fixWebpackSourcePaths: true,
			reports: ['html', 'text'],
			thresholds: {
				global: {
					statements: 50
				}
			}
		},
		singleRun: true,
		concurrency: 1
	}, config));

};
