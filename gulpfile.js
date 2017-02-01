var gulp        = require('gulp');

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('js/*js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', function (done) {
    done();
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', function () {

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch(["*.js", "views/*.pug"], ['js-watch']);
});