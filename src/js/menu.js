(function () {
  'use strict';

  var dom = require('./util').dom;
  var _ = require('./util')._;

  var options;

  var defaults = {
    active: false,
    menu: '.fws-menu',
    navClass: 'fws-menu',
    position: 'right',
    toggleClass: 'menu-toggle'
  };

  function init(opts) {
    options = _.defaults({}, opts, defaults);
    if (!options.menu)
      throw new Error('You must provide a menu as a CSS selector or DOM node.');
    else if (typeof options.menu === 'string') {
      options.menu = document.querySelector(options.menu);
      if (!dom.isDom(options.menu)) throw new Error('Could not find menu in HTML document.');
    }
    options.toggle = dom.create('button', options.toggleClass, options.menu);
    _registerHandlers();
  }

  function _registerHandlers() {
    document.body.addEventListener('click', _toggleMenu);
  }

  function _toggleMenu(e) {
    if (dom.hasClass(e.target, options.toggleClass)) toggle();
  }

  function toggle() {
    options.active ? hide() : show(); //jshint ignore:line
  }

  function show() {
    options.active = true;
    dom.addClass(options.menu, 'active');
  }

  function hide() {
    options.active = false;
    dom.removeClass(options.menu, 'active');
  }

  module.exports.init = init;
  module.exports.toggle = toggle;
  module.exports.show = show;
  module.exports.hide = hide;
})();
