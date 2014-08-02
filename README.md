# kist-inView

Check if elements are in viewport.

## Installation

```sh
bower install niksy/kist-inView
```

## API

### `Element.inView([options])`

Returns: `jQuery`

#### options

Type: `Integer|Object|String`

##### Options defined as `Integer`

Type: `Integer`  
Default: `0`

Value in pixels which will signal plugin to check for element presence earlier in document.

##### Options defined as `Object`

###### threshold

Type: `Integer`  
Default: `0`

Value in pixels which will signal plugin to check for element presence earlier in document.

###### debounce

Type: `Integer`  
Default: `300`

If [debounce plugin](https://github.com/niksy/jquery-throttle-debounce) is available, time in milliseconds which will be used to debounce callback execution.

###### success

Type: `Function`  
Arguments: [Elements in viewport]

Callback to execute if there are elements inside viewport.

###### once

Type: `Function`  
Arguments: ( [Elements in viewport]

Callback to execute first time when there are elements inside viewport.

##### Options defined as `String`

Type: `String`

###### destroy

Destroy plugin instance.

### Global options

#### `$.kist.inView.defaults`

Type: `Object`

Change defaults for every plugin instance.

## Examples

Returns every `.block` element with 300px threshold.

```js
$('.block').inView(300);
```

Returns first `.block` element with 100px threshold.

```js
$('.block').eq(0).inView({ threshold: 100 });
```

Callback when `.block` elements with 300px threshold are in viewport.

```js
$('.block').inView({
	threshold: 300,
	success: function ( el ) {
		console.log( 'We’re in viewport!' );
	}
});
```

Callback when `.block` elements with 300px threshold are in viewport and debounce is 100ms.

```js
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
```

Callback when first `.block` element with 300px threshold is in viewport.

```js
$('.block').eq(0).inView({
	threshold: 300,
	success: function ( el ) {
		console.log( 'I’m in viewport!' );
	}
});
```

Callback when first `.block` element with 300px threshold is in viewport and debounce is 100ms.

```js
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
```

Destroy plugin instance.

```js
$('.block').inView('destroy');
```

## Browser support

Tested in IE8+ and all modern browsers.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)
