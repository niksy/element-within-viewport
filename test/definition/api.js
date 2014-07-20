// Returns every `.block` element with 300px threshold.
$('.block').inView(300);

// Returns first `.block` element with 100px threshold.
$('.block').eq(0).inView({ threshold: 100 });

// Callback when `.block` elements with 300px threshold are in viewport.
$('.block').inView(300, function ( el ) {
	console.log( 'We’re in viewport!' );
});

// Callback when `.block` elements with 300px threshold are in viewport and debounce is 100ms.
$('.block').inView({
	threshold: 300,
	debounce: 100,
	success: function ( el ) {
		console.log( 'We’re in viewport!' );
	},
	once: function ( el ) {
		console.log( 'We’re in viewport and this is called only once!' );
	}
});

// Callback when first `.block` element with 300px threshold is in viewport.
$('.block').eq(0).inView(300, function ( el ) {
	console.log( 'I’m in viewport!' );
});

// Callback when first `.block` element with 300px threshold is in viewport and debounce is 100ms.
$('.block').eq(0).inView({
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
$('.block').inView('destroy');
