var $ = require('jquery');
var Ctor = require('./constructor');
var meta = require('./meta');
var isPublicMethod = require('kist-toolbox/lib/is-public-method')(meta.publicMethods);

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
