(function () {
  'use strict';

  var mkdirp = require('mkdirp');

  var directories = ['dist', 'example/js'];

  directories.forEach(function (path) {
    mkdirp(path, function (err) {
      if (err) console.error(err);
    });
  });
})();
