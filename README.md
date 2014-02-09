# Kist InView

Check if elements are in viewport.

## Usage

1. Include jQuery and plugin.  

    ```html
    <script src="jquery.min.js"></script>
    <script src="dist/kist-inview.min.js">
    ```

2. Initialize plugin.

    ```javascript
    $('.block').KistInView('isElementVisible');
    ```

## Options

#### `isElementVisible`

Type: `String`  
Returns: `Boolean`

Returns if element is partially visible in viewport or not.
You can pass threshold to have plugin check earlier for element presence
(useful for lazy loading of media content).

##### Example

This will check for element presence 300px in upwards and downards direction.

```javascript
$('.block').KistInView('isElementVisible', { threshold: 300 });
```

#### `isElementFullyVisible`

Type: `String`  
Returns: `Boolean`

Same as `isElementVisible`, but it’s true only if element is fully visible in
viewport. Does not receive threshold parameter.

#### `getVisibleElements`

Type: `String`  
Returns: `Array`

Returns list of elements partially visible inside viewport
(relies on `isElementVisible` method).

#### `getFullyVisibleElements`

Type: `String`  
Returns: `Array`

Same as `getVisibleElements`, but returns list of elements fully visible inside viewport
(relies on `isFullyVisible` method).

## Global options

#### `$.KistInView.recalculateViewport`

Type: `Function`

Recalculates viewport values (window height and vertical scroll)
used by every instance of plugin.

#### `$.KistInView.options.threshold`

Type: `Number`  
Default value: `0`

Default threshold value.
