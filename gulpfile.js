const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();

function html_task() {
  return src("app/html/*.html")      // ✅ бере всі html з папки app/html
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

// SCSS -> CSS
function scss_task() {
  return src("app/scss/*.scss")      // всі SCSS файли
    .pipe(sass().on("error", sass.logError))
    .pipe(cssnano())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

// JS
function js_task() {
  return src("app/js/*.js")
    .pipe(concat("script.js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());
}

// Images
function img_task() {
  return src("app/img/**/*")
    .pipe(imagemin())
    .pipe(dest("dist/img"))
    .pipe(browserSync.stream());
}

// Сервер + спостереження
function serve() {
  browserSync.init({
    server: {
      baseDir: "dist"
    },
    port: 3000
  });

  watch("app/index.html", html_task);
  watch("app/scss/**/*.scss", scss_task);
  watch("app/js/**/*.js", js_task);
  watch("app/img/**/*", img_task);
}

// Будівля
const build = parallel(html_task, scss_task, js_task, img_task);

exports.build = build;
exports.default = series(build, serve);
