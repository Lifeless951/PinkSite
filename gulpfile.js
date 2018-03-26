var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber"); //Не дает скрипту падать в случае ошибки в коде отслеживаемых файлов.
var browserSync = require("browser-sync");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer"); //PostCss плагин для вендорных префиксов
var mqpacker = require("css-mqpacker"); //PostCss плагин для объединения медиа-запросов
var csso = require("gulp-csso"); //Плагин для минификации css-кода. (как css-nano)
var rename = require("gulp-rename"); //Плагин для переименования фалйа в потоке
var imagemin = require("gulp-imagemin"); //Сжатие изображение
var svgmin = require("gulp-svgmin"); //Плагин для минификации svg-картинок
var svgstore = require("gulp-svgstore"); //Плагин для создания символьного(Каждый svg заключен в тег symbol) svg-спрайта из svg-картинок
var runSq = require("run-sequence"); //Позволяет запускать в галпе задачи последовательно друг за другом
var del = require("del");

gulp.task("sass", function(){
	gulp.src("sass/style.scss")
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss([
			autoprefixer({
				browsers: [
				"last 1 version",
				"last 2 Chrome versions",
				"last 2 Firefox versions",
				"last 2 Opera versions",
				"last 2 Edge versions"
			]}),
			mqpacker({
				sort: true
			})
		]))
		.pipe(gulp.dest("build/css"))
		.pipe(csso())
		.pipe(rename("style.min.css"))
		.pipe(gulp.dest("build/css"))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task("images", function(){
	return gulp.src("build/img/**/*.{png,jpg,gif}")
		.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 3}), //от 1 до 10, где 3 - безопасное сжатие, а 10 - без сжатия
			imagemin.jpegtran({progressive: true})
		]))
		.pipe(gulp.dest("build/img"));
});

gulp.task("symbols", function(){
	return gulp.src("build/img/icons/*.svg")
		.pipe(svgmin())
		.pipe(svgstore({
			inlineSvg: true //Для инлайн svg
		}))
		.pipe(rename("symbols.svg"))
		.pipe(gulp.dest("build/img"));
});

gulp.task("copy", function(){
	gulp.src([
		"fonts/**/*.{woff,woff2}",
		"img/**",
		"js/**",
		"*.html"
	], {
		base: "." //без этого gulp бы сложил все файлы в папку build, без какой-либо вложенности
	})
	.pipe(gulp.dest("build"));
});

gulp.task("clean", function(){
	return del("build");
});

gulp.task("build", function(fn){
	runSq("clean", "copy", "sass", "images", "symbols", fn)
});

gulp.task("browser-sync", function(){
	browserSync.init({
		server: "build",
		notify: false
	});

	gulp.watch("sass/**/*.scss", ["sass"]);
	gulp.watch("*.html")
		.on("change", browserSync.reload);
	gulp.watch("js/**/*.js")
		.on("change", browserSync.reload);
});