var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect');


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
		.pipe(connect.reload()) //here we pipe also the reload method from connect module, so it reloads the page every time we make a change
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
		.pipe(connect.reload())	//here we pipe also the reload method from connect module, so it reloads the page every time we make a change
});

//This is the watch command. When we give a task a name of watch
//and execute watch in the cmd then the cmd is working constantly
//watching the tasks
//So in the function we tell it to watch if there are any changes
//on any variable(which the variables are connected to the file)
//and if that happens execute the task we gave to the specific variable
gulp.task('watch', function() {
	gulp.watch(coffeeSources,['coffee']);
	gulp.watch(jsSources,['js']);
	gulp.watch('components/sass/*.scss',['compass']);
});

//Here we can use the second parameter of tasks which telling the system
//to execute the other tasks before doing the main task
//allthough here we dont have anything for this task to be execute
//because we dont have an unnamed function, so we execute all the tasks
//together
//With the name 'default' we can execute in cmd gulp without any names after, just ->gulp
gulp.task('default',['coffee','js','compass','connect','watch']);

gulp.task('connect', function() {
	connect.server({
		root:'builds/development/',
		livereload: true
	});
});