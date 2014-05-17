# kist-inview

Check presence of elements inside viewport.

## Installation

```sh
bower install niksy/kist-inview
```

## Usage

```js
$('div').inView(200);
```

## API

### `el.inView([threshold])`

Returns elements visible inside viewport or not.
It checks on whole collection of elements. To filter only one element, you can use standard jQuery filtering methods like `filter()` and `eq()`.

You can pass threshold to have plugin check earlier for element presence (useful for lazy loading of media content).

##### Example

Returns list of elements visible inside viewport, 300px vertically from both directions.

```js
$('div').inView(300);
```

## Browser support

Tested in IE8+ and all modern browsers.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)
