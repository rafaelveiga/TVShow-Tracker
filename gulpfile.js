//Production Packages
var gulp = require('gulp'),
	connect = require('gulp-connect');

//Build Packages
var	uglify = require('gulp-uglify'),
	nano = require('gulp-cssnano'),
	htmlmin = require('gulp-htmlmin'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant');

	
// =========================
// Server
// =========================
gulp.task('connect', function() {
	connect.server({
		livereload: true
	});
});

gulp.task('reload', function () {
	gulp.src('./src/*')
	  .pipe(connect.reload());
});

gulp.task('watch', function () {
	gulp.watch(['./src/*', './src/css/*', './src/js/*'], ['reload']);
});

gulp.task('server', ['connect', 'watch']);

// =========================
// Build
// =========================
gulp.task('build-js', function() {
	gulp.src('./src/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./build/js'));
});

gulp.task('build-css', function() {
	gulp.src('./src/css/style.css')
		.pipe(nano())
		.pipe(gulp.dest('./build/css/'));

	gulp.src("./src/css/bootstrap-theme.css")
		.pipe(gulp.dest("./build/css/"));
});

gulp.task('build-html', function() {
	gulp.src("./src/*.html")
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest("./build/"));
});

gulp.task('build-images', function() {
    gulp.src('src/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/img'));
});


gulp.task('build', ['build-js', 'build-css', 'build-html', 'build-images']);