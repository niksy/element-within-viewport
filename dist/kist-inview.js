/* kist-inview 0.4.1 - Check if elements are in viewport. | Author: Ivan Nikolić, 2014 | License: MIT */
;(function ( $, window, document, undefined ) {

	var dom = {
		window: $(window)
	};
	var windowCoords = {
		top: 0,
		bottom: 0
	};

	var InView = function () {
		this.calculateViewport();
	};

	$.extend(InView.prototype, {

		/**
		 * Calculate viewport
		 *
		 * @return {}
		 */
		calculateViewport: function () {

			windowCoords.top    = dom.window.scrollTop();
			windowCoords.bottom = windowCoords.top + dom.window.height();

		},

		/**
		 * Check if element is (partially) visible in viewport
		 *
		 * @param  {jQuery}  el
		 * @param  {Number}  threshold
		 *
		 * @return {Boolean}
		 */
		isVisible: function ( el, threshold ) {

			var elTop    = el.offset().top;
			var elBottom = elTop + el.height();
			threshold    = threshold || 0;

			return elBottom >= windowCoords.top - threshold && elTop <= windowCoords.bottom + threshold;

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

				return this.isVisible( $(element), threshold );

			}, this));

		}

	});

	var o = new InView();

	$.fn.inView = function ( threshold ) {
		return o.getElements( this, threshold );
	};

})( jQuery, window, document );
