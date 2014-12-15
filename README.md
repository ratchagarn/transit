transit
=======

Export javascript code available to the javascript file.


## VERSION 0.1.4


## Change log


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

```html
<script src="a.js"></script>
<script src="b.js"></script>
```

```javascript
// a.js
var A = (function() {
  return {
    functionA: function() {
      console.log('Function A');
    }
  }
})();

export('A', A);

// b.js
var A = require('A');
A.functionA(); // Output is `Function A`
```

Folder `demo` for more example :)
