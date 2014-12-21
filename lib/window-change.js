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
