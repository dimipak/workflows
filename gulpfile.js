var gulp = require('gulp'),
	gutil = require('gulp-util');


//This command creates a task!! we name it log(log is a random name we gave) and with gutil.log we print a string
gulp.task('log', function() {
	gutil.log('Workflows are awesome');
});