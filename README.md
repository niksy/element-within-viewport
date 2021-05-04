# element-within-viewport

[![Build Status][ci-img]][ci]
[![BrowserStack Status][browserstack-img]][browserstack]

Check if element is within viewport.

Convenient wrapper around [viewprt](https://github.com/gpoitch/viewprt)
supporting debounced listeners.

## Install

```sh
npm install element-within-viewport --save
```

## Usage

```js
import elementWithinViewport from 'element-within-viewport';

elementWithinViewport(document.querySelector('#jackie'), {
	onEnter: (element) => {
		// Element in viewport!
	}
});
```

## API

### elementWithinViewport(element, options)

Check if element is within viewport and calls proper callback.

#### element

Type: `Element`

Element to check.

#### options

Type: `object`

| Property              | Type       | Default value          | Description                                                                                                                                                                                          |
| --------------------- | ---------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `threshold`           | `number`   | `0`                    | Positive value in pixels which will signal plugin to check for element presence earlier in document.                                                                                                 |
| `scrollResizeHandler` | `Function` | `(handler) => handler` | Window scroll and resize event handler. Useful if you want to use [throttle or debounce methods](#throttle-debounce-scroll-resize) on those events. Should return new handler (original or wrapped). |
| `onEnter`             | `Function` | `() => {}`             | Callback to execute if element is within viewport.                                                                                                                                                   |
| `onExit`              | `Function` | `() => {}`             | Callback to execute if element exits viewport.                                                                                                                                                       |
| `once`                | `boolean`  | `false`                | If true, will call `onEnter` only once.                                                                                                                                                              |

### instance.destroy()

Destroy instance.

## FAQ

### Throttling and debouncing scroll and resize event<a name="throttle-debounce-scroll-resize"></a>

If you want to throttle or debounce scroll and resize events, modify handler
with `scrollResizeHandler` property.

```js
import { debounce } from 'throttle-debounce';

elementWithinViewport(document.querySelector('#jackie'), {
	scrollResizeHandler: (handler) => debounce(300, handler)
});
```

## Browser support

Tested in Edge 15, Chrome 88 and Firefox 86, and should work in all modern
browsers.

## Test

For automated tests, run `npm run test:automated` (append `:watch` for watcher
support).

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

<!-- prettier-ignore-start -->

[ci]: https://travis-ci.com/niksy/element-within-viewport
[ci-img]: https://travis-ci.com/niksy/element-within-viewport.svg?branch=master
[browserstack]: https://www.browserstack.com/
[browserstack-img]: https://www.browserstack.com/automate/badge.svg?badge_key=bWM5U1R1ZU9DWXdacnFFV2prdVBHN05sZWlSQ0pwUzZoZkdtbXdMRUtscz0tLU9YOEJ0Z0xKZmg5aTJvd1F0TDQ4dFE9PQ==--b50bf3dc08e7e2401acdcd270693865d61221cf9

<!-- prettier-ignore-end -->
