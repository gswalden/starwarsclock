'use strict';

const gulp      = require('gulp')
  , browserSync = require('browser-sync').create()
  , reload      = browserSync.reload
  , less        = require('gulp-less')
  , minifyCSS   = require('gulp-cssnano')
  , autoprefixer = require('gulp-autoprefixer')
  , plumber     = require('gulp-plumber')
  , notify      = require('gulp-notify')
  , jade        = require('gulp-jade')
  , uglify      = require('gulp-uglify')
  , sourcemaps  = require('gulp-sourcemaps')
  , ghPages     = require('gulp-gh-pages')
  , countdown   = require('countdown')
  , dist        = './dist'
  ;

// browser-sync task for starting the server.
gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: dist
    }
  });
});

gulp.task('less', () => {
  return gulp.src('less/*.less')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: ['./bower_components']
    }))
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream())
    .pipe(notify('Finished file: <%= file.relative %>'));
});

gulp.task('js', () => {
  return gulp.src([/*'./bower_components/countdownjs/countdown.js',*/ 'js/*.js'])
    .pipe(plumber())
    // .pipe(jshint())
    // .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
    // .pipe(babel())
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream())
    .pipe(notify('Finished file: <%= file.relative %>'));
});

gulp.task('jade', () => {
  return gulp.src('jade/index.jade')
    .pipe(plumber())
    .pipe(jade({
      locals: { description: timeString() }
    }))
    .pipe(gulp.dest(dist))
    .pipe(notify('Finished file: <%= file.relative %>'));
});

// Default task to be run with `gulp`
gulp.task('default', ['jade', 'less', 'js', 'browser-sync'], () => {
  gulp.watch('less/*.less', ['less']);
  gulp.watch('jade/*.jade', ['jade']);
  gulp.watch('js/*.js', ['js']);
  gulp.watch('./dist/*.html').on('change', reload);
});

gulp.task('deploy', ['jade', 'less', 'js'], () => {
  return gulp.src(['./dist/**/*', './static/**/*'])
    .pipe(ghPages({
      remoteURL: process.env.REMOTE_URL
    }));
});

function timeString() {
  const time = countdown(new Date(2016, 11, 16));
  const str = [];
  if (time.years) str.push(time.years + ' year' + (time.years > 1 ? 's' : ''));
  if (time.months) str.push(time.months + ' month' + (time.months > 1 ? 's' : ''));
  if (time.days) str.push(time.days + ' day' + (time.days > 1 ? 's' : ''));
  return str.join(', ') + ' until Rogue One!';
}
