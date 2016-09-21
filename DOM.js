// wraps DOM() into new DANDOM()
var DOM = function(elements) {
	return new DANDOM(elements);
};

var DANDOM = function(elements) {
	if (!elements) {
		//
	} else {
		if (elements.dandom) {
			this.elements = elements.elements;
		} else {
			if (Object.prototype.toString.call(elements) !== '[object Array]') {
				this.elements = [elements];
			} else {
				this.elements = elements;
			}
		}
	}

};

DANDOM.prototype.dandom = true;

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

// children
DANDOM.prototype.children = function() {
	var newDANDOM = new DANDOM();
	newDANDOM.elements = [];
	this.elements.forEach(function(element){
		newDANDOM.elements = newDANDOM.elements.concat([].slice.call(element.children));
	});
	return newDANDOM;
};

// target parent
DANDOM.prototype.parent = function(selector) {
	//climb parents till you can return a selector
	var go = selector ? this.elements[0].parentNode.parentNode.querySelector(selector) : true;
	if (go) {
		return new DANDOM(this.elements[0].parentNode);
	} else {
		return new DANDOM(this.elements[0].parentNode).parent(selector);
	}
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
		if (!classNames) {
			element.removeAttribute('class');
		} else {
			element.className = classNames;
		}

	});
	return this;
};

// add Class
DANDOM.prototype.addClass = function(className) {
	var thisElements = this;
	className.split(/[\s,]+/).forEach(function(clsName) {
		if (clsName) {
			thisElements.elements.forEach(function(element) {
				if (element.classList) {
					element.classList.add(clsName);
				} else {
					//ie <=9 pf
					element.className += ' ' + clsName;
				}
			});
		}
	});
	return this;
};

// remove Class
DANDOM.prototype.removeClass = function(className) {
	var thisElements = this;
	className.split(/[\s,]+/).forEach(function(clsName) {
		if (clsName) {
			thisElements.elements.forEach(function(element) {
				if (element.classList) {
					element.classList.remove(clsName);
				} else {
					if (className) { //ie <=9 pf
						element.className = element.className.replace(/clsName| clsName/, '');
					}
				}
			});
		}
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
				if (K !== 'transform') {
					element.style.setProperty(K, css[K] + '');
				} else {
					element.style.setProperty(K, css[K] + '');
					element.style.webkitTransform = css[K] + '';
				}
			}
		});
		return this;
	} else {
		return this.elements[0].style[css] || '';
	}

};

// attr accepts an object of attribute key:value
DANDOM.prototype.attr = function(attr) {
	if (typeof attr !== 'object') {
		return this.elements[0].getAttribute(attr);
	} else {
		this.elements.forEach(function(element) {
			for (var K in attr) {
				if (typeof attr[K] !== 'boolean') {
					if (!attr[K] && attr[K] !== 0) {
						element.removeAttribute(K);
					} else {
						element.setAttribute(K, attr[K]);
					}
				} else {
					element[K] = attr[K];
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

// sets individual transforms
DANDOM.prototype.transform = function(transforms) {
	this.elements.forEach(function(element) {
		var tf = element.style.transform,
			spl, len, t, spl2, newTrans = {},
			setTrans = '',
			k;
		if (tf) {
			spl = tf.trim().split(')');
			len = spl.length;
			for (t in spl) {
				if (spl[t]) {
					spl2 = spl[t].trim().split('(');
					if (spl2[0] && spl2[1]) {
						newTrans[spl2[0]] = spl2[1];
					}
				}
			}
			for (k in transforms) {
				newTrans[k] = transforms[k] + '';
			}
			for (k in newTrans) {
				setTrans += k + '(' + newTrans[k] + ') ';
			}
			element.style.transform = setTrans;
			element.style.webkitTransform = setTrans;
		}
	});
	return this;
};

// simple means of doing CSS animations triggered by javascript
DANDOM.prototype.animate = function() {
	var css = {},
		speed = 250,
		easing = 'ease-in-out',
		callback = false,
		K,
		iOS = DANDOM.prototype.clientIs('iOS'),
		Safari = DANDOM.prototype.clientIs('Safari');
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
			} else {
				if (!css.transform.match(/translateZ/) && !css.transform.match(/translate3d/)) {
					css.transform += ' translateZ(0)';
				}
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
				if (prop !== 'transform') {
					element.style.setProperty(prop, val + '');
				} else {
					element.style.setProperty(prop, val + '');
					element.style.webkitTransform = val + '';
				}
			}, 10);
		};

		for (K in css) {
			if (transitionString) {
				transitionString += ', ';
			}
			if (K === 'transform' && (iOS || Safari)) {
				transitionString += '-webkit-' + K + ' ' + (speed / 1000) + 's ' + easing;
			} else {
				transitionString += K + ' ' + (speed / 1000) + 's ' + easing;
			}
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
			element.textContent = text + ''; //prevents zero from doing nothing
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
	var self = this,
		elements = this.elements;
	eventNames.split(/[\s,]+/).forEach(function(eventName) {
		if (eventName === 'click') {
			if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
				// special event click for ios cause apple
				self.touch(function danTouchTap(e) {
					if (e.danTouch.what === 'tap') {
						execFunc(e);
					}
				});
				if (elements) {
					elements.forEach(function(element) {
						element.addEventListener('click', function(e) {
							if (element.href) {
								e.preventDefault();
							}
						}, false);
					});
				}
				eventName = '';
			}
		}
		if (eventName) {
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
		}
	});
	return this;
};

// off removes the specific event listener or all if requested
DANDOM.prototype.off = function(eventNames, execFunc) {
	var elements = this.elements;
	eventNames.split(/[\s,]+/).forEach(function(eventName) {
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
	if (!this.exists()) {
		return false;
	}
	this.elements.forEach(function(element) {
		var danTouch = {
			started: false
		};
		var ts = function dandom_start(e) {

			danTouch.what = 'start';
			if (!danTouch.started) {

				danTouch.started = true;
				danTouch.tapCancel = false;
				e.danTouch = danTouch;

				danTouch.x = e.touches ? e.touches[0].pageX : e.pageX;
				danTouch.y = e.touches ? e.touches[0].pageY : e.pageY;

				danTouch.ox = danTouch.lx = danTouch.x * 1;
				danTouch.oy = danTouch.ly = danTouch.y * 1;

				danTouch.diffx = 0;
				danTouch.diffy = 0;

				danTouch.timeStart = new Date().getTime();
				execFunc(e);

				if (e.type.match(/touch/)) {
					window.addEventListener('touchmove', tm);
					window.addEventListener('touchend', te);
					window.addEventListener('touchcancel', tc);
				} else {
					window.addEventListener('mousemove', tm);
					window.addEventListener('mouseup', te);
					document.addEventListener('mouseout', tes);
				}

			}
		};
		var tc = function dandom_cancel(e) {
			danTouch.tapCancel = true;
		};
		var tes = function dandom_endhack(e) {
			e = e ? e : window.event;
			var from = e.relatedTarget || e.toElement;
			if (!from || from.nodeName == "HTML") {
				te(e);
			}
		};
		var te = function dandom_end(e) {

			danTouch.what = 'end';
			e.danTouch = danTouch;
			danTouch.timeEnd = new Date().getTime();
			danTouch.timeElapsed = danTouch.timeEnd - danTouch.timeStart;
			execFunc(e);

			if (danTouch.timeStart && danTouch.timeElapsed && !danTouch.tapCancel) {
				e.danTouch.what = 'tap';
				execFunc(e);
			}

			window.removeEventListener('touchmove', tm);
			window.removeEventListener('touchend', te);
			window.removeEventListener('touchcancel', tc);
			window.removeEventListener('mousemove', tm);
			window.removeEventListener('mouseup', te);
			document.removeEventListener('mouseout', tes);
			setTimeout(function() {
				danTouch.started = false;
			}, 10);

		};
		var tm = function dandom_move(e) {

			danTouch.what = 'move';
			danTouch.tapCancel = true;
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

		if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
			element.addEventListener('touchstart', ts);
		} else {
			element.addEventListener('touchstart', ts);
			element.addEventListener('mousedown', ts);
		}

	});
	return this;
};

// returns the absolute position of the element in pageX/pageY but the relative to the screen dimensions in regular bounding rect form
DANDOM.prototype.pos = function() {
	var rect = this.elements[0].getBoundingClientRect();
	rect.pageY = rect.top + document.body.scrollTop || document.documentElement.scrollTop;
	rect.pageX = rect.left + document.body.scrollLeft || document.documentElement.scrollLeft;
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
DANDOM.prototype.trigger = function(eventName, data) {
	var event;
	if (document['on' + eventName]) { //html event
		event = document.createEvent('HTMLEvents');
		event.initEvent(eventName, true, false);
	} else if (typeof window.CustomEvent === 'function') {
		event = new CustomEvent(eventName, {
			detail: data
		});
	} else {
		event = document.createEvent('CustomEvent');
		event.initCustomEvent(eventName, true, true, data);
	}
	this.elements.forEach(function(element) {
		element.dispatchEvent(event);
	});
	return this;
};

DANDOM.prototype.exists = function(callbackIfExists) {
	if (this.elements) {
		if (this.elements.length) {
			if (typeof callbackIfExists === 'function') {
				callbackIfExists(this);
			}
			return true;
		}
	}
	return false;
};

DANDOM.prototype.inDOM = function(callbackIfExists) {
	if (this.elements) {
		if (this.elements.length) {
			if( document.body.contains(this.elements[0]) ){
				if (typeof callbackIfExists === 'function') {
					callbackIfExists(this);
				}
				return true;
			}
		}
	}
	return false;
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

// appendFirst will add the input dom item to the current dom item
DANDOM.prototype.appendFirst = function(append) {
	this.elements.forEach(function(element) {
		append.elements.forEach(function(item) {
			if (element.firstChild) {
				element.insertBefore(item, element.firstChild);
			} else {
				element.appendChild(item);
			}
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
	this.elements.forEach(function insertAfterFunc(element) {
		if (insertTarget) {
			insertTarget.parentNode.insertBefore(element, insertTarget);
		} else {
			insertAfter.elements[0].parentNode.appendChild(element);
		}
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
				sv = sv + '';
				sv = sv.toLowerCase();
			} else {
				sv = sv * 1;
			}

			while (!placed) {
				var checkNode = appendTo.elements[0].childNodes[r];
				if (checkNode && checkNode.getAttribute) {
					if (!locale) {
						if (sv > checkNode.getAttribute("data-sort-value") * 1) {
							placed = true;
						}
					} else {
						var checkSV = checkNode.getAttribute('data-sort-value') || '';
						if (sv < checkSV.toLowerCase()) {
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

DANDOM.prototype.scrollTo = function(scrollTo, duration, property) {
	if (!duration) {
		duration = 250;
	}
	if (!property) {
		property = 'scrollTop';
	}
	this.elements.forEach(function(element) {
		var scrollFrom = element[property],
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
			var interval = setInterval(function() {

				y += step;
				execSteps++;
				if (execSteps > steps) {
					allDone = 1;
				}
				if (up) {
					if (element[property] <= scrollTo) {
						allDone = 1;
					}
				} else {
					if (element[property] >= scrollTo) {
						allDone = 1;
					}
				}
				if (allDone) {
					clearInterval(interval);
				} else {
					window.requestAnimationFrame(function() {
						element[property] = y;
					});
				}

			}, fps60);

		}
	});

};

DANDOM.prototype.http = function(conf) {
	if (conf.url) {
		if (!conf.type) {
			if (!conf.data) {
				conf.type = 'GET';
			} else {
				conf.type = 'POST';
			}
		}
		if (!conf.data) {
			conf.data = '';
		}
		var request = new XMLHttpRequest();
		request.timeout = conf.timeout || 5000;
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
		request.onerror = function() {
			if (conf.callback) {
				conf.callback(false);
			}
		};
		request.ontimeout = function() {
			if (conf.callback) {
				conf.callback(false);
			}
		};
		request.send(conf.data);
	}
};

DANDOM.prototype.clientIs = function(what) {
	if (!window.dandomClient) {
		window.dandomClient = {};
	}
	if (typeof window.dandomClient[what] !== undefined) {
		if (what === 'iOS') {
			window.dandomClient[what] = /iPhone|iPad|iPod/i.test(navigator.userAgent);
		} else if (what === 'Safari') {
			window.dandomClient[what] = (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") < 0);
		}
	}
	return window.dandomClient[what];
};

DANDOM.prototype.polyFill = function() {
	window.isIE = window.navigator.userAgent.indexOf('MSIE') > -1;
	if (!window.requestAnimationFrame) {
		if ((document.all && !window.atob)) { //ie9 critical
			CSSStyleDeclaration.prototype.setProperty = function(a, b) {
				return this.setAttribute(a, b);
			};
			window.history.pushState = function(state, title, url) {
				window.location.href = url;
				return false;
			};
		}
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
};
