'use strict';

const gulp      = require('gulp')
  , browserSync = require('browser-sync').create()
  , reload      = browserSync.reload
  , less        = require('gulp-less')
  , minifyCSS   = require('gulp-minify-css')
  , autoprefixer = require('gulp-autoprefixer')
  , plumber     = require('gulp-plumber')
  , notify      = require('gulp-notify')
  , jade        = require('gulp-jade')
  , uglify      = require('gulp-uglify')
  , sourcemaps  = require('gulp-sourcemaps')
  , ghPages     = require('gulp-gh-pages')
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
    .pipe(jade())
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
    .pipe(ghPages({ push: false }));
});
