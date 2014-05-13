/* kist-inview 0.3.0 - Check if elements are in viewport. | Author: Ivan Nikolić, 2014 | License: MIT */
;(function ( $, window, document, undefined ) {

	var pluginNamespace = 'kist';
	var pluginName      = 'inView';

	var InView = function () {

		var setupDomRefs = function () {
			this.dom        = {};
			this.dom.window = $(window);
		};

		setupDomRefs.call(this);
		this.calculateViewport();

	};

	$.extend(InView.prototype, {

		/**
		 * Default options
		 *
		 * @type {Object}
		 */
		defaults: {
			windowTop: 0,
			windowBottom: 0
		},

		/**
		 * Calculate viewport
		 *
		 * @return {}
		 */
		calculateViewport: function () {

			this.defaults.windowTop    = this.dom.window.scrollTop();
			this.defaults.windowBottom = this.defaults.windowTop + this.dom.window.height();

		},

		/**
		 * Check if element is (partially) visible in viewport
		 *
		 * @param  {jQuery}  el
		 * @param  {Number}  threshold
		 * @param  {Boolean}  viewportCalculated
		 *
		 * @return {Boolean}
		 */
		isVisible: function ( el, threshold, viewportCalculated ) {

			var elTop    = el.offset().top;
			var elBottom = elTop + el.height();
			threshold    = threshold || 0;

			if ( !viewportCalculated ) {
				this.calculateViewport();
			}

			return elBottom >= this.defaults.windowTop - threshold && elTop <= this.defaults.windowBottom + threshold;

		},

		/**
		 * Return list of elements visible in viewport
		 *
		 * @param  {jQuery}  el
		 * @param  {Number}  threshold
		 *
		 * @return {jQuery}
		 */
		getElements: function ( el, threshold ) {

			this.calculateViewport();

			return el.filter($.proxy(function ( index, element ) {

				return this.isVisible( $(element), threshold, true );

			}, this));

		}

	});

	var o = new InView();

	$.fn[pluginNamespace] = $.fn[pluginNamespace] || {};

	$.fn[pluginNamespace][pluginName] = function ( method, threshold ) {
		/* jshint -W086 */

		switch ( method ) {
			case 'state': {
				return Boolean( o.getElements( this, threshold ).length );
			}
			case 'elements': {
				return o.getElements( this, threshold );
			}
			default: {
				throw new Error( pluginName + ': Method is either undefined or doesn’t exist.' );
			}
		}

	};

	$.fn[pluginName] = $.fn[pluginName] || $.fn[pluginNamespace][pluginName];

})( jQuery, window, document );
