import { ElementObserver, ObserverCollection } from 'viewprt';

const debounceCollection = [];
const defaultScrollResizeHandler = (handler) => handler;

const isFallbackEnvironment =
	!('MutationObserver' in global) || !('Map' in global);

export default (element, options = {}) => {
	const {
		threshold = 0,
		scrollResizeHandler = defaultScrollResizeHandler,
		onEnter = () => {},
		onExit = () => {},
		once = false,
		fallback = true
	} = options;

	if (fallback && isFallbackEnvironment) {
		onEnter(element);
		return {
			_isFallbackEnv: true,
			destroy: () => {}
		};
	}

	let [resolvedHandler] = debounceCollection.filter(
		({ handleScrollResize }) => scrollResizeHandler === handleScrollResize
	);

	if (typeof resolvedHandler === 'undefined') {
		resolvedHandler = new ObserverCollection({
			handleScrollResize: scrollResizeHandler
		});
		debounceCollection.push(resolvedHandler);
	}

	const elementObserver = new ElementObserver(element, {
		onEnter(element_) {
			onEnter(element_);
		},
		onExit(element_) {
			onExit(element_);
		},
		offset: threshold,
		once: once,
		observerCollection: resolvedHandler
	});

	return {
		_isFallbackEnv: false,
		destroy: elementObserver.destroy.bind(elementObserver)
	};
};
