var ms = require('ms');
var gulp = require('gulp');
require('./gulpfile');

function deploy() {
  if (gulp.tasks.deploy) {
    gulp.start('deploy');
  }
}

setInterval(deploy, ms('1day'));
deploy();
