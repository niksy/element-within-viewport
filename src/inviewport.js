var InViewport = {};

InViewport.common = {
	threshold: 0,
	domRefs: {
		windowEl: $(window)
	}
};

InViewport.isElementVisible = function ( pElement ) {

	var el       = $(pElement);
	var elTop    = el.offset().top;
	var elBottom = elTop + el.height();

	InViewport.recalculateViewport();

	return elBottom >= InViewport.common.windowElTop - this.common.threshold && elTop <= InViewport.common.windowElBottom + this.common.threshold;

};

InViewport.isElementFullyVisible = function ( pElement ) {

	var el       = $(pElement);
	var elTop    = el.offset().top;
	var elBottom = elTop + el.height();

	InViewport.recalculateViewport();

	return InViewport.common.windowElBottom >= elBottom && InViewport.common.windowElTop <= elTop;

};

InViewport.getVisibleElements = function ( pElements ) {

	InViewport.recalculateViewport();

	return $(pElements).filter(function (index, element) {

		return InViewport.isElementVisible( $(element) );

	}.bind(this));

};

InViewport.getFullyVisibleElements = function ( pElements ) {

	InViewport.recalculateViewport();

	return $(pElements).filter(function (index, element) {

		return InViewport.isElementFullyVisible( $(element) );

	}.bind(this));

};

InViewport.recalculateViewport = function () {

	InViewport.common.windowElTop    = InViewport.common.domRefs.windowEl.scrollTop();
	InViewport.common.windowElBottom = InViewport.common.windowElTop + InViewport.common.domRefs.windowEl.height();

};

InViewport.init = function () {

	InViewport.recalculateViewport();

};

$(document).on('ready', function () {

	InViewport.init();

	$(window).on('scroll', function () {

		console.clear(  );

		console.log( InViewport.getVisibleElements( $('.block') ) );
		console.log( InViewport.getFullyVisibleElements( $('.block') ) );
		console.log( InViewport.isElementVisible( $('.block')[0] ) );
		console.log( InViewport.isElementFullyVisible( $('.block')[0] ) );

	});

});
