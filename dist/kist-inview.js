/* kist-inview 0.1.0 - Check if elements are in viewport. | Author: Ivan Nikolić, 2014 | License: MIT */
;(function ( $, window, document, undefined ) {

	var o                    = {};
	var pluginName           = 'KistInView';
	var pluginDomNamespace   = 'kist-inview';
	var pluginEventNamespace = 'kist.inview';
	var isFirstTime          = true;

	var recalculateViewport = function () {
		PluginModule.prototype.defaults.windowElTop    = PluginModule.prototype.defaults.domRefs.windowEl.scrollTop();
		PluginModule.prototype.defaults.windowElBottom = PluginModule.prototype.defaults.windowElTop + PluginModule.prototype.defaults.domRefs.windowEl.height();
	};

	var PluginModule = function ( element ) {

		this._element = element;

	};

	/**
	 * Options
	 *
	 * @type {Object}
	 */
	o.options = {
		threshold: 0
	};

	/**
	 * Defaults
	 *
	 * @type {Object}
	 */
	o.defaults = {
		windowElTop: 0,
		windowElBottom: 0,
		domRefs: {
			windowEl: $(window)
		}
	};

	/**
	 * Initialize plugin
	 *
	 * @return {Plugin}
	 */
	o.init = function () {

		this.getDomRefs();

		return this;

	};

	/**
	 * Get DOM references
	 *
	 * @return {Plugin}
	 */
	o.getDomRefs = function () {

		this.domRefs         = {};
		this.domRefs.element = $( this._element );

	};

	/**
	 * Check if element is partially visible in viewport
	 *
	 * @param  {Element}  pElement
	 * @param  {Boolean}  pIsBatchOperation
	 * @param  {Object}  pParams
	 *
	 * @return {Boolean}
	 */
	o.isElementVisible = function ( pElement, pIsBatchOperation, pParams ) {

		var el       = $( pElement ).eq(0);
		var elTop    = el.offset().top;
		var elBottom = elTop + el.height();
		var options;

		if ( Boolean(pIsBatchOperation) === true ) {
			options = pParams;
		} else {
			recalculateViewport();
			options = $.extend( {}, this.options, pParams );
		}

		return elBottom >= this.defaults.windowElTop - options.threshold && elTop <= this.defaults.windowElBottom + options.threshold;

	};

	/**
	 * Check if element is fully visible in viewport
	 *
	 * @param  {Element}  pElement
	 * @param  {Boolean}  pIsBatchOperation
	 *
	 * @return {Boolean}
	 */
	o.isElementFullyVisible = function ( pElement, pIsBatchOperation ) {

		var el       = $( pElement ).eq(0);
		var elTop    = el.offset().top;
		var elBottom = elTop + el.height();

		if ( Boolean(pIsBatchOperation) === false ) {
			recalculateViewport();
		}

		return this.defaults.windowElBottom >= elBottom && this.defaults.windowElTop <= elTop;

	};

	/**
	 * Return list of visible elements in viewport
	 *
	 * @param  {Elements}  pElements
	 * @param  {Boolean}  pGetFullyVisible
	 *
	 * @return {Array}
	 */
	o.getElements = function ( pElements, pGetFullyVisible, pParams ) {

		var instance;
		var options;

		recalculateViewport();
		options = $.extend( {}, this.options, pParams );

		return $( pElements ).filter(function (index, element) {

			instance = $.data(element, pluginName);

			return instance[ ( Boolean( pGetFullyVisible ) === true ? 'isElementFullyVisible' : 'isElementVisible' ) ].call( instance, element, true, options );

		});

	};

	$.extend( PluginModule.prototype, o );

	$[ pluginName ]                     = {};
	$[ pluginName ].options             = PluginModule.prototype.options;
	$[ pluginName ].recalculateViewport = recalculateViewport;

	$.fn[ pluginName ] = function ( method, options ) {

		if ( isFirstTime === true ) {
			recalculateViewport();
			isFirstTime = false;
		}

		this.each(function () {
			if ( !$.data( this, pluginName ) ) {
				$.data( this, pluginName, new PluginModule( this ).init() );
			}
		});

		switch ( method ) {
			case 'isElementVisible':
				return $.data( this[0], pluginName )[ method ].call( $.data( this[0], pluginName ), this[0], null, options );
			case 'isElementFullyVisible':
				return $.data( this[0], pluginName )[ method ].call( $.data( this[0], pluginName ), this[0], null );
			case 'getVisibleElements':
				return PluginModule.prototype.getElements.call( PluginModule.prototype, this, null, options );
			case 'getFullyVisibleElements':
				return PluginModule.prototype.getElements.call( PluginModule.prototype, this, true );
			default:
				throw new Error( pluginName + ': Method is either undefined or doesn’t exist.' );
		}

	};

})( jQuery, window, document );
