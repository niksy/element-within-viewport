import viewprt from 'viewprt';

const { ElementObserver, ObserverCollection } = viewprt;

const debounceCollection = [];
const defaultScrollResizeHandler = (handler) => handler;

export default (element, options = {}) => {
	const {
		threshold = 0,
		scrollResizeHandler = defaultScrollResizeHandler,
		onEnter = () => {},
		onExit = () => {},
		once = false
	} = options;

	let resolvedHandler = debounceCollection.find(
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
		destroy: elementObserver.destroy.bind(elementObserver)
	};
};
