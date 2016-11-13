// call require() to obtain a reference to each plugin we need
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');

// Task: default
// create default task that depends on task app-css
// if you run task default it will cause the dependent
// tasks to run first
gulp.task('default', ['app-js', 'app-css']);

// Task: app-css
gulp.task('app-css', ['app-sass'], function (done) {
    return gulp.src([
            './bower_components/bootstrap/dist/css/bootstrap.css',
            './Content/**/*.css'
    ])
      .pipe(cssnano())
      .pipe(concat('all.css').on('error', sass.logError))
      .pipe(gulp.dest('./dist/'));
});

// Task: app-sass
// scan all *.scss files under css folder
// run these files through the sass compiler
// sending all errors to sass.logError
// send output of sass compilation to css folder
gulp.task('app-sass', function (done) {
    return gulp.src('./Content/Site.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./Content'));
});

// Task: app-js
// concatenate jquery, bootstrap, and all js files in ./scripts
// then minify using uglify while preserving license comments
// and create source map file(s) for js debugging
// write result out to ./scripts/all.js and ./scripts/all.js.map
gulp.task('app-js', function () {
    return gulp.src([
            './bower_components/jquery/dist/jquery.js',
            './bower_components/bootstrap/dist/js/bootstrap.js'
    ])
      .pipe(sourcemaps.init())
      .pipe(uglify({ preserveComments: 'license' }))
      .pipe(concat('all.js').on('error', sass.logError))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./dist/'));
});

// Task: css-watch
// watch all *.scss files under css folder
// if any of these files change, run task app-css
gulp.task('css-watch', function () {
    gulp.watch('./Content/**/*.scss', ['app-css']);
});

// Task: js-watch
// watch all *.js files under scripts folder
// if any of these files change, run task app-js
gulp.task('js-watch', function () {
    gulp.watch('./Scripts/**/*.js', ['app-js']);
});
