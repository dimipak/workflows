var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHtml = require('gulp-minify-html');

var env,
	coffeeSources,
	jsSources,
	sassSources,
	htmlSources,
	jsonSources,
	outputDir,
	sassStyle;



//Its an environment variable
//We go ahead and set it to use this process.env that node provides
//and then check to see if we set up a NODE_ENV variable
//this is environment variable and push that value into env variable
//if that value is not set then we can use a default value of development
//That way if we'd set this up in our operating system, then this new variable,
//called env, would get the value of whatever we set, otherwise, it'll asume
//that we're in the development environment
//ON cmd: NODE_ENV=production gulp
env = process.env.NODE_ENV || 'development';


if (env==='development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}


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
coffeeSources = ['components/coffee/tagline.coffee']; //-->Or ['components/coffee/*.coffee'] for all the .coffee files

gulp.task('coffee', function() {
	gulp.src(coffeeSources)
		.pipe(coffee({ bare:true })
		.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'));
});

//The order counts on which will be processed first
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('script.js'))	//script.js this is the name of the file that will be created
		.pipe(browserify())
		.pipe(gulpif(env==='production',uglify()))	//if env = production then minimize our js
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(connect.reload()); //here we pipe also the reload method from connect module, so it reloads the page every time we make a change
});

//we put only this sass file because in there we import all the other sass files
sassSources = ['components/sass/style.scss'];

gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			image: outputDir + 'images',
			style: sassStyle
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe(connect.reload());	//here we pipe also the reload method from connect module, so it reloads the page every time we make a change
});


//here is the connect task, we put 2 attributes to this task
//specify root folder, and turn livereload to true
gulp.task('connect', function() {
	connect.server({
		root:outputDir,
		livereload: true
	});
});

htmlSources = [outputDir + '*.html'];

//Here we creating a simple task just for html files if they changed
//to reload.(no need of modueles or anything, just the file src)
gulp.task('html', function() {
	gulp.src('builds/development/*.html')
		.pipe(gulpif(env==='production',minifyHtml()))
		.pipe(gulpif(env==='production',gulp.dest(outputDir)))
		.pipe(connect.reload());
});

jsonSources = [outputDir + 'js/*.json'];
//Here we creating a simple task just for json files if they changed
//to reload.(no need of modueles or anything, just the file src)
gulp.task('json', function() {
	gulp.src(jsonSources)
		.pipe(connect.reload());
});

//Here we can use the second parameter of tasks which telling the system
//to execute the other tasks before doing the main task
//allthough here we dont have anything for this task to be execute
//because we dont have an unnamed function, so we execute all the tasks
//together
//With the name 'default' we can execute in cmd gulp without any names after, just ->gulp
gulp.task('default',['html','json','coffee','js','compass','connect','watch']);

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
	gulp.watch('builds/development/*.html',['html']);
	gulp.watch(jsonSources,['json']);
});
