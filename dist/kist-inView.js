/*! kist-inView 0.5.4 - Check if elements are in viewport. | Author: Ivan Nikolić, 2014 | License: MIT */
;(function ( $, window, document, undefined ) {

	var plugin = {
		name: 'inView',
		ns: {
			css: 'kist-InView',
			event: '.kist.inView'
		}
	};

	var dom = {
		common: {
			window: $(window)
		},
		setup: function () {
			this.dom    = this.dom || {};
			this.dom.el = $(this.element);
		}
	};

	var events = {
		setup: function ( cb ) {
			dom.common.window
				.on(
					'scroll' + this.instance.ens + ' ' +
					'resize' + this.instance.ens,
					bounce.call(this, this.options.debounce, windowChange, cb)
				);
		},
		destroy: function () {
			dom.common.window.off(this.instance.ens);
		}
	};

	var instance = {
		id: 0,
		setup: function () {
			this.instance     = this.instance || {};
			this.instance.id  = instance.id++;
			this.instance.ens = plugin.ns.event + '.' + this.instance.id;
		},
		destroy: function () {
			this.dom.el.each(function ( index, element ) {
				delete $.data(element)[plugin.name];
			});
		}
	};

	var windowCoords = {
		top: 0,
		bottom: 0
	};

	/**
	 * Calculate viewport
	 *
	 * @return {Object}
	 */
	function calculateViewport () {
		windowCoords.top    = dom.common.window.scrollTop();
		windowCoords.bottom = windowCoords.top + dom.common.window.height();

		return windowCoords;
	}

	/**
	 * When window is scrolled or resized
	 *
	 * @param  {Function} cb
	 *
	 * @return {Function}
	 */
	function windowChange ( cb ) {
		var result = this.getElements(this.dom.el, this.options.threshold);
		if ( result.length ) {
			return cb.call(null, result);
		}
	}

	/**
	 * Bouncing mechanism
	 *
	 * @param  {Integer}   timeout
	 * @param  {Function} fn
	 * @param  {Function} cb
	 *
	 * @return {Function}
	 */
	function bounce ( timeout, fn, cb ) {
		if ( this.options.debounce && $.debounce ) {
			return $.debounce( timeout, $.proxy(fn, this, cb) );
		}
		return $.proxy(fn, this, cb);
	}

	function InView ( element, options, cb ) {

		this.element = element;
		this.options = $.extend({}, this.defaults, options);

		instance.setup.call(this);
		dom.setup.call(this);
		events.setup.call(this, cb);

		windowChange.call(this, cb);

	}

	$.extend(InView.prototype, {

		/**
		 * Check if element is (partially) visible in viewport
		 *
		 * @param  {jQuery}  el
		 * @param  {Integer}  threshold
		 *
		 * @return {Boolean}
		 */
		isVisible: function ( el, threshold ) {

			var elTop    = el.offset().top;
			var elBottom = elTop + el.height();
			threshold    = threshold || this.defaults.threshold;

			return elBottom >= windowCoords.top - threshold && elTop <= windowCoords.bottom + threshold;

		},

		/**
		 * Return list of elements visible in viewport
		 *
		 * @param  {jQuery}  el
		 * @param  {Integer}  threshold
		 *
		 * @return {jQuery}
		 */
		getElements: function ( el, threshold ) {

			calculateViewport();

			return el.filter($.proxy(function ( index, element ) {

				return this.isVisible( $(element), threshold );

			}, this));

		},

		destroy: function () {
			instance.destroy.call(this);
			events.destroy.call(this);
		},

		/**
		 * Default options
		 *
		 * @type {Object}
		 */
		defaults: {
			threshold: 0,
			debounce: 300,
			success: null
		}

	});

	$.kist = $.kist || {};

	$.kist[plugin.name] = {
		defaults: InView.prototype.defaults
	};

	$.fn[plugin.name] = function ( options, cb ) {

		options = options || {};
		cb = cb || options.success;

		if ( typeof(options) === 'number' ) {
			options = {
				threshold: options
			};
		}

		if ( typeof(options) === 'string' ) {
			return this.each(function () {
				if ($.data(this, plugin.name)) {
					$.data(this, plugin.name)[options]();
				}
			});
		}

		if ( !cb ) {
			return InView.prototype.getElements( this, options.threshold );
		} else {

			/**
			 * If there are multiple elements, first filter those which don’t
			 * have any instance of plugin instantiated. Then create only one
			 * instance for current collection which will enable us to have
			 * only one scroll/resize event.
			 */
			return this
				.filter(function ( index, element ) {
					return !$.data(element, plugin.name);
				})
				.data(plugin.name, new InView( this, options, cb ));
		}

	};

})( jQuery, window, document );
