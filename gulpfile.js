var gulp = require("gulp"),
	sass = require("gulp-sass"),
	browserSync = require("browser-sync");

gulp.task("sass", function(){
	gulp.src("sass/style.scss")
		.pipe(sass())
		.pipe(gulp.dest("css"))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task("browser-sync", function(){
	browserSync({
		server: {
			baseDir: "C:\\Users\\M-PC\\Projects\\PinkSite"
		}, 
		notify: false
	});
});

gulp.task("watch", ["browser-sync", "sass"], function(){
	gulp.watch("sass/**/*.scss", ["sass"]);
	gulp.watch("*.html", browserSync.reload);
	gulp.watch("js/**/*.js", browserSync.reload);
});