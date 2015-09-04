// Dependencies
var concat         = require('gulp-concat'),
    del            = require('del'),
    flatten        = require('gulp-flatten'),
    gulp           = require('gulp'),
    mainBowerFiles = require('main-bower-files'),
    minifyCss      = require('gulp-minify-css'),
    runSequence    = require('run-sequence'),
    sass           = require('gulp-sass'),
    templateCache  = require('gulp-angular-templatecache'),
    uglify         = require('gulp-uglify');

// Paths
var paths = {
    build        : 'build',
    dist         : 'dist',
    html         : ['frontend/javascript/**/*.html'],
    index        : ['index.html'],
    scripts      : ['frontend/javascript/**/*.js'],
    styles       : ['frontend/sass/**/*.scss'],
    vendorStyles : ['bower_components/materialize/sass']
};

/**
 * Concat scripts and move to dist dir.
 */
gulp.task('scripts', function() {
    return gulp
        .src(paths.scripts)
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(paths.build + '/js'));
});

/**
 * Concat vendor scripts and move to build dir.
 */
gulp.task('vendor-scripts', function() {
    return gulp
        .src(mainBowerFiles('**/*.js'), { base: 'bower_components' })
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.build + '/js'));
});

/**
 * Concat vendor css and move to build dir.
 */
gulp.task('vendor-styles', function() {
    return gulp
        .src(mainBowerFiles('**/*.css'), { base: 'bower_components' })
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(paths.build + '/css'));
});

/**
 * Compile + concat css and move to build dir.
 */
gulp.task('styles', function() {
    return gulp
        .src(paths.styles)
        .pipe(sass({
            style: 'compressed',
            includePaths: paths.vendorStyles
        }))
        .pipe(gulp.dest(paths.build + '/css'));
});

/**
 * Copy fonts
 */
gulp.task('fonts', function () {
    return gulp.src(mainBowerFiles('**/*.{eot,svg,ttf,woff,woff2}'), { base: 'bower_components' })
        .pipe(flatten())
        .pipe(gulp.dest(paths.build + '/fonts'));
});

/**
 * Move index file to the build dir.
 */
gulp.task('index', function() {
    return gulp
        .src(paths.index[0])
        .pipe(gulp.dest(paths.build));
});

gulp.task('html', function() {
    return gulp
        .src(paths.html)
        .pipe(templateCache('templates.js', {
            standalone: true,
            module: 'sync-ammo.templates'
        }))
        .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('clean', function(done) {
    return del([paths.build], done);
});

/**
 * Build entire app.
 */
gulp.task('build', function(done) {
    runSequence(
        'clean',
        ['vendor-scripts', 'vendor-styles', 'scripts', 'fonts', 'styles', 'index', 'html'],
        done
    );
});

/**
 * Uglify JS
 */
gulp.task('uglify', function() {
    return gulp
        .src(paths.build + '/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist));
});

/**
 * Minify CSS
 */
gulp.task('minifyCss', function() {
    return gulp
        .src(paths.build + '/**/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest(paths.dist));
});

/**
 * File watcher.
 */
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.styles, ['styles']);
});

/**
 * Default task.
 */
gulp.task('default', ['watch', 'build']);
