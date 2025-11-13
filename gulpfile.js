const { src, dest, series, parallel, watch } = require('gulp');
const { deleteAsync } = require('del');
const sass = require('gulp-sass')(require('sass'));
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const browsersync = require('browser-sync').create();

// -------------------------
// Шляхи
// -------------------------
const paths = {
  bootstrap: {
    css: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
    js:  'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
  },
  scss: {
    src: 'app/scss/main.scss',
    all: 'app/scss/**/*.scss'
  },
  app: {
    css: 'app/css',
    js:  'app/js',
    html: 'app/*.html',
    img: 'app/img/**/*'
  }
};

// -------------------------
// Компіляція SCSS → CSS
// -------------------------
function compileScss() {
  return src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCss())
    .pipe(rename({ basename: 'main', suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.app.css))
    .pipe(browsersync.stream());
}

// -------------------------
// Копіювання Bootstrap
// -------------------------
function copyBootstrapCss() {
  return src(paths.bootstrap.css)
    .pipe(dest(paths.app.css));
}

function copyBootstrapJs() {
  return src(paths.bootstrap.js)
    .pipe(dest(paths.app.js));
}

// -------------------------
// BrowserSync
// -------------------------
function browserSyncInit(cb) {
  browsersync.init({
    server: {
      baseDir: './app'
    },
    notify: false,
    open: true
  });
  cb();
}

function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// -------------------------
// Watch
// -------------------------
function watchFiles() {
  watch(paths.scss.all, compileScss);
  watch(paths.app.html, browserSyncReload);
  watch('app/js/**/*.js', browserSyncReload);
}

// -------------------------
// Tasks
// -------------------------
const dev = series(
  parallel(copyBootstrapCss, copyBootstrapJs),
  compileScss,
  browserSyncInit,
  watchFiles
);

// Експорти
exports.default = dev;
exports.dev = dev;
