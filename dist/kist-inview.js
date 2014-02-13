/* kist-inview 0.3.0 - Check if elements are in viewport. | Author: Ivan Nikolić, 2014 | License: MIT */
;(function ( $, window, document, undefined ) {

	var o                    = {};
	var pluginName           = 'KistInView';
	var pluginDomNamespace   = 'kist-inview';
	var pluginEventNamespace = 'kist.inview';
	var isFirstTime          = true;

	var recalculateViewport = function () {
		o.defaults.windowElTop    = o.defaults.domRefs.windowEl.scrollTop();
		o.defaults.windowElBottom = o.defaults.windowElTop + o.defaults.domRefs.windowEl.height();
	};

	/**
	 * Defaults
	 *
	 * @type {Object}
	 */
	o.defaults = {
		threshold: 0,
		windowElTop: 0,
		windowElBottom: 0,
		domRefs: {
			windowEl: $(window)
		}
	};

	/**
	 * Check if element is partially visible in viewport
	 *
	 * @param  {$DomRef}  pElement
	 * @param  {Number}  pThreshold
	 *
	 * @return {Boolean}
	 */
	o.isInView = function ( pElement, pThreshold ) {

		var elTop    = pElement.offset().top;
		var elBottom = elTop + pElement.height();

		return elBottom >= o.defaults.windowElTop - pThreshold && elTop <= o.defaults.windowElBottom + pThreshold;

	};

	/**
	 * Return list of visible elements in viewport
	 *
	 * @param  {$DomRef}  pElements
	 * @param  {Number}  pThreshold
	 *
	 * @return {Object}
	 */
	o.getElementsInView = function ( pElements, pThreshold ) {

		var instance;

		recalculateViewport();
		pThreshold = pThreshold || o.defaults.threshold;

		return pElements.filter(function (index, element) {

			instance = $.data(element, pluginName);

			return o.isInView( instance, pThreshold );

		});

	};

	$[ pluginName ]                     = {};
	$[ pluginName ].recalculateViewport = recalculateViewport;

	$.fn[ pluginName ] = function ( pMethod, pThreshold ) {

		if ( isFirstTime === true ) {
			recalculateViewport();
			isFirstTime = false;
		}

		this.each(function () {
			if ( !$.data( this, pluginName ) ) {
				$.data( this, pluginName, $(this) );
			}
		});

		switch ( pMethod ) {
			case 'isInView':
				return Boolean( o[ 'getElementsInView' ]( this, pThreshold ).length );
			case 'getElementsInView':
				return o[ 'getElementsInView' ]( this, pThreshold );
			default:
				throw new Error( pluginName + ': Method is either undefined or doesn’t exist.' );
		}

	};

})( jQuery, window, document );
