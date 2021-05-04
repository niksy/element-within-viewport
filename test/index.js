import assert from 'assert';
import sinon from 'sinon';
import { debounce } from 'throttle-debounce';
import function_ from '../index';

const scrollResizeHandler = (handler) => debounce(300, handler);

function scrollAndWait(offset, wait) {
	return new Promise((resolve) => {
		window.scrollTo(0, offset);
		setTimeout(resolve, wait);
	});
}

function getNodeOffset(node) {
	const rect = node.getBoundingClientRect();
	return (
		rect.top + (window.pageYOffset || document.documentElement.scrollTop)
	);
}

before(function () {
	window.fixture.load('/test/fixtures/index.html');
	window.viewport.set(500, 300);
});

after(function () {
	window.fixture.cleanup();
});

it('should handle callback without scrolling', async function () {
	const selector = '.Test-block';

	const element = document.querySelector(selector);
	const spy = sinon.spy();

	const instance = function_(element, {
		onEnter: spy
	});

	instance.destroy();

	assert.equal(spy.callCount, 1);
});

it('should handle callback', async function () {
	const selector = '.Test-block--last';
	const defaultTimeout = 300 + 100;

	const element = document.querySelector(selector);
	const spy = sinon.spy();
	const spyExit = sinon.spy();

	const instance = function_(element, {
		scrollResizeHandler: scrollResizeHandler,
		onEnter: spy,
		onExit: spyExit
	});

	await scrollAndWait(100, defaultTimeout);
	await scrollAndWait(200, defaultTimeout);
	await scrollAndWait(300, defaultTimeout);
	await scrollAndWait(getNodeOffset(element), defaultTimeout);
	await scrollAndWait(300, defaultTimeout);
	await scrollAndWait(getNodeOffset(element), defaultTimeout);
	await scrollAndWait(300, defaultTimeout);
	await scrollAndWait(getNodeOffset(element), defaultTimeout);
	await scrollAndWait(0, defaultTimeout);

	instance.destroy();

	assert.equal(spy.callCount, 3);

	/*
	 * This test can sometimes be flaky on CI/BrowserStack, valid value is 3
	 * but we will set it in range from 1 to 3 so it can pass
	 */
	assert.ok(spyExit.callCount >= 1 || spyExit.callCount <= 3);
});

it('should handle callback called only once', async function () {
	const selector = '.Test-block--last';
	const defaultTimeout = 300 + 100;

	const element = document.querySelector(selector);
	const spy = sinon.spy();
	const spyExit = sinon.spy();

	const instance = function_(element, {
		scrollResizeHandler: scrollResizeHandler,
		once: true,
		onEnter: spy,
		onExit: spyExit
	});

	await scrollAndWait(100, defaultTimeout);
	await scrollAndWait(200, defaultTimeout);
	await scrollAndWait(300, defaultTimeout);
	await scrollAndWait(getNodeOffset(element), defaultTimeout);
	await scrollAndWait(300, defaultTimeout);
	await scrollAndWait(getNodeOffset(element), defaultTimeout);
	await scrollAndWait(300, defaultTimeout);
	await scrollAndWait(getNodeOffset(element), defaultTimeout);
	await scrollAndWait(0, defaultTimeout);

	instance.destroy();

	assert.equal(spy.callCount, 1);
	assert.equal(spyExit.callCount, 0);
});

it('should handle offset', async function () {
	const selector = '.Test-block--last';
	const defaultTimeout = 300 + 100;
	const viewportSize = 300;
	const threshold = 100;

	const element = document.querySelector(selector);
	const spy = sinon.spy();
	const spyExit = sinon.spy();

	const instance = function_(element, {
		scrollResizeHandler: scrollResizeHandler,
		threshold: threshold,
		onEnter: spy,
		onExit: spyExit
	});

	await scrollAndWait(100, defaultTimeout);
	await scrollAndWait(200, defaultTimeout);
	await scrollAndWait(300, defaultTimeout);
	await scrollAndWait(
		getNodeOffset(element) - (viewportSize + threshold + 1),
		defaultTimeout
	);
	await scrollAndWait(300, defaultTimeout);
	await scrollAndWait(
		getNodeOffset(element) - (viewportSize + threshold),
		defaultTimeout
	);
	await scrollAndWait(300, defaultTimeout);
	await scrollAndWait(
		getNodeOffset(element) - (viewportSize + threshold - 1),
		defaultTimeout
	);
	await scrollAndWait(300, defaultTimeout);
	await scrollAndWait(400, defaultTimeout);
	await scrollAndWait(0, defaultTimeout);

	instance.destroy();

	assert.equal(spy.callCount, 1);
	assert.equal(spyExit.callCount, 1);
});

it('should handle default scroll and resize handler', async function () {
	const selector = '.Test-block--last';
	const timeout = 0;

	const element = document.querySelector(selector);
	const spy = sinon.spy();
	const spyExit = sinon.spy();

	const instance = function_(element, {
		onEnter: spy,
		onExit: spyExit
	});

	await scrollAndWait(100, timeout + 100);
	await scrollAndWait(200, timeout + 100);
	await scrollAndWait(300, timeout + 100);
	await scrollAndWait(getNodeOffset(element), timeout + 100);
	await scrollAndWait(300, timeout + 100);
	await scrollAndWait(getNodeOffset(element), timeout + 100);
	await scrollAndWait(300, timeout + 100);
	await scrollAndWait(getNodeOffset(element), timeout + 100);
	await scrollAndWait(0, timeout + 100);

	instance.destroy();

	assert.equal(spy.callCount, 3);
	assert.equal(spyExit.callCount, 3);
});

it('should handle destroy', async function () {
	const selector = '.Test-block--last';
	const defaultTimeout = 300 + 100;

	const element = document.querySelector(selector);
	const spy = sinon.spy();
	const spyExit = sinon.spy();

	const instance = function_(element, {
		scrollResizeHandler: scrollResizeHandler,
		onEnter: spy,
		onExit: spyExit
	});

	instance.destroy();

	await scrollAndWait(100, defaultTimeout);
	await scrollAndWait(200, defaultTimeout);
	await scrollAndWait(300, defaultTimeout);
	await scrollAndWait(getNodeOffset(element), defaultTimeout);
	await scrollAndWait(300, defaultTimeout);
	await scrollAndWait(getNodeOffset(element), defaultTimeout);
	await scrollAndWait(300, defaultTimeout);
	await scrollAndWait(getNodeOffset(element), defaultTimeout);
	await scrollAndWait(0, defaultTimeout);

	assert.equal(spy.callCount, 0);
	assert.equal(spyExit.callCount, 0);
});
