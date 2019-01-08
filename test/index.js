import assert from 'assert';
import sinon from 'sinon';
import fn from '../index';

function scrollAndWait ( offset, wait ) {
	return new Promise(( resolve ) => {
		window.scrollTo(0, offset);
		setTimeout(resolve, wait);
	});
}

function getNodeOffset ( node ) {
	const rect = node.getBoundingClientRect();
	return rect.top + (window.pageYOffset || document.documentElement.scrollTop);
}

describe('element-within-viewport', function () {

	this.timeout(20000);

	before(function () {
		window.fixture.load('/test/fixtures/index.html');
		window.viewport.set(500, 300);
	});

	after(function () {
		window.fixture.cleanup();
	});

	it('should handle callback', async function () {

		const selector = '.Test-block--last';
		const defaultTimeout = 300 + 100;

		const element = document.querySelector(selector);
		const spy = sinon.spy();

		const instance = fn(element, {
			onEnter: spy
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

		assert.equal(spy.callCount, instance._isFallbackEnv ? 1 : 3);

	});

	it('should handle callback called only once', async function () {

		const selector = '.Test-block--last';
		const defaultTimeout = 300 + 100;

		const element = document.querySelector(selector);
		const spy = sinon.spy();

		const instance = fn(element, {
			once: true,
			onEnter: spy
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

	});

	it('should handle offset', async function () {

		const selector = '.Test-block--last';
		const defaultTimeout = 300 + 100;
		const viewportSize = 300;
		const threshold = 100;

		const element = document.querySelector(selector);
		const spy = sinon.spy();

		const instance = fn(element, {
			threshold: threshold,
			onEnter: spy
		});

		await scrollAndWait(100, defaultTimeout);
		await scrollAndWait(200, defaultTimeout);
		await scrollAndWait(300, defaultTimeout);
		await scrollAndWait(getNodeOffset(element) - (viewportSize + threshold + 1), defaultTimeout);
		await scrollAndWait(300, defaultTimeout);
		await scrollAndWait(getNodeOffset(element) - (viewportSize + threshold), defaultTimeout);
		await scrollAndWait(300, defaultTimeout);
		await scrollAndWait(getNodeOffset(element) - (viewportSize + threshold - 1), defaultTimeout);
		await scrollAndWait(300, defaultTimeout);
		await scrollAndWait(400, defaultTimeout);
		await scrollAndWait(0, defaultTimeout);

		instance.destroy();

		assert.equal(spy.callCount, 1);

	});

	it('should handle debounce', async function () {

		const selector = '.Test-block--last';
		const timeout = 1;

		const element = document.querySelector(selector);
		const spy = sinon.spy();

		const instance = fn(element, {
			debounce: timeout,
			onEnter: spy
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

		assert.equal(spy.callCount, instance._isFallbackEnv ? 1 : 3);

	});

});
