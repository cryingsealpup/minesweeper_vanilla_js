var {
    src,
    dest,
    watch,
    parallel,
    task,
    series
} = require("gulp"),
    sass = require('gulp-sass')(require('sass')),
    sync = require('browser-sync'),
    reload = sync.reload,
    notify = require('gulp-notify'),
    paths = {
        html: ['index.html'],
        css: ['./assets/sass/*.sass'],
        script: ['./assets/js/script.js']
    };


function html() {
    return src(paths.html)
        .pipe(reload({
            stream: true
        }));
};

// CSS
function css() {
    return src(paths.css)
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./assets/css/'))
};

// JavaScript
function script() {
    return src(paths.script)
        .pipe(reload({
            stream: true
        }));
};

function browserSync() {
	sync.init({
		/* server: { baseDir: baseDir + '/' }, */
		server: {
        	directory: true
		},
		notify: false,
		online: true,
        port: 5000
	})

};

function watcher() {
    watch(paths.css, parallel(css));
    watch(paths.script, parallel(script));
    watch(paths.html, parallel(html));
};

//task('watcher')
exports.default     = parallel(watcher, browserSync);