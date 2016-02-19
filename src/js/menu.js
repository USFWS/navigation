(function () {
  'use strict';

  var options;

  var defaults = {
    active: false
  };

  function init(opts) {
    options = _.defaults({}, opts, defaults);
  }

  module.exports.init = init;
})();
