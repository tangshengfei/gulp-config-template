var gulp = require("gulp");

const less = require("gulp-less");
const gulpBabel = require("gulp-babel");

const rename = require("gulp-rename");
const gulpif = require("gulp-if");

var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

var del = require("del");
var merge = require("gulp-merge");

var fs = require("fs");
var path = require("path");

var webpack = require("webpack-stream");

const distBase = "./dist",
      buildBase = "./build",
      devBase = "./dev",
      assets = "assets";

var getFolder = (basePath) => {
    var folders = fs.readdirSync(basePath);
    return folders.filter((folder) => { 
        return fs.statSync(path.join(basePath, folder)).isDirectory();
    });
}

gulp.task("rev:assets", ["compile"],  function(){
    return gulp.src([`${distBase}/html/**/*.html`,`${distBase}/${assets}/**/*.*`])
        .pipe(gulpif("*.js", rev()))
        .pipe(gulpif("*.css", rev()))
        .pipe(gulpif("*.png", rev()))
        .pipe(gulpif("*.jpg", rev()))
        .pipe(gulpif("*.gif", rev()))
        .pipe(revReplace())
        .pipe(gulpif("*.js", gulp.dest(`${buildBase}/${assets}`)))
        .pipe(gulpif("*.css", gulp.dest(`${buildBase}/${assets}`)))
        .pipe(gulpif("*.png", gulp.dest(`${buildBase}/${assets}`)))
        .pipe(gulpif("*.jpg", gulp.dest(`${buildBase}/${assets}`)))
        .pipe(gulpif("*.gif", gulp.dest(`${buildBase}/${assets}`)))
        .pipe(gulpif("*.html", gulp.dest(`${buildBase}/html`)))
});

gulp.task("rev:html",["rev:assets"], function(){
    var folders = getFolder(`${distBase}/html`);

    var tasks = folders.map((folder) => {
        return gulp.src([`${buildBase}/html/${folder}/*.html`,`${distBase}/html/${folder}/*.css`,`${distBase}/html/${folder}/*.js`])
            .pipe(gulpif("*.js", rev()))
            .pipe(gulpif("*.css", rev()))
            .pipe(revReplace())
            .pipe(gulp.dest(`${buildBase}/html/${folder}`))

    });

    return merge(tasks);
});

gulp.task("rev",["rev:html"]);

gulp.task("compile", ["compile:less", "compile:js","copy:assets","copy:html"]);

gulp.task("compile:less", function(){
    return gulp.src(`${devBase}/**/**/*.less`)
        .pipe(less())
        .pipe(gulp.dest(`${distBase}`));
});

gulp.task("compile:js", function(){
    return gulp.src([`${devBase}/**/**/*.js`])
        .pipe(webpack({
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        loader: "babel-loader"
                    }
                ]
            }
        }))
        .pipe(gulp.dest(`${distBase}`));
});

gulp.task("copy:assets", function(){
    return gulp.src(`${devBase}/${assets}/**/*.*`)
        .pipe(gulp.dest(`${distBase}/${assets}`));
});
gulp.task("copy:html", function(){
    return gulp.src(`${devBase}/**/**/*.html`)
        .pipe(gulp.dest(`${distBase}`));
});

gulp.task("del", function(){
    return del("./build");
});

gulp.task("dev", ["rev"]);
