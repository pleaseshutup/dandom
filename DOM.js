// wraps DOM() into new DANDOM()
var DOM = function(elements) {
	return new DANDOM(elements);
};

var DANDOM = function(elements) {
	this.dandom = true;
	if (!elements) {
		//
	} else {
		if (elements.dandom) {
			this.elements = elements.elements;
		} else {
			if (elements.length) {
				this.elements = elements;
			} else {
				this.elements = [elements];
			}

		}
	}

};

// get element by id for speed, if this.elements exists its setting the id attribut
DANDOM.prototype.id = function(id) {
	if (!this.elements) {
		var el = document.getElementById(id);
		if (el) {
			this.elements = [el];
		}
	} else {
		if (id === undefined) {
			return this.elements[0].id;
		} else {
			this.elements[0].id = id;
		}
	}
	return this;
};

// queryselectorALL
DANDOM.prototype.select = function(selector) {
	var target = (this.elements) ? this.elements[0] : document;
	if (typeof target !== undefined) {} else {
		target = document;
	}
	var newDANDOM = new DANDOM();
	newDANDOM.elements = [].slice.call(target.querySelectorAll(selector));
	return newDANDOM;
};
DANDOM.prototype.find = DANDOM.prototype.select;

// getElementsByClassName
DANDOM.prototype.byClass = function(selector) {
	var target = (this.elements) ? this.elements[0] : document;
	if (typeof target !== undefined) {} else {
		target = document;
	}
	var newDANDOM = new DANDOM();
	newDANDOM.elements = [].slice.call(target.getElementsByClassName(selector));
	return newDANDOM;
};

// getElementsByTagName
DANDOM.prototype.byTag = function(selector) {
	var target = (this.elements) ? this.elements[0] : document;
	if (typeof target !== undefined) {} else {
		target = document;
	}
	var newDANDOM = new DANDOM();
	newDANDOM.elements = [].slice.call(target.getElementsByTagName(selector));
	return newDANDOM;
};

// target parent
DANDOM.prototype.parent = function() {
	return new DANDOM(this.elements[0].parentNode);
};

// creates a new element
DANDOM.prototype.new = function(type, ns) {
	if (!type) {
		type = 'div';
	}
	if (!ns) {
		this.elements = [document.createElement(type)];
	} else {
		var useNS = 'http://www.w3.org/2000/svg';
		if (ns !== 'svg') {
			useNS = ns;
		}
		this.elements = [document.createElementNS(useNS, type)];
	}
	return this;
};

// attempts by id for element or creates it and sets the id
DANDOM.prototype.newOrFind = function(type, id, ns) {
	var exists = new DANDOM().id(id);
	if (!exists.elements) {
		exists = new DANDOM().new(type, ns).id(id);
	}
	return exists;
};

// set className
DANDOM.prototype.class = function(classNames) {
	this.elements.forEach(function(element) {
		element.className = classNames;
	});
	return this;
};

// add Class
DANDOM.prototype.addClass = function(className) {
	var thisElements = this;
	className.split(/[\s,]+/).forEach(function(clsName) {
		clsName = clsName.trim();
		if (clsName) {
			thisElements.elements.forEach(function(element) {
				element.classList.add(clsName);
			});
		}
	});
	return this;
};

// remove Class
DANDOM.prototype.removeClass = function(className) {
	this.elements.forEach(function(element) {
		element.classList.remove(className);
	});
	return this;
};

// clone node and optionally children
DANDOM.prototype.clone = function(deep) {
	if (!deep) {
		deep = false;
	}
	return new DANDOM(this.elements[0].cloneNode(deep));
};

// css accepts an object of css key:value
DANDOM.prototype.css = function(css) {
	if (typeof css !== 'string') {
		this.elements.forEach(function(element) {
			for (var K in css) {
				element.style.setProperty(K, css[K]);
			}
		});
		return this;
	} else {
		return this.elements[0].style[css];
	}

};

// attr accepts an object of attribute key:value
DANDOM.prototype.attr = function(attr) {
	if (typeof attr != 'object') {
		return this.elements[0].getAttribute(attr);
	} else {
		this.elements.forEach(function(element) {
			for (var K in attr) {
				if (K !== 'disabled' && K !== 'checked') {
					element.setAttribute(K, attr[K]);
				} else {
					if (!attr[K]) {
						element[K] = false;
					} else {
						element[K] = true;
					}
				}
			}
		});
	}
	return this;
};

// val will find or set the value for all supported form types
DANDOM.prototype.val = function(val) {
	if (val !== undefined) {
		this.elements.forEach(function(element) {
			element.value = val;
		});
		return this;
	} else {
		return this.elements[0].value || '';
	}
};

// simple means of doing CSS animations triggered by javascript
DANDOM.prototype.animate = function() {
	var css = {},
		speed = 250,
		easing = 'ease-in-out',
		callback = false,
		K;
	[].slice.call(arguments).forEach(function(argument) {
		var type = typeof(argument);
		switch (type) {
			case "number":
				speed = argument;
				break;
			case "string":
				easing = argument;
				break;
			case "function":
				callback = argument;
				break;
			case "object":
				css = argument;
				break;
		}
	});
	this.elements.forEach(function(element) {
		element.transitionEndCalled = false;

		var transitionString = '',
			addTransform = true;
		if (css.transform) {
			addTransform = false;
			if (!css.transform.match(/translate/)) {
				css.transform += ' translate3d(0,0,0)';
			}
		} else {
			if (element.style.transform) {
				if (element.style.transform.match(/translate/)) {
					addTransform = false;
				}
			}
		}
		if (addTransform) {
			element.style.setProperty('transform', 'translate3d(0,0,0)');
		}

		var setStyle = function(prop, val) {
			setTimeout(function() {
				element.style.setProperty(prop, val);
			}, 10);
		};

		for (K in css) {
			if (transitionString) {
				transitionString += ', ';
			}
			transitionString += K + ' ' + (speed / 1000) + 's ' + easing;
			(setStyle(K, css[K]));
		}
		element.style.transition = transitionString;
		if (callback) {
			element.removeEventListener("transitionend", listener);
			var listener = function(e) {
				element.transitionEndCalled = true;
				element.removeEventListener("transitionend", listener);
				callback(e);
			};
			element.addEventListener("transitionend", listener);
			setTimeout(function transitionEndCallbackCheck() {
				if (!element.transitionEndCalled) {
					listener({
						target: element
					});
				}
			}, speed + 10);
		}
	});
	return this;
};

// HTML inserts the HTML or returns it if argument is blank
DANDOM.prototype.html = function(html) {
	if (html !== undefined) {
		this.elements.forEach(function(element) {
			element.innerHTML = html;
		});
		return this;
	} else {
		return this.elements[0].innerHTML;
	}
};

DANDOM.prototype.text = function(text) {
	if (text !== undefined) {
		this.elements.forEach(function(element) {
			element.textContent = text;
		});
		return this;
	} else {
		return this.elements[0].textContent;
	}
};

// removes dom element, fails gracefully
DANDOM.prototype.remove = function() {
	if (this.elements) {
		this.elements.forEach(function(element) {
			if (element.parentNode) {
				element.parentNode.removeChild(element);
			}
		});
		this.elements = false;
	}
};

// on adds eventlisteners to the elements
DANDOM.prototype.on = function(eventNames, execFunc) {
	var elements = this.elements;
	eventNames.split(/[\s,]+/).forEach(function(eventName) {
		eventName = eventName.trim();
		elements.forEach(function(element) {

			if (!elements.events) {
				element.events = {};
			}
			if (!element.events[eventName]) {
				element.events[eventName] = [];
			}
			element.events[eventName].push(execFunc);
			element.addEventListener(eventName, execFunc, false);

			if (eventName !== 'animationend') {} else {
				// also execute webkitanimation end when attaching animation end
				setTimeout(function() {
					element.addEventListener('webkitAnimationEnd', execFunc);
				}, 1);
			}

		});
	});
	return this;
};

// off removes the specific event listener or all if requested
DANDOM.prototype.off = function(eventNames, execFunc) {
	var elements = this.elements;
	eventNames.split(/[\s,]+/).forEach(function(eventName) {
		eventName = eventName.trim();
		elements.forEach(function(element) {

			if (typeof execFunc === 'function') {
				element.removeEventListener(eventName, execFunc);
			} else {
				if (element.events) {
					if (elements.events[eventName]) {
						elements.events[eventName].forEach(function(func) {
							element.removeEventListener(eventName, func);
						});
					}
				}
			}

		});
	});
	return this;
};

DANDOM.prototype.touch = function(execFunc) {
	this.elements.forEach(function(element) {
		var danTouch = {};
		var ts = function(e) {
			danTouch.what = 'start';
			e.danTouch = danTouch;

			danTouch.x = e.touches ? e.touches[0].pageX : e.pageX;
			danTouch.y = e.touches ? e.touches[0].pageY : e.pageY;

			danTouch.ox = danTouch.lx = danTouch.x * 1;
			danTouch.oy = danTouch.ly = danTouch.y * 1;

			danTouch.diffx = 0;
			danTouch.diffy = 0;

			execFunc(e);

			window.addEventListener('touchmove', tm);
			window.addEventListener('mousemove', tm);
			window.addEventListener('touchend', te);
			window.addEventListener('mouseup', te);
			document.addEventListener('mouseout', tes);

		};
		var tes = function(e) {
			e = e ? e : window.event;
			var from = e.relatedTarget || e.toElement;
			if (!from || from.nodeName == "HTML") {
				te(e);
			}
		};
		var te = function(e) {
			danTouch.what = 'end';
			e.danTouch = danTouch;
			execFunc(e);
			window.removeEventListener('touchmove', tm);
			window.removeEventListener('mousemove', tm);
			window.removeEventListener('touchend', te);
			window.removeEventListener('mouseup', te);
			document.removeEventListener('mouseout', tes);
		};
		var tm = function(e) {
			danTouch.what = 'move';
			e.danTouch = danTouch;

			danTouch.x = e.touches ? e.touches[0].pageX : e.pageX;
			danTouch.y = e.touches ? e.touches[0].pageY : e.pageY;

			if (danTouch.x > danTouch.lx) {
				danTouch.swipe = 'r';
				danTouch.dirx = 'r';
			} else {
				danTouch.swipe = 'l';
				danTouch.dirx = 'l';
			}
			if (danTouch.y > danTouch.ly) {
				danTouch.diry = 'd';
			} else {
				danTouch.diry = 'u';
			}
			if (Math.abs(danTouch.diffy) > Math.abs(danTouch.diffx)) {
				if (danTouch.y > danTouch.ly) {
					danTouch.swipe = 'd';
				} else {
					danTouch.swipe = 'u';
				}
			}
			danTouch.lx = danTouch.x * 1;
			danTouch.ly = danTouch.y * 1;

			danTouch.diffx = danTouch.x - danTouch.ox;
			danTouch.diffy = danTouch.y - danTouch.oy;

			execFunc(e);

		};
		element.addEventListener('touchstart', ts);
		element.addEventListener('mousedown', ts);
	});
	return this;
};

// returns the absolute position of the element in pageX/pageY but the relative to the screen dimensions in regular bounding rect form
DANDOM.prototype.pos = function() {
	var rect = this.elements[0].getBoundingClientRect();
	rect.pageY = rect.top + document.body.scrollTop;
	rect.pageX = rect.left + document.body.scrollLeft;
	rect.scrollHeight = this.elements[0].scrollHeight;
	rect.scrollWidth = this.elements[0].scrollWidth;
	rect.offsetTop = this.elements[0].offsetTop;
	rect.offsetHeight = this.elements[0].offsetHeight;

	var el = this.elements[0];
	for (var ot = 0, ol = 0; el !== null; ot += el.offsetTop, ol += el.offsetLeft, el = el.offsetParent);

	rect.offsetTop = ot;
	rect.offsetLeft = ol;
	return rect;
};

// event trigger
DANDOM.prototype.trigger = function(eventName, options) {
	var event = document.createEvent('HTMLEvents');
	event.initEvent(eventName, true, false);
	this.elements.forEach(function(element) {
		element.dispatchEvent(event);
	});
	return this;
};

// appendIf will only run the defined dom change function if it is not yet in the dom
DANDOM.prototype.appendIf = function(appendFunc, appendFuncTarget) {
	if (!document.contains(this.elements[0])) {
		this[appendFunc](appendFuncTarget);
	}
	return this;
};

// appendTo inserts the elements under the provided parent
DANDOM.prototype.appendTo = function(appendTo) {
	var parItem = appendTo.elements[0];
	this.elements.forEach(function(element) {
		parItem.appendChild(element);
	});
	return this;
};

// append will add the given item to the collection
DANDOM.prototype.append = function(append) {
	this.elements.forEach(function(element) {
		append.elements.forEach(function(item) {
			element.appendChild(item);
		});
	});
	return this;
};

// insertBefore inserts the elements before the given element 
DANDOM.prototype.insertBefore = function(insertBefore) {
	var insertTarget = insertBefore.elements[0];
	this.elements.forEach(function insertBefore(element) {
		insertTarget.parentNode.insertBefore(element, insertTarget);
	});
	return this;
};

// insertAfter inserts the elements before the given element 
DANDOM.prototype.insertAfter = function(insertAfter) {
	var insertTarget = insertAfter.elements[0].nextSibling;
	this.elements.forEach(function insertAfter(element) {
		insertTarget.parentNode.insertBefore(element, insertTarget);
	});
	return this;
};

// insertFirst inserts the DANDOM.elements before any existing children elements
DANDOM.prototype.insertFirst = function(insertFirst) {
	var insertTarget = insertFirst.elements[0];
	this.elements.forEach(function insertFirst(element) {
		if (insertTarget.firstChild) {
			insertTarget.insertBefore(element, insertTarget.firstChild);
		} else {
			insertTarget.appendChild(element);
		}
	});
	return this;
};

DANDOM.prototype.appendSort = function(appendTo) {
	this.elements.forEach(function(element) {
		if (!appendTo.elements[0].firstChild) {
			appendTo.elements[0].appendChild(element);
		} else {
			var placed = false,
				placedFoReal = false,
				r = 0,
				locale = false,
				sv = element.getAttribute('data-sort-value');

			if (isNaN(sv)) {
				locale = true;
			} else {
				sv = sv * 1;
			}

			while (!placed) {
				var checkNode = appendTo.elements[0].childNodes[r];
				if (checkNode) {

					if (!locale) {
						if (sv > checkNode.getAttribute("data-sort-value") * 1) {
							placed = true;
						}
					} else {
						if (sv.localeCompare(checkNode.getAttribute("data-sort-value"))) {
							placed = true;
						}
					}
					if (placed) {
						placed = true;
						placedFoReal = true;
						appendTo.elements[0].insertBefore(element, checkNode);
					}
				}
				r++;
				if (r >= appendTo.elements[0].childNodes.length) {
					placed = true;
				}
			}
			if (!placedFoReal) {
				appendTo.elements[0].appendChild(element);
			}
		}
	});
	return this;
};

DANDOM.prototype.scrollTo = function(scrollTo, duration) {
	if (!duration) {
		duration = 250;
	}
	var scrollFrom = this.elements[0].scrollTop,
		fps60 = (1000 / 60),
		framesPerDuration = Math.round(duration / fps60);
	var distance = (scrollTo - scrollFrom) || 0,
		step = (distance / framesPerDuration),
		y = scrollFrom,
		up = (scrollTo < scrollFrom) ? true : false;

	var steps = Math.round(distance / step),
		execSteps = 0,
		allDone = 0;

	if (distance && step && steps) {
		var thisElements = this;
		var interval = setInterval(function() {

			y += step;
			execSteps++;
			if (execSteps > steps) {
				allDone = 1;
			}
			if (up) {
				if (thisElements.elements[0].scrollTop <= scrollTo) {
					allDone = 1;
				}
			} else {
				if (thisElements.elements[0].scrollTop >= scrollTo) {
					allDone = 1;
				}
			}
			if (allDone) {
				clearInterval(interval);
			} else {
				window.requestAnimationFrame(function() {
					thisElements.elements[0].scrollTop = y;
				});
			}

		}, fps60);

	}

};

DANDOM.prototype.http = function(conf) {
	if (conf.url) {
		if (!conf.type) {
			conf.type = 'GET';
		}
		if (!conf.data) {
			conf.data = '';
		}
		var request = new XMLHttpRequest();
		request.open(conf.type, conf.url, true);
		request.onload = function() {
			var ret = false;
			if (request.status >= 200 && request.status < 400) {
				ret = request.responseText;
			}
			if (conf.json) {
				try {
					ret = JSON.parse(request.responseText);
				} catch (e) {
					console.error(e);
					ret = false;
				}
			}
			if (conf.callback) {
				conf.callback(ret);
			}
		};
		request.send(conf.data);
	}
};

if (!window.requestAnimationFrame) {
	requestAnimationFrame = (function() {
		return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback, element) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();
}
