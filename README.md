DANDOM
=========

DANDOM is a minimal dom selector and manipulation library with animation and http get/post support. It loosly resembles jQuery but is just 4kb min/gzip and has no dependencies.

DOM() creates a new instance of DANDOM() for convenience and brevity (instead of new DANDOM())

DOM() accepts any single node or a collection of nodes and returns the DANDOM object for those nodes.

DOM Element Creation
-----------
``` DOM().new('div') ```

DOM Element Creation: Create or retreive an element by ID
``` DOM().newOrFind('div', 'elementID') ```


Get element by id 
``` DOM().id('elementID') ```

Get element by id #2
``` DOM( document.getElementById('elementID') ) ```

Get elements by class (much faster than queryselectorall).
``` DOM().byClass('className') ```

Get elements by tag name (much faster than queryselectorall)
``` DOM().byTag('className') ```

Get elements by querySelectorAll (slowest method).
``` DOM().find('selector') ```





License
-----------

MIT
