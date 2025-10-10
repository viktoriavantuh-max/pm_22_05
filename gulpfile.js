const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

// Таск для копіювання Bootstrap CSS
gulp.task('copy-bootstrap-css', function() {
  return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('app/scss'));
});

// Таск для копіювання Bootstrap JS
gulp.task('copy-bootstrap-js', function() {
  return gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
    .pipe(gulp.dest('app/js'));
});

gulp.task('styles', function() {
  return gulp.src('app/scss/style.scss') // звідки брати SCSS
    .pipe(sass().on('error', sass.logError)) // компіляція
    .pipe(cleanCSS()) // мініфікація
    .pipe(rename({ suffix: '.min' })) // додає .min у назву
    .pipe(gulp.dest('dist/css')); // куди зберегти
});

// Основний таск зборки
gulp.task('build', gulp.series('copy-bootstrap-css', 'copy-bootstrap-js'));

// Таск за замовчуванням
gulp.task('default', gulp.series('build'));