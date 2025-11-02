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
    src: 'app/scss/style.scss',
    all: 'app/scss/**/*.scss'
  },
  app: {
    css: 'app/css',
    js:  'app/js',
    html: 'app/*.html',
    img: 'app/img/**/*'
  },
  dist: {
    base: 'dist',
    css: 'dist/css',
    js:  'dist/js',
    img: 'dist/img'
  }
};

// -------------------------
// Очищення dist
// -------------------------
function clean() {
  return deleteAsync(['dist/**']);
}

// -------------------------
// Копіювання Bootstrap CSS
// -------------------------
function copyBootstrapCss() {
  return src(paths.bootstrap.css)
    .pipe(dest(paths.app.css))
    .pipe(dest(paths.dist.css));
}

// -------------------------
// Копіювання Bootstrap JS
// -------------------------
function copyBootstrapJs() {
  return src(paths.bootstrap.js)
    .pipe(dest(paths.app.js))
    .pipe(dest(paths.dist.js));
}

// -------------------------
// Копіювання зображень
// -------------------------
function copyImages() {
  return src(paths.app.img)
    .pipe(dest(paths.dist.img));
}

// -------------------------
// Копіювання HTML
// -------------------------
function copyHtml() {
  return src(paths.app.html)
    .pipe(dest(paths.dist.base));
}

// -------------------------
// Компіляція SCSS -> CSS
// -------------------------
function compileScss() {
  return src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCss())
    .pipe(rename({ 
      basename: 'style', 
      suffix: '.min' 
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.app.css))
    .pipe(dest(paths.dist.css))
    .pipe(browsersync.stream());
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
    open: false
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
// Build / Dev
// -------------------------
const build = series(
  clean,
  parallel(copyBootstrapCss, copyBootstrapJs, copyHtml, copyImages),
  compileScss
);

const dev = series(
  build,
  browserSyncInit,
  watchFiles
);

// Експорти
exports.clean = clean;
exports.build = build;
exports.default = dev;
exports.dev = dev;