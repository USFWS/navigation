/*jshint expr: true*/
(function () {
  'use strict';

  var expect = require('chai').expect;

  var menu = require('../src/js/menu');
  var _ = require('../src/js/util');

  describe('The navigation menu', function () {
    var nav, trigger;

    beforeEach( function () {
      document.body.innerHTML = __html__['test/fixtures/menu.html'];
      nav = document.querySelector('.fws-menu');
      trigger = document.querySelector('.menu-toggle');
    });

    afterEach( function () {
      menu.destroy();
    });

    describe('active state', function () {

      beforeEach( function () {
        menu.init({
          activeClass: 'active'
        });
      });

      it('should be inactive to start', function () {
        expect(_.hasClass(nav, 'active')).to.be.false;
      });

      it('should activate when you click the menu trigger', function () {
        trigger.click();
        expect(_.hasClass(nav, 'active')).to.be.true;
      });

      it('should deactivate when you click the close button', function () {
        trigger.click();
        expect(_.hasClass(nav, 'active')).to.be.true;
        document.querySelector('.fws-menu-close').click();
        expect(_.hasClass(nav, 'active')).to.be.false;
      });

    });

    describe('toggle sub menu link', function () {
      var subMenu, parentMenu, firstSubMenuLink, backLink, backBlock;

      beforeEach( function () {
        menu.init({});
        subMenu = document.querySelector('.sub-menu');
        firstSubMenuLink = document.querySelector('.has-children').firstChild;
        backLink = subMenu.querySelector('.menu-back');
        backBlock = subMenu.querySelector('.back-block');
        parentMenu = _.closest(firstSubMenuLink, 'ul');
      });

      it('should activate submenu when clicked', function () {
        firstSubMenuLink.click();
        expect(_.hasClass(subMenu, 'menu-active')).to.be.true;
      });

      it('should hide parent menu when clicked', function () {
        firstSubMenuLink.click();
        expect(_.hasClass(parentMenu, 'move-out')).to.be.true;
      });

      it('should show parent menu when the \'back link\' is clicked', function () {
        firstSubMenuLink.click();
        backLink.click();
        expect(_.hasClass(parentMenu, 'move-out')).to.be.false;
      });

      it('should show parent menu when the \'back block\' is clicked', function () {
        firstSubMenuLink.click();
        backLink.click();
        expect(_.hasClass(parentMenu, 'move-out')).to.be.false;
      });

    });

    describe('tab index', function () {
      var subMenu, parentMenu, firstSubMenuLink, childMenu;

      beforeEach( function () {
        menu.init({});
        firstSubMenuLink = document.querySelector('.has-children').firstChild;
        firstSubMenuLink.click();
        subMenu = document.querySelector('.sub-menu');
        parentMenu = _.closest(firstSubMenuLink, 'ul');
        childMenu = subMenu.querySelector('.sub-menu');
      });

      it('should give all anchors in the currently active menu a tab index of 0', function () {
        var lis = document.querySelector('.menu-active').children;
        _.each(lis, function (li) {
          if ( li.firstChild.nodeName === 'A') { // Ignore the back block
            var link = li.firstChild;
            expect( link.getAttribute('tabindex') ).to.equal('0');
          }
        });
      });

      it('should give parent menu\'s anchor links a tab index of -1', function () {
        var parentLis = parentMenu.children;
        _.each(parentLis, function (li) {
          var link = li.firstChild;
          expect( link.getAttribute('tabindex') ).to.equal('-1');
        });
      });

      it('should give all child menu\'s anchor links a tab index of -1', function () {
        var links = childMenu.querySelectorAll('a');
        _.each(links, function (link) {
          expect( link.getAttribute('tabindex') ).to.equal('-1');
        });

      });
    });

    xdescribe('keyboard interaction', function () {
      var nav, input;
      // left: 37
      // up: 38
      // right: 39
      // down: 40

      beforeEach( function () {
        input = _.create('input', document.body);
        menu.init({
          active: true,
          activeClass: 'active'
        });
        nav = document.querySelector('.fws-menu');
      });

      afterEach( function () {
        _.remove(input);
      });

      it('should close the currently open menu when the user pushes the left key', function () {
        expect( _.hasClass(nav, 'active') ).to.be.true;
        // Simulate keypress...
        expect( _.hasClass(nav, 'active') ).to.be.false;

        // console.log(leftArrow);
      });

      it('should open a submenu if currently focused on an element containing a sub menu', function () {

      });
      // Down arrow moves to the next item in the tab index
      // Up arrow moves to the last item in the tab index
      // Escape should close the menu
      // Right arrow on an item that has submenu should activate submenu
      // Left arrow should close the current menu
        // If it's the top level menu it should close the whole thing
        // If it's a submenu you should move up one level
    });
  });

})();
