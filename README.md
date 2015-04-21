DANDOM
=========

DANDOM is a minimal dom selector and manipulation library with animation and http get/post support. It loosly resembles jQuery but is just 4kb min/gzip and has no dependencies.

DOM() creates a new instance of DANDOM() for convenience and brevity (instead of new DANDOM())

DOM() accepts any single node or a collection of nodes and returns the DANDOM object for those nodes.

Easily extend DANDOM with simple libraries by using DANDOM.prototype.myfunction = function(){ }

DOM Element Creation
--------------------
Create a new div

```
DOM().new('div')
```

Create (if it doesn't exist) or retrieve an element by ID

```
DOM().newOrFind('div', 'elementID')
```

DOM Lookup/Query:
-----------

Get element by id 
```
DOM().id('elementID')
```


Get element by id #2
```
DOM( document.getElementById('elementID') )
```


Get elements by class (much faster than queryselectorall).
```
DOM().byClass('className')
```


Get elements by tag name (much faster than queryselectorall)
```
DOM().byTag('className')
```


Get elements by querySelectorAll (slowest method).
```
DOM().find('selector')
```



DOM Manipulation:
-----------

Set the className
```
dandomObject.class('classname1 classname2')
```


Add classes
```
dandomObject.addClass('classname1 classname2')
```


Remove classes
```
dandomObject.removeClass('classname1 classname2')
```


Set inline styles
```
dandomObject.css({'padding':'10px','background-color':'red'})
```


Get inline style
```var padding = dandomObject.css('padding')```


Set attributes
```
dandomObject.attr({'attribute-name':'value','another-attribute-name':'value'})
```


Get attribute
```
dandomObject.attr('attribute-name')
```


Get form element value:
```
dandomObject.val()
```


Set form element value:
```
dandomObject.val('set value')
```


Set node innerHTML:
```
dandomObject.html('<b>hi</b>')
```


Get node innerHTML:
```
var nodehtml = dandomObject.html()
```


Set node text value:
```
dandomObject.text('text value')
```


Get node text value:
```
var nodetext = dandomObject.text()
```

Remove a node
```
dandomObject.remove()
```

Insert node into another node: appendChild
```
dandomObject2.appendTo(dandomObject1)
```

Insert dandom object into a dandom object:
```
DOM().append(dandomObject)
```


Insert before a dandom node:
```
dandomObject.insertBefore(dandomObject2)
```

Insert after a dandom node:
```
dandomObject.insertAfter(dandomObject2)
```

Insert after as first child
```
dandomObject.insertFirst(dandomObject2)
```

Insert with custom ordering/sorting
```
dandomObject.attr({'data-sort-value':somevalue});
dandomObject.appendSort(dandomObject2)
```


Animation
------------------------
Animation requires an object of css properties and values to animate and allows you to specify the duration, easing and a callback when completed.

```
dandomObject.animate(
	{'top':'50px'}, 
	400, 
	'ease-in-out', 
	function(e){
		console.log('animation completed');
	}
);
```

This function automatically creates the css transition before applying the css styles. It also adds the translate3d() transform to help speed up animations by kicking in the GPU. 

For the fastest animations stick to only animating translate, scale and opacity.

Default easing: ease-in-out
Default duration: 250

Smooth Scrolling:
-----------------------------

```
dandomObject.scrollTo(y, duration)
```


Event Listeners
--------------------------------

Add event listener:
```
dandomObject.on('click mousedown',function(e){
	//do some stuff
});
```

You can also use dandomObject.off('event names',functionreference) to remove listeners

Special Touch Handlers

dandomObject.touch(function(e){
	e.danTouch // TODO: WRITE ABOUT THIS. IM GETTING LAZY.
});


HTTP/XMLHttpRequest
------------------------------

```
DOM().http({
	type: 'GET', // or post
	data: 'some data', // data to send/post
	json: false, // true to simply json.parse the response and return the object
	url: 'http://www.whatever.com', //url to post/get to
	callback: function(data){
		console.log(data); // data will be text or json object
	}
})
```


License
-----------

MIT
