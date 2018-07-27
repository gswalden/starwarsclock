'use strict';

const gulp      = require('gulp')
  , browserSync = require('browser-sync').create()
  , reload      = browserSync.reload
  , moment      = require('moment')
  , less        = require('gulp-less')
  , autoprefixer = require('gulp-autoprefixer')
  , plumber     = require('gulp-plumber')
  , notify      = require('gulp-notify')
  , pug         = require('gulp-pug')
  , inline      = require('gulp-inline-source')
  , ghPages     = require('gh-pages')
  , countdown   = require('countdown')
  , del         = require('del')
  , dist        = './dist'
  , episodeName = 'Star Wars: Episode IX'
  , nextReleaseArr = require('./nextRelease.json')
  , nextRelease = new Date(...nextReleaseArr)
  ;

// browser-sync task for starting the server.
gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: [dist, './static']
    }
  });
});

gulp.task('less', () => {
  return gulp.src('less/*.less')
    .pipe(plumber())
    .pipe(less({
      paths: ['./node_modules']
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(dist))
    .pipe(notify('Finished file: <%= file.relative %>'));
});

gulp.task('js', () => {
  return gulp.src(['js/*.js'])
    .pipe(plumber())
    .pipe(gulp.dest(dist))
    .pipe(notify('Finished file: <%= file.relative %>'));
});

gulp.task('pug', ['js', 'less'], () => {
  return gulp.src('pug/index.pug')
    .pipe(plumber())
    .pipe(pug({
      locals: {
        description: timeString(),
        episodeName,
        nextRelease,
        dateString: moment(nextRelease).format('MMMM D, YYYY')
      }
    }))
    .pipe(inline())
    .pipe(gulp.dest(dist))
    .pipe(notify('Finished file: <%= file.relative %>'));
});

gulp.task('static', () => {
  return gulp.src('static/**/*')
    .pipe(gulp.dest(dist))
});

gulp.task('clean', () => {
  del.sync('./dist')
});

// Default task to be run with `gulp`
gulp.task('default', ['pug', 'less', 'js', 'browser-sync'], () => {
  gulp.watch(['pug/*.pug', 'less/*.less', 'js/*.js'], ['pug']);
  gulp.watch('./dist/*.html').on('change', reload);
});

gulp.task('deploy', ['clean', 'pug', 'less', 'js', 'static'], cb => {
  const opt = {
    message: `Update ${new Date().toISOString()} [skip ci]`
  };
  if (process.env.REMOTE_URL) {
    opt.repo = process.env.REMOTE_URL;
  }
  ghPages.publish('./dist', opt, cb);
});

function timeString() {
  const time = countdown(nextRelease);
  const str = [];
  if (time.years) str.push(time.years + ' year' + (time.years > 1 ? 's' : ''));
  if (time.months) str.push(time.months + ' month' + (time.months > 1 ? 's' : ''));
  if (time.days) str.push(time.days + ' day' + (time.days > 1 ? 's' : ''));
  return str.join(', ') + ` until ${episodeName}!`;
}
