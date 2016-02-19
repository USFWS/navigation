(function () {
  'use strict';

	module.exports = {

		get: function (id) {
			return typeof id === 'string' ? document.getElementById(id) : id;
		},

		getStyle: function (el, style) {

			var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

			if ((!value || value === 'auto') && document.defaultView) {
				var css = document.defaultView.getComputedStyle(el, null);
				value = css ? css[style] : null;
			}

			return value === 'auto' ? null : value;
		},

		create: function (tagName, className, container) {

			var el = document.createElement(tagName);
			el.className = className;

			if (container) {
				container.appendChild(el);
			}

			return el;
		},

		remove: function (el) {
			var parent = el.parentNode;
			if (parent) {
				parent.removeChild(el);
			}
		},

		empty: function (el) {
			while (el.firstChild) {
				el.removeChild(el.firstChild);
			}
		},

		toFront: function (el) {
			el.parentNode.appendChild(el);
		},

		toBack: function (el) {
			var parent = el.parentNode;
			parent.insertBefore(el, parent.firstChild);
		},

		hasClass: function (el, name) {
			if (el.classList !== undefined) {
				return el.classList.contains(name);
			}
			var className = this.getClass(el);
			return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
		},

		splitWords: function (str) {
			return this.trim(str).split(/\s+/);
		},

		trim: function (str) {
			return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
		},

		addClass: function (el, name) {
			if (el.classList !== undefined) {
				var classes = this.splitWords(name);
				for (var i = 0, len = classes.length; i < len; i++) {
					el.classList.add(classes[i]);
				}
			} else if (!this.hasClass(el, name)) {
				var className = this.getClass(el);
				this.setClass(el, (className ? className + ' ' : '') + name);
			}
		},

		removeClass: function (el, name) {
			if (el.classList !== undefined) {
				el.classList.remove(name);
			} else {
				this.setClass(el, trim((' ' + this.getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
			}
		},

		setClass: function (el, name) {
			if (el.className.baseVal === undefined) {
				el.className = name;
			} else {
				// in case of SVG element
				el.className.baseVal = name;
			}
		},

		getClass: function (el) {
			return el.className.baseVal === undefined ? el.className : el.className.baseVal;
		}
	};
})();
