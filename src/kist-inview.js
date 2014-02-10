/* jshint maxparams: 4 */
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
	 * @param  {Boolean}  pIsBatchOperation
	 *
	 * @return {Boolean}
	 */
	o.isElementVisible = function ( pElement, pThreshold, pIsBatchOperation ) {

		var elTop    = pElement.offset().top;
		var elBottom = elTop + pElement.height();

		if ( Boolean( pIsBatchOperation ) === true ) {
			pThreshold = pThreshold;
		} else {
			recalculateViewport();
			pThreshold = pThreshold || o.defaults.threshold;
		}

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
	o.getVisibleElements = function ( pElements, pThreshold ) {

		var instance;

		recalculateViewport();
		pThreshold = pThreshold || o.defaults.threshold;

		return pElements.filter(function (index, element) {

			instance = $.data(element, pluginName);

			return o.isElementVisible( instance, pThreshold, true );

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
			case 'isElementVisible':
				return o[ pMethod ]( $.data( this[0], pluginName ), pThreshold, null );
			case 'getVisibleElements':
				return o[ pMethod ]( this, pThreshold );
			default:
				throw new Error( pluginName + ': Method is either undefined or doesn’t exist.' );
		}

	};

})( jQuery, window, document );
