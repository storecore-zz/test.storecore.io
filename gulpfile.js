/* @flow */

/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var shell = require('gulp-shell');
var merge = require('merge-stream');
var concat = require('gulp-concat')
var env = require('./env.json');
var inject = require('gulp-inject-string');
var fs = require('fs');
var cleanCSS = require('gulp-clean-css');

gulp.task('sass:dev', function() {
    var sassStream = gulp.src('./themes/storecore/static/scss/style.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({cascade: false}));

    var cssStream = gulp.src('./themes/storecore/static/css/vendor/*.css')
        .pipe(concat('css-files.css'));

    var mergedStream = merge(sassStream, cssStream)
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./themes/storecore/static/css'));
    return mergedStream;
});


var jsLibsBase = './themes/storecore/static/js/libs/';

gulp.task('js', function() {
    gulp.src([jsLibsBase + 'jquery-3.1.0.min.js', jsLibsBase + 'lunrjs.min.js', jsLibsBase + 'highlight.pack.js', jsLibsBase + 'debounce.min.js', jsLibsBase + 'clipboard.min.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./themes/storecore/static/js/'));
});


var developmentBase = '\n<script type="text/javascript">';
developmentBase +='\ntheBaseUrl = "http://" + location.host + "/";';
developmentBase +='\ndocument.write(\'<base href="\' + theBaseUrl + \'"/>\');';
developmentBase +='\n</script>';

var prodUrl = env.prod.baseUrl;

var productionBase = '\n<script type="text/javascript">';
productionBase +='\ntheBaseUrl = "'+ prodUrl + '";';
productionBase +='\n</script>';

gulp.task('minify-css', function() {
    return gulp.src('public/css/*.css')
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log('original size: ' + details.name + ': ' + details.stats.originalSize + ' bytes');
            console.log('minified size: ' + details.name + ': ' + details.stats.minifiedSize + ' bytes');
        }))
        .pipe(gulp.dest('./public'));
});

gulp.task('set-base:development', [], function() {
    fs.writeFileSync('./themes/storecore/layouts/partials/base-url.html', developmentBase);
});

gulp.task('set-base:production', [], function() {
    fs.writeFileSync('./themes/storecore/layouts/partials/base-url.html', '\n'+productionBase+'\n<base href="'+ prodUrl + '" />');
});

gulp.task('build-search-index', shell.task(['node ./buildSearchIndex.js']));
gulp.task('hugo', ['build-search-index'], shell.task(['hugo -v --forceSyncStatic --cleanDestinationDir']));

gulp.task('build:prod', ['hugo', 'set-base:production', 'js', 'minify-css']);
gulp.task('build:dev', ['hugo', 'set-base:development', 'js']);
