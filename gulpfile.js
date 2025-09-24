const { src, dest, watch, series, parallel } = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

// 📦 HTML task - об'єднання фрагментів
function html() {
    return src('app/*.html')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('dist/'))
        .pipe(browserSync.stream());
}

// 🎨 SCSS task - компіляція та мініфікація
function scss() {
    return src('app/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('dist/css/'))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/css/'))
        .pipe(browserSync.stream());
}

// ⚡ JavaScript task - об'єднання та мініфікація
function js() {
    return src('app/js/*.js')
        .pipe(concat('script.js'))
        .pipe(dest('dist/js/'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/js/'))
        .pipe(browserSync.stream());
}

// 🖼️ Images task - оптимізація зображень
function images() {
    return src('app/img/*')
        .pipe(imagemin())
        .pipe(dest('dist/img/'))
        .pipe(browserSync.stream());
}

// 🔄 Server task - автоматичне перезавантаження
function server() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        },
        notify: false
    });

    // Відслідковуємо зміни у файлах
    watch('app/**/*.html', html);
    watch('app/scss/**/*.scss', scss);
    watch('app/js/**/*.js', js);
    watch('app/img/*', images);
}

// 📋 Основні таски для експорту
exports.html = html;
exports.scss = scss;
exports.js = js;
exports.images = images;
exports.server = server;

// 🚀 Default task - збірка проекту
exports.default = series(html, scss, js, images);

// 💻 Dev task - розробка з сервером
exports.dev = series(html, scss, js, images, server);