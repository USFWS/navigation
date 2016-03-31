(function () {
  'use strict';

  var _ = require('./util');

  var options;

  var defaults = {
    active: false,
    menu: '.fws-menu',
    position: 'right',
    navClass: 'fws-menu',
    toggleClass: 'menu-toggle',
    subMenuClass: 'sub-menu',
    activeClass: 'fws-menu-active'
  };

  function init(opts) {
    options = _.defaults({}, opts, defaults);
    options.menu = _.find(options.menu);
    if (options.active) _.addClass(options.menu, options.activeClass);
    options.close = _.create('button', 'fws-menu-close', options.menu);
    options.close.innerHTML = '&times;';
    _checkForValidPosition();
    _processSubMenus();
    _registerHandlers();
  }

  function _registerHandlers() {
    document.body.addEventListener('click', _toggleMenu);
    document.body.addEventListener('keyup', _keyHandler);
    options.menu.addEventListener('click', _openSubMenu);
    options.menu.addEventListener('click', _closeSubMenuHandler);
    options.close.addEventListener('click', hide);
  }

  function destroy() {
    document.body.removeEventListener('click', _toggleMenu);
    document.body.removeEventListener('keyup', _keyHandler);
    options.menu.removeEventListener('click', _openSubMenu);
    options.menu.removeEventListener('click', _closeSubMenuHandler);
    options.close.removeEventListener('click', hide);
  }

  function _processSubMenus() {
    var menu = options.menu.querySelector('ul');
    var submenus = menu.querySelectorAll('ul');
    _.each(submenus, function (submenu) {
      var parentLi = _.closest(submenu, 'li');
      _.addClass(parentLi, 'has-children');
      _.removeClass(submenu, 'move-out');
      _.addClass(submenu, options.subMenuClass + ' menu-hidden');
      _addBackListItem(submenu);
    });
  }

  // Adds a "back" list item to the top of each sub menu-back
  // Adds a click target overlapping the sliver showing from the parent menu
  function _addBackListItem(submenu) {
    var firstLi = submenu.querySelector('li');
    var li = _.create('li');
    var backBlock = _.create('li', 'menu-back back-block');
    backBlock.innerHTML = 'Back';
    var a = _.create('a', 'menu-back', li);
    a.innerHTML = 'Back';
    a.setAttribute('href', '#back');
    submenu.insertBefore(li, firstLi);
    submenu.appendChild(backBlock);
  }

  function _updateMenuAnchors() {
    var activeMenu = options.menu.querySelector('.menu-active');
    _disableAllMenuAchors();
    _enableActiveMenuAnchors(activeMenu);
  }

  function _disableAllMenuAchors() {
    var allAnchors = options.menu.querySelectorAll('a');
    _.each(allAnchors, function (link) {
      link.setAttribute('tabindex', -1);
    });
  }

  function _enableActiveMenuAnchors(menu) {
    var anchors = _findActiveMenuAnchors(menu);
    _.each(anchors, function(anchor) {
      anchor.setAttribute('tabindex', 0);
    });
  }

  function _findActiveMenuAnchors(menu) {
    var children = menu.children;
    var anchors = [];
    _.each(children, function(child) {
      var grandchildren = child.children;
      _.each(grandchildren, function(grandchild) {
        if (grandchild.nodeName === 'A') anchors.push(grandchild);
      });
    });
    return anchors;
  }

  function _moveOutParentMenu(el) {
    var parentMenu = _.closest(el, 'ul');
    _.addClass(parentMenu, 'move-out');
    _.removeClass(parentMenu, 'menu-active');
  }

  function _showParentMenu(el) {
    el.querySelector('a').focus();
    _.removeClass(el, 'move-out');
    _.addClass(el, 'menu-active');
  }

  function _moveOutSubMenu(el) {
    _.addClass(el, 'menu-hidden');
    _.removeClass(el, 'menu-active');
  }

  function _showSubMenu(el) {
    el.querySelector('a').focus();
    _.addClass(el, 'menu-active');
    _.removeClass(el, 'menu-hidden');
  }

  function _openSubMenu(e) {
    if ( _.hasClass(e.target.parentNode, 'has-children') ) {
      var submenu = e.target.parentNode.querySelector('ul');
      if ( !_.isDom(submenu) ) return;
      _moveOutParentMenu(e.target);
      _showSubMenu(submenu);
      _updateMenuAnchors();
    }
  }

  function _closeSubMenuHandler(e) {
    if ( _.hasClass(e.target, 'menu-back') ) {
      e.preventDefault();
      _closeSubMenu(e.target);
    }
  }

  function _closeSubMenu(el) {
    var nearestUl = _.closest(el, 'ul');
    var parentMenu = _.closest(nearestUl, 'ul.move-out');
    _moveOutSubMenu(nearestUl);
    _showParentMenu(parentMenu);
    _updateMenuAnchors();
  }

  // Should be called when you hit the close or toggle button
  function _closeAllSubMenus() {
    _.each(options.menu.querySelectorAll('.sub-menu'), _closeSubMenu);
  }

  function _keyHandler(e) {
    if ( options.active && e.keyCode === 27 ) hide();
  }

  function _toggleMenu(e) {
    if ( _.hasClass(e.target, options.toggleClass) ) toggle();
  }

  function toggle() {
    options.active ? hide() : show(); //jshint ignore:line
  }

  function show() {
    options.active = true;
    var content = options.menu.querySelector('.fws-menu-content');
    _.addClass(options.menu, options.activeClass);
    _.addClass(content, 'menu-active');
    _updateMenuAnchors();
  }

  function hide() {
    options.active = false;
    var content = options.menu.querySelector('.fws-menu-content');
    _.removeClass(options.menu, options.activeClass);
    _.removeClass(content, 'menu-active');
    _closeAllSubMenus();
  }

  function _checkForValidPosition() {
    var validPositions = ['left', 'right'];
    if (validPositions.indexOf(options.position) >= 0)
      _.addClass(options.menu, 'menu-' + options.position);
    else
      throw new Error('Invalid position.  Must be one of: ' + vaildPositions.join(', '));
  }

  module.exports.init    = init;
  module.exports.toggle  = toggle;
  module.exports.show    = show;
  module.exports.hide    = hide;
  module.exports.destroy = destroy;
})();
