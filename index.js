import { ElementObserver, ObserverCollection } from 'viewprt';
import { debounce as debounceFn } from 'throttle-debounce';

const debounceCollection = {};

export default (
	element,
	options = {}
) => {

	const {
		threshold = 0,
		debounce = 300,
		onEnter = () => {},
		once = false
	} = options;

	if ( !('MutationObserver' in window) || !('Map' in window) ) {
		onEnter(element);
		return;
	}

	if ( typeof debounceCollection[debounce] === 'undefined' && debounce > 0 ) {
		debounceCollection[debounce] = new ObserverCollection({
			handleScrollResize: ( handler ) => debounceFn(debounce, handler)
		});
	}

	const elementObserver = new ElementObserver(element, {
		onEnter ( el ) {
			onEnter(el);
		},
		offset: threshold,
		once: once,
		...(debounce > 0 && {
			observerCollection: debounceCollection[debounce]
		})
	});

	return {
		destroy: elementObserver.destroy.bind(elementObserver)
	};

};
