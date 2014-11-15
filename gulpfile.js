var gulp = require('gulp'),
	source = require('vinyl-source-stream'),
	watch = require('gulp-watch'),
	watchify = require('watchify'),
	browserify = require('browserify'),
	livereload = require('gulp-livereload'),
	autoprefix = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	hbsfy = require("hbsfy").configure({
		extensions: ["html"]
	});

gulp.task('scripts', function() {
	var bundler = watchify(browserify('./public/js/app.js', watchify.args));
	bundler.transform(hbsfy);
	bundler.on('update', rebundle);
	function rebundle() {
		return bundler.bundle()
			.pipe(source('bundle.js'))
			.pipe(gulp.dest('./public/js/'))
			.pipe(livereload());
	}
	return rebundle();
});

gulp.task('styles', function() {
	gulp.src(['./public/css/main.css'])
		.pipe(autoprefix({
			browsers: ['last 3 versions']
		}))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./public/dist/css/'))
});

gulp.task('uglify', function() {
	gulp.src('./public/js/bundle.js')
		.pipe(uglify())
		.pipe(gulp.dest('./public/dist/js/'))
});

gulp.task('default', ['scripts', 'uglify', 'styles'], function() {
	gulp.watch('./public/css/main.css', ['styles']);
	gulp.watch('./public/js/bundle.js', ['uglify']);
});
