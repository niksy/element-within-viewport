# kist-inviewport

Check if elements are in viewport.

## Installation

```sh
npm install kist-inviewport --save

bower install kist-inviewport --save
```

## API

Following API description assumes you use this module as jQuery plugin.

### `$(Element).inViewport([options])`

Returns: `jQuery`

#### options

Type: `Integer|Object|String`

##### Options defined as `Integer`

Type: `Integer`  
Default: `0`

Value in pixels which will signal plugin to check for element presence earlier in document.

##### Options defined as `Object`

| Property | Type | Description | Default value |
| --- | --- | --- | --- |
| `threshold` | `Integer` | Value in pixels which will signal plugin to check for element presence earlier in document. | `0` |
| `debounce` | `Integer` | Time in milliseconds which will be used to debounce callback execution. | `300` |
| `success` | `Function` | Callback to execute if there are elements inside viewport. Provides jQuery elements in viewport as first argument. | `$.noop` |
| `once` | `Function` | Callback to execute first time when there are elements inside viewport. Provides jQuery elements in viewport as first argument. | `$.noop` |

##### Options defined as `String`

###### destroy

Destroy plugin instance.

### `$.fn.inViewport.defaults`

Type: `Object`

Change defaults for every plugin instance.

## Examples

Returns every `.block` element with 300px threshold.

```js
$('.block').inViewport(300);
```

Returns first `.block` element with 100px threshold.

```js
$('.block').eq(0).inViewport({ threshold: 100 });
```

Callback when `.block` elements with 300px threshold are in viewport.

```js
$('.block').inViewport({
	threshold: 300,
	success: function ( el ) {
		console.log( 'We’re in viewport!' );
	}
});
```

Callback when `.block` elements with 300px threshold are in viewport and debounce is 100ms.

```js
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
```

Callback when first `.block` element with 300px threshold is in viewport.

```js
$('.block').eq(0).inViewport({
	threshold: 300,
	success: function ( el ) {
		console.log( 'I’m in viewport!' );
	}
});
```

Callback when first `.block` element with 300px threshold is in viewport and debounce is 100ms.

```js
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
```

Destroy plugin instance.

```js
$('.block').inViewport('destroy');
```

### AMD and global

```js
define(['kist-inviewport'], cb);

window.$.fn.inViewport;
```

## Browser support

Tested in IE8+ and all modern browsers.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)
