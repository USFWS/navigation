(function () {
  'use strict';

  var _ = {
    defaults: require('lodash.defaults'),
    each: require('lodash.foreach'),
    closest: require('select-parent'),
    isDom: require('is-dom'),
    tabbable: require('tabbable'),
    find: find,
    get: get,
    getStyle: getStyle,
    create: create,
    remove: remove,
    empty: empty,
    toFront: toFront,
    toBack: toBack,
    hasClass: hasClass,
    splitWords: splitWords,
    trim: trim,
    addClass: addClass,
    removeClass: removeClass,
    setClass: setClass,
    getClass: getClass
  };

  module.exports = _;

  function find(el) {
    if ( _.isDom(el) ) return el;

    el = document.querySelector(el);

    if (_.isDom(el)) return el;
    else throw new Error('Could not find element.');
  }

  function get(id) {
    return typeof id === 'string' ? document.getElementById(id) : id;
  }

  function getStyle(el, style) {

    var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

    if ((!value || value === 'auto') && document.defaultView) {
      var css = document.defaultView.getComputedStyle(el, null);
      value = css ? css[style] : null;
    }

    return value === 'auto' ? null : value;
  }

  function create(tagName, className, container) {

    var el = document.createElement(tagName);
    if (className) el.className = className;
    if (container) container.appendChild(el);

    return el;
  }

  function remove(el) {
    var parent = el.parentNode;
    if (parent) {
      parent.removeChild(el);
    }
  }

  function empty(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  function toFront(el) {
    el.parentNode.appendChild(el);
  }

  function toBack(el) {
    var parent = el.parentNode;
    parent.insertBefore(el, parent.firstChild);
  }

  function hasClass(el, name) {
    if (el.classList !== undefined) {
      return el.classList.contains(name);
    }
    var className = getClass(el);
    return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
  }

  function splitWords(str) {
    return trim(str).split(/\s+/);
  }

  function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
  }

  function addClass(el, name) {
    if (el.classList !== undefined) {
      var classes = splitWords(name);
      for (var i = 0, len = classes.length; i < len; i++) {
        el.classList.add(classes[i]);
      }
    } else if (!hasClass(el, name)) {
      var className = getClass(el);
      setClass(el, (className ? className + ' ' : '') + name);
    }
  }

  function removeClass(el, name) {
    if (el.classList !== undefined) {
      el.classList.remove(name);
    } else {
      setClass(el, trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
    }
  }

  function setClass(el, name) {
    if (el.className.baseVal === undefined) {
      el.className = name;
    } else {
      // in case of SVG element
      el.className.baseVal = name;
    }
  }

  function getClass(el) {
    return el.className.baseVal === undefined ? el.className : el.className.baseVal;
  }


})();
