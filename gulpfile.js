var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('js', function() {
    return gulp.src(['server.js', 'public/app/*.js', 'public/app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
