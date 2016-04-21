var gulp = require('gulp');
require('./gulpfile');

function deploy() {
  if (gulp.tasks.deploy) {
    gulp.start('deploy');
  }
}

setInterval(deploy, 86400000);
deploy();
