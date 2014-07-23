// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    header = require('gulp-header'),
    pkg = require('./package.json'),
    SRC = './src/events.js',
    DEST = './src';

var headerComment = '// MIT licensed, Written by Abdul Khan and Alexey Novak, 2014\n' +
                    '// version ' + pkg.version + '\n';

gulp.task('jshint', function() {
  gulp.src(SRC)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  gulp.src([SRC])
    .pipe(rename('events.' + pkg.version + '.min.js'))
    .pipe(uglify())
    .pipe(header(headerComment))
    .pipe(gulp.dest(DEST));
});

// Default Task
gulp.task('default', ['jshint', 'scripts']);