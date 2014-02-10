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

Returns if element is visible inside viewport or not.  
If you pass collection of more than one element, first element will be selected.

You can pass threshold to have plugin check earlier for element presence
(useful for lazy loading of media content).

##### Example

This will check for element presence 300px in upwards and downards direction.

```javascript
$('.block').KistInView('isElementVisible', 300);
```

#### `getVisibleElements`

Type: `String`  
Returns: `Array`

Returns list of elements visible inside viewport
(relies on `isElementVisible` method).

##### Example

Returns list of elements visible inside viewport and 300px in upwards
and downards direction.

```javascript
$('.block').KistInView('getVisibleElements', 300);
```

## Global options

#### `$.KistInView.recalculateViewport`

Type: `Function`

Recalculates viewport values (window height and vertical scroll)
used by every instance of plugin.
