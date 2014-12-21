/*! kist-inviewport 0.7.1 - Check if elements are in viewport. | Author: Ivan Nikolić <niksy5@gmail.com> (http://ivannikolic.com/), 2014 | License: MIT */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self);var n=f;n=n.jQuery||(n.jQuery={}),n=n.fn||(n.fn={}),n.inViewport=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var dom = require(2);
var events = require(3);
var instance = require(5);
var windowChange = require(7);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

module.exports = {
	$win: $(window),
	setup: function () {
		this.$el = $(this.element);
		this.$onceEl = $();
	}
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var dom = require(2);
var windowChange = require(7);
var debounce = require(10).debounce;

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
	if ( timeout ) {
		return debounce(timeout, $.proxy(fn, this, cb));
	}
	return $.proxy(fn, this, cb);
}

module.exports = {
	setup: function ( cb ) {
		dom.$win
			.on(
				'scroll' + this.ens + ' ' +
				'resize' + this.ens,
				bounce.call(this, this.options.debounce, windowChange, cb)
			);
	},
	destroy: function () {
		dom.$win.off(this.ens);
	}
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var Ctor = require(1);
var meta = require(6);
var isPublicMethod = require(8)(meta.publicMethods);

/**
 * @param  {Mixed} options
 *
 * @return {Object}
 */
function constructOptions ( options ) {

	var tmp = {};

	switch ( $.type(options) ) {
		case 'number':
			$.extend(tmp, {
				threshold: options
			});
			break;
		case 'object':
			$.extend(tmp, options);
			break;
	}

	return tmp;
}

var plugin = module.exports = function ( options ) {

	options = options || {};

	if ( isPublicMethod(options) ) {
		return this.each(function () {
			var instance = $.data(this, meta.name);
			if ( instance ) {
				instance[options]();
			}
		});
	}

	options = constructOptions(options);

	// If callbacks are note provided, just give us elements in viewport
	if ( !options.success && !options.once ) {
		return Ctor.prototype.getElements(this, options.threshold || Ctor.prototype.defaults.threshold);
	} else {

		/**
		 * If there are multiple elements, first filter those which don’t
		 * have any instance of plugin instantiated. Then create only one
		 * instance for current collection which will enable us to have
		 * only one scroll/resize event.
		 */
		var collection = this.filter(function () {
			return !$.data(this, meta.name);
		});
		if ( collection.length ) {
			collection.data(meta.name, new Ctor(collection, options));
		}

		return this;

	}

};
plugin.defaults = Ctor.prototype.defaults;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var meta = require(6);
var instance = 0;

module.exports = {
	setup: function () {
		this.uid = instance++;
		this.ens = meta.ns.event + '.' + this.uid;
	},
	destroy: function () {
		this.$el.each(function ( index, element ) {
			$.removeData(element, meta.name);
		});
	}
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
module.exports = {
	name: 'inViewport',
	ns: {
		event: '.kist.inViewport'
	},
	publicMethods: ['destroy']
};

},{}],7:[function(require,module,exports){
/**
 * Action when window is scrolled or resized
 *
 * @param  {Function} cb
 */
module.exports = function ( cb ) {
	var result = this.getElements(this.$el, this.options.threshold);
	if ( result.length ) {
		cb(result);
	}
};

},{}],8:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

/**
 * @param  {Array} methods
 *
 * @return {Function}
 */
module.exports = function ( methods ) {

	/**
	 * @param  {String} name
	 *
	 * @return {Boolean}
	 */
	return function ( name ) {
		return typeof(name) === 'string' && $.inArray(name, methods || []) !== -1;
	};

};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
var throttle = require(11);

/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param  {Number}   delay         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Boolean}  atBegin       Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
 *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
 *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
 * @param  {Function} callback      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                  to `callback` when the debounced-function is executed.
 *
 * @return {Function} A new, debounced function.
 */
module.exports = function ( delay, atBegin, callback ) {
	return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
};

},{}],10:[function(require,module,exports){
module.exports = {
	throttle: require(11),
	debounce: require(9)
};

},{}],11:[function(require,module,exports){
(function (global){
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {Number}    delay          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Boolean}   noTrailing     Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
 *                                    the internal counter is reset)
 * @param  {Function}  callback       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param  {Boolean}   debounceMode   If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
 *                                    schedule `callback` to execute after `delay` ms.
 *
 * @return {Function}  A new, throttled, function.
 */
module.exports = function ( delay, noTrailing, callback, debounceMode ) {

	// After wrapper has stopped being called, this timeout ensures that
	// `callback` is executed at the proper times in `throttle` and `end`
	// debounce modes.
	var timeoutID;

	// Keep track of the last time `callback` was executed.
	var lastExec = 0;

	// `noTrailing` defaults to falsy.
	if ( typeof(noTrailing) !== 'boolean' ) {
		debounceMode = callback;
		callback = noTrailing;
		noTrailing = undefined;
	}

	// The `wrapper` function encapsulates all of the throttling / debouncing
	// functionality and when executed will limit the rate at which `callback`
	// is executed.
	function wrapper () {

		var self = this;
		var elapsed = Number(new Date()) - lastExec;
		var args = arguments;

		// Execute `callback` and update the `lastExec` timestamp.
		function exec () {
			lastExec = Number(new Date());
			callback.apply(self, args);
		}

		// If `debounceMode` is true (at begin) this is used to clear the flag
		// to allow future `callback` executions.
		function clear () {
			timeoutID = undefined;
		}

		if ( debounceMode && !timeoutID ) {
			// Since `wrapper` is being called for the first time and
			// `debounceMode` is true (at begin), execute `callback`.
			exec();
		}

		// Clear any existing timeout.
		if ( timeoutID ) {
			clearTimeout(timeoutID);
		}

		if ( debounceMode === undefined && elapsed > delay ) {
			// In throttle mode, if `delay` time has been exceeded, execute
			// `callback`.
			exec();

		} else if ( noTrailing !== true ) {
			// In trailing throttle mode, since `delay` time has not been
			// exceeded, schedule `callback` to execute `delay` ms after most
			// recent execution.
			//
			// If `debounceMode` is true (at begin), schedule `clear` to execute
			// after `delay` ms.
			//
			// If `debounceMode` is false (at end), schedule `callback` to
			// execute after `delay` ms.
			timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
		}

	}

	// Set the guid of `wrapper` function to the same of original callback, so
	// it can be removed in jQuery 1.4+ .unbind or .die by using the original
	// callback as a reference.
	if ( $ && $.guid ) {
		wrapper.guid = callback.guid = callback.guid || $.guid++;
	}

	// Return the wrapper function.
	return wrapper;

};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[4])(4)
});