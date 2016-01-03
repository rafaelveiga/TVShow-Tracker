var gulp = require('gulp'),
	connect = require('gulp-connect');

	
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