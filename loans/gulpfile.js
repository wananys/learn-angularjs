var gulp = require('gulp');
//引入插件
var uglify = require('gulp-uglify');//压缩
var minifyCss = require('gulp-minify-css');
var stripDebug = require('gulp-strip-debug'); //该插件用来去掉console和debugger语句
var useref = require('gulp-useref');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var gulpif = require('gulp-if');
var htmlmin = require('gulp-htmlmin');
var plumber = require('gulp-plumber');
var replace = require('gulp-replace');
var header = require('gulp-header');
var connect = require('gulp-connect');

//任务处理的文件路径配置
var paths={
	js:['./js/*','./js/lib/*.js'],
	css:['./css/*'],
	img:['./image/*','./image/category/*','./image/common/*','./image/index/*','./image/model/*','./image/temp/*'],
	html:['./*.html']
};


var output = './dest';

var date = new Date()

var year = date.getFullYear()
var month = date.getMonth() + 1
var theDate = date.getDate()
var hour = date.getHours()
var minutes = date.getMinutes()
var dataString = [ 
    year,
    month > 10 ? month : '0' + month,
    theDate > 10 ? theDate : '0' + theDate,
    hour > 10 ? hour : '0' + hour,
    minutes > 10 ? minutes : '0' + minutes
].join('')

var banner = 
'/*!' + '\n' +
' * LastModifyTime: ' + date.toLocaleString()  + '\n' +
' * Copyright(c) 2017 H5项目管理'  + '\n' +
' */\n'

//压缩JS
gulp.task('jsmin',function(){
	gulp.src(paths.js)
		.pipe(uglify())
		.pipe(header(banner))
		.pipe(gulp.dest(output+'/js'))
});

//压缩css
gulp.task('cssmin',function(){
	gulp.src(paths.css)
		.pipe(minifyCss())
		.pipe(gulp.dest(output+'/css'))
});

//压缩图片
gulp.task('imagemin',function(){
	gulp.src(paths.img)
		.pipe(imagemin())
		.pipe(gulp.dest(output+'/image'));
});

//html
gulp.task('htmlmin',function(){
	var options = {
		removeComments:true,
		collapseWhitespace:true,
		collapseBooleanAttributes:true,
		removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true//删除<style>和<link>的type="text/css"
//      minifyJS: true,//压缩页面JS
//      minifyCSS: true//压缩页面CSS
	};
	gulp.src(paths.html)
//		.pipe(htmlmin(options))
		.pipe(plumber())
        .pipe(replace(/\.css\b/g, '.css?v=' + dataString))
        .pipe(replace(/\.js\b/g, '.js?v=' + dataString))
		.pipe(gulp.dest(output + '/'));
});


//配置服务器
gulp.task('webserver',['jsmin','cssmin','imagemin','htmlmin'],function(){
	connect.server();
});

gulp.task('default',['webserver']);
