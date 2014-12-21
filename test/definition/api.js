// Returns every `.block` element with 300px threshold.
$('.block').inViewport(300);

// Returns first `.block` element with 100px threshold.
$('.block').eq(0).inViewport({ threshold: 100 });

// Callback when `.block` elements with 300px threshold are in viewport and debounce is 100ms.
$('.block').inViewport({
	threshold: 300,
	debounce: 100,
	success: function ( el ) {
		console.log( 'We’re in viewport!' );
	},
	once: function ( el ) {
		console.log( 'We’re in viewport and this is called only once!' );
	}
});

// Callback when first `.block` element with 300px threshold is in viewport and debounce is 100ms.
$('.block').eq(0).inViewport({
	threshold: 300,
	debounce: 100,
	success: function ( el ) {
		console.log( 'I’m in viewport!' );
	},
	once: function ( el ) {
		console.log( 'I’m in viewport and this is called only once!' );
	}
});

// Destroy plugin instance.
$('.block').inViewport('destroy');
