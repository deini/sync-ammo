// Dependencies
var concat         = require('gulp-concat'),
    del            = require('del'),
    gulp           = require('gulp'),
    mainBowerFiles = require('main-bower-files'),
    minifyCss      = require('gulp-minify-css'),
    runSequence    = require('run-sequence'),
    sass           = require('gulp-sass'),
    templateCache  = require('gulp-angular-templatecache'),
    uglify         = require('gulp-uglify');

// Paths
var paths = {
    build  : 'build',
    dist   : 'dist',
    html   : ['frontend/javascript/**/*.html'],
    index  : ['frontend/index.html'],
    scripts: ['frontend/javascript/**/*.js'],
    styles : ['frontend/sass/**/*.scss']
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
        .pipe(sass())
        .pipe(gulp.dest(paths.build + '/css'));
});

/**
 * Move index file to the build dir.
 */
gulp.task('index', function() {
    return gulp
        .src(paths.index[0])
        .pipe(gulp.dest(paths.build));
});

gulp.task('cname', function() {
    return gulp
        .src(paths.index[1])
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
        ['vendor-scripts', 'vendor-styles', 'scripts', 'styles', 'index', 'html'],
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
 * Copy root files
 */
gulp.task('rootFiles', function() {
    return gulp
        .src(paths.build + '/**/*')
        .pipe(gulp.dest(paths.dist));
});

/**
 * Release
 */
gulp.task('release', function(done) {
    runSequence(
        'build',
        ['uglify', 'minifyCss', 'rootFiles'],
        done
    );
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
