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
    activeClass: 'fws-menu-active',
    rootUlClass: 'fws-menu-content'
  };

  function init(opts) {
    options = _.defaults({}, opts, defaults);
    options.menu = _.find(options.menu);
    options.search = options.menu.querySelector('input[type=search]');
    if (options.active) _.addClass(options.menu, options.activeClass);
    options.close = _.create('button', 'fws-menu-close', options.menu);
    options.close.innerHTML = '&times;';
    options.menu.setAttribute('role', 'navigation');
    _.addClass(options.menu.querySelector('ul'), options.rootUlClass);
    _checkForValidPosition();
    _processSubMenus();
    _registerHandlers();
  }

  function _registerHandlers() {
    document.body.addEventListener('click', _toggleMenu);
    document.body.addEventListener('keyup', _keyHandler);
    options.menu.addEventListener('click', _openSubMenuHandler);
    options.menu.addEventListener('click', _closeSubMenuHandler);
    options.close.addEventListener('click', hide);
  }

  function destroy() {
    document.body.removeEventListener('click', _toggleMenu);
    document.body.removeEventListener('keyup', _keyHandler);
    options.menu.removeEventListener('click', _openSubMenuHandler);
    options.menu.removeEventListener('click', _closeSubMenuHandler);
    options.close.removeEventListener('click', hide);
  }

  function _processSubMenus() {
    var menu = options.menu.querySelector('ul');
    var submenus = menu.querySelectorAll('ul');
    _.each(submenus, function (submenu) {
      var parentLi = _.closest('li', submenu);
      _.addClass(parentLi, 'has-children');
      _.removeClass(submenu, 'move-out');
      _.addClass(submenu, options.subMenuClass + ' menu-hidden');
      _addBackListItem(submenu);
    });
  }

  // Back block is a list item that overlaps the sliver of the visible parent menu
  function _createBackBlock() {
    var backBlock = _.create('li', 'menu-back back-block');
    backBlock.innerHTML = 'Back';
    return backBlock;
  }

  // Creates a list item to appear at the top of each submenu
  function _createBackListItem() {
    var li = _.create('li');
    var btn = _.create('button', 'menu-back', li);
    btn.innerHTML = 'Back';
    return li;
  }

  // Insert a list item at the top and bottom of each sub menu to go back to the parent menu
  function _addBackListItem(submenu) {
    var firstLi = submenu.querySelector('li');
    var li = _createBackListItem();
    var backBlock = _createBackBlock();
    submenu.insertBefore(li, firstLi);
    submenu.appendChild(backBlock);
  }

  // Disable all anchors with tabindex = -1, then re-enable only the current menu's anchors
  function _updateMenuAnchors() {
    var activeMenu = options.menu.querySelector('.menu-active');
    _disableAllMenuAchors();
    if (activeMenu) _enableActiveMenuAnchors(activeMenu);
  }

  // Elements with tabindex = -1 are skipped when tabbing through focusable elements
  function _disableAllMenuAchors() {
    var allAnchors = options.menu.querySelectorAll('a, button.menu-back');
    _.each(allAnchors, function (link) {
      link.setAttribute('tabindex', -1);
    });
  }

  // Elements with tabindex = 0 will be tabbed through in the order that they appear in the markup
  function _enableActiveMenuAnchors(menu) {
    var anchors = _findActiveMenuAnchors(menu);
    _.each(anchors, function(anchor) {
      anchor.setAttribute('tabindex', 0);
    });
  }

  // Returns a list of the anchors in the currently active menu
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

  // Move the parent menu out of view
  function _moveOutParentMenu(menu) {
    _.addClass(menu, 'move-out');
    _.removeClass(menu, 'menu-active');
  }

  // Bring the parent menu back into view
  function _showParentMenu(el) {
    _.removeClass(el, 'move-out');
    _.addClass(el, 'menu-active');
    el.querySelector('a').focus();
  }

  // Move the submenu out of view
  function _moveOutSubMenu(el) {
    _.addClass(el, 'menu-hidden');
    _.removeClass(el, 'menu-active');
  }

  // Move the submenu into view
  function _showSubMenu(el) {
    _.addClass(el, 'menu-active');
    _.removeClass(el, 'menu-hidden');
    el.querySelector('a').focus();
  }

  function _openSubMenuHandler(e) {
    if ( e.target.nodeName === 'UL' ) return; // Don't toggle submenu if you click on the UL rather than an LI
    if ( !_.hasClass(e.target.parentNode, 'has-children') ) return; // Make sure there IS a submenu
    var submenu = e.target.parentNode.querySelector('ul');
    var parentMenu = _.closest('ul', e.target);
    _openSubMenu(parentMenu, submenu);
  }

  // Open a submenu
  function _openSubMenu(parentMenu, submenu) {
    _moveOutParentMenu(parentMenu);
    _showSubMenu(submenu);
    _updateMenuAnchors();
  }

  function _closeSubMenuHandler(e) {
    if ( _.hasClass(e.target, 'menu-back') ) {
      e.preventDefault();
      var nearestUl = _.closest('ul', e.target);
      _closeSubMenu(nearestUl);
    }
  }

  function _closeSubMenu(menu) {
    var parentMenu = _.closest('ul.move-out', menu);
    if (parentMenu) _showParentMenu(parentMenu);
    _moveOutSubMenu(menu);
    _updateMenuAnchors();
  }

  // Restore the navigation menu back to it's initial state
  function _closeAllSubMenus() {
    _.each(options.menu.querySelectorAll('.sub-menu'), _closeSubMenu);
  }

  // Handle keyboard input
  function _keyHandler(e) {
    if ( options.active ) {
      var parentMenu, subMenu, currentMenu;
      // Close the menu on Escape
      if ( e.keyCode === 27 ) hide();
      // Move down the list of tabbable elements when the user presses the down key
      if ( e.keyCode === 40 ) _goToTabbableElement('next');
      // Move up the list of tabbable elements when the user presses the up key
      if ( e.keyCode === 38 ) _goToTabbableElement('last');
      // Close the currently open submenu when the users presses the left key
      if ( e.keyCode === 37 ) _closeSubMenu(options.menu.querySelector('.menu-active'));
      // Open the submenu if the currently focused element is associated w/a sub menu
      if ( e.keyCode === 39 && _.hasClass(e.target.parentNode, 'has-children') ) {
        parentMenu = _.closest('ul', e.target);
        subMenu = e.target.parentNode.querySelector('ul');
        _openSubMenu(parentMenu, subMenu);
      }
    } else return;
  }

  function _goToTabbableElement(direction) {
    var index, modifier;
    var tabbable = _.tabbable(options.menu);
    if (direction === 'next') modifier = 1;
    else if (direction === 'last') modifier = -1;
    else throw new Error('Direction for _goToTabbableElement must be \'next\' or \'last\'.');

    // If the toggle button is focused right now, focus on the first focusable element in the menu
    if ( _.hasClass(document.activeElement, options.toggleClass) ) {
      tabbable[0].focus();
      return;
    }
    _.each(tabbable, function (el, i) {
      if ( document.activeElement === el ) index = i + modifier;
    });

    if (index === -1) index = 0; // Don't go further than the first element
    else if (index === tabbable.length) index = index -1; // Don't go further than the last element
    tabbable[index].focus();
  }

  function _toggleMenu(e) {
    if ( _.hasClass(e.target, options.toggleClass) ) toggle();
  }

  function toggleSearch() {
    if (!options.active) {
      show();
      setTimeout(function () {
        options.search.focus();
      }, 400);
    }
  }

  function toggle() {
    options.active ? hide() : show(); //jshint ignore:line
  }

  function show() {
    options.active = true;
    var content = options.menu.querySelector('.' + options.rootUlClass);
    _.addClass(options.menu, options.activeClass);
    _.addClass(content, 'menu-active');
    _updateMenuAnchors();
  }

  function hide() {
    options.active = false;
    var content = options.menu.querySelector('.' + options.rootUlClass);
    _.removeClass(options.menu, options.activeClass);
    _.removeClass(content, 'menu-active');
    _closeAllSubMenus();
  }

  // Make sure the menu is instantiated with a valid position
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
  module.exports.toggleSearch = toggleSearch;
})();
