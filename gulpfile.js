var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass');


//This command creates a task!! we name it log(log is a random name we gave) and with gutil.log we print a string
	// gulp.task('log', function() {
	// 	gutil.log('Workflows are awesome');
	// });

// Here i create a new task, which i name it coffee, in this task i execute and unnamed function
// which finds the source with the coffee file and then we send it (our 1st .pipe)
// to the coffee plugin. Here we specify an option (bare:true) from the coffee script documentation
// After that we execute an .on method 
// .on method finds errors and log it on cmd with the gutil.log
// lastly we .pipe the results of coffee command so we specify our destination
// with gulp.dest()
var coffeeSources = ['components/coffee/tagline.coffee']; //-->Or ['components/coffee/*.coffee'] for all the .coffee files

gulp.task('coffee', function() {
	gulp.src(coffeeSources)
		.pipe(coffee({ bare:true })
		.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'))
});

//The order counts on which will be processed first
var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('script.js'))	//script.js this is the name of the file that will be created
		.pipe(browserify())
		.pipe(gulp.dest('builds/development/js'))
});

//we put only this sass file because in there we import all the other sass files
var sassSources = ['components/sass/style.scss'];

gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			image: 'builds/development/images',
			style: 'expanded'
		})
		.on('error', gutil.log))
		.pipe(gulp.dest('builds/development/css'))
});