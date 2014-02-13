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
    $('.block').KistInView('isInView');
    ```

## Options

#### `isInView`

Type: `String`  
Returns: `Boolean`

Returns if elements are visible inside viewport or not.  
It checks on whole collection of elements. To filter only one element, you can
use standard jQuery filtering methods like `filter()`, `eq()` and similar.

You can pass threshold to have plugin check earlier for element presence
(useful for lazy loading of media content).

##### Example

This will check for element presence 300px in upwards and downards direction.

```javascript
$('.block').KistInView('isInView', 300);
```

#### `getElementsInView`

Type: `String`  
Returns: `Array`

Returns list of elements visible inside viewport
(relies on `isInView` method).

##### Example

Returns list of elements visible inside viewport and 300px in upwards
and downards direction.

```javascript
$('.block').KistInView('getElementsInView', 300);
```

## Global options

#### `$.KistInView.recalculateViewport`

Type: `Function`

Recalculates viewport values (window height and vertical scroll)
used by every instance of plugin.
