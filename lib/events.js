var $ = require('jquery');
var dom = require('./dom');
var windowChange = require('./window-change');
var debounce = require('throttle-debounce').debounce;

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
