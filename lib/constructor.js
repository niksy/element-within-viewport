var $ = require('jquery');
var dom = require('./dom');
var events = require('./events');
var instance = require('./instance');
var windowChange = require('./window-change');

var FIRST_CALL_TIMEOUT = (document.all && !document.addEventListener) ? 250 : 0;
var windowCoords = {
	top: 0,
	bottom: 0
};

function calculateViewport () {
	windowCoords.top    = dom.$win.scrollTop();
	windowCoords.bottom = windowCoords.top + dom.$win.height();
}

/**
 * Combined once and success callbacks
 *
 * @param  {jQuery} result
 */
function cbAll ( result ) {

	var onceEl = this.$onceEl;
	var filtered;

	// If once collection isn’t same as original collection
	if ( onceEl.length !== this.$el.length ) {

		// Get only elements which are not inside once collection
		filtered = result.filter(function ( index, element ) {
			return !onceEl.is(element);
		});

		// Add filtered elements to once collection
		this.$onceEl = onceEl.add(filtered);

		// Run callback if we have results
		if ( filtered.length ) {
			this.options.once.call(this._element, filtered);
		}

	}

	this.options.success.call(this._element, result);

}

/**
 * @class
 *
 * @param {jQuery} element
 * @param {Object} options
 */
var InViewport = module.exports = function ( element, options ) {

	this.element = element;
	this._element = element.toArray(); // Get collection of elements as array of DOM nodes

	this.options = $.extend(true, {}, this.defaults, options);

	instance.setup.call(this);
	dom.setup.call(this);
	events.setup.call(this, $.proxy(cbAll, this));

	// Call window change method on the next event loop
	setTimeout($.proxy(windowChange, this, $.proxy(cbAll, this)), FIRST_CALL_TIMEOUT);

};

$.extend(InViewport.prototype, {

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

			return this.isVisible($(element), threshold);

		}, this));

	},

	destroy: function () {
		events.destroy.call(this);
		instance.destroy.call(this);
	},

	defaults: {
		threshold: 0,
		debounce: 300,
		success: $.noop,
		once: $.noop
	}

});
