transit
=======

Export javascript code available to the javascript file.


## VERSION 0.3.0


## Change log

### 0.3.0
- Remove exports action.
- Remove exports load feature for load and require local file.
- Add new method `destroy` for remove all transit storage.
- Change transit storage structure.


### 0.2.1
- Fixed wrong wording.


### 0.2.0
- Remove alias (exports, require)


### 0.1.5
- Using warning instead of throw Error, When not found exports name.


### 0.1.4
- Change way how to remove duplication load script tag.


### 0.1.3
- Improvement method `exports`


### 0.1.2
- Improvement method `load`


### 0.1.1
- Add new method `requireClone`
- Add new method `load`


### 0.1.0

- Init project.


### Example

#### Export/Require

```html
<!-- HTML -->
<script src="a.js"></script>
<script src="b.js"></script>
```

```javascript
// JavaScript

/**
 * a.js
 * ------------------------------------------------------------
 */
var A = (function() {
  return {
    functionA: function() {
      console.log('Function A');
    }
  }
})();

transit.exports('A', A);

/**
 * b.js
 * ------------------------------------------------------------
 */
var A = transit.require('A');
A.functionA(); // Output is `Function A`
```

#### Load
```javascript
transit.load('http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js', function() {
  $('body').css('background-color', 'red');
});
```

See folder `demo` for more example :)
