import { ElementObserver, ObserverCollection } from 'viewprt';
import { debounce as debounceFn } from 'throttle-debounce';

const debounceCollection = {};

const isFallbackEnv = !('MutationObserver' in global) || !('Map' in global);

export default (
	element,
	options = {}
) => {

	const {
		threshold = 0,
		debounce = 300,
		onEnter = () => {},
		onExit = () => {},
		once = false,
		fallback = true
	} = options;

	if ( fallback && isFallbackEnv ) {
		onEnter(element);
		return {
			_isFallbackEnv: true,
			destroy: () => {}
		};
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
		onExit ( el ) {
			onExit(el);
		},
		offset: threshold,
		once: once,
		...(debounce > 0 && {
			observerCollection: debounceCollection[debounce]
		})
	});

	return {
		_isFallbackEnv: false,
		destroy: elementObserver.destroy.bind(elementObserver)
	};

};
