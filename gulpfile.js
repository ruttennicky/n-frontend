var gulp      = require('gulp');
var sass      = require('gulp-sass');
var webserver = require('gulp-webserver');
var opn       = require('opn');
var uglify    = require('gulp-uglify');
var gutil     = require('gulp-util');
var filesize  = require('gulp-filesize');
var minifyHTML= require('gulp-minify-html');
var imagemin  = require('gulp-imagemin');
var pngquant  = require('imagemin-pngquant');

var paths = {
    css: {
        src: './sass',
        files: './src/sass/**/*.scss',
        dest: './dist/css/',
        filename: 'style.scss'
    },
    js: {
        src: './js',
        files: './src/js/**/*.js',
        dest: './dist/js/',
        filename: 'scripts.js'
    },
    images: {
        src:'./src/images/**/*',
        dest: './dist/images/'
    },
    html: {
        src:'./src/*.html',
        dest: './dist/'
    }
}

var server = {
  file: '/dist/index.html',
  host: 'localhost',
  port: '3333',
  browser: 'firefox'
}

//Opens webserver
gulp.task('webserver', function() {
  gulp.src( '.' )
    .pipe(webserver({
      host:             server.host,
      port:             server.port,
      livereload:       true,
      directoryListing: false
    }));
});

//Open the browser
gulp.task('openbrowser', function() {
  opn( 'http://' + server.host + ':' + server.port + server.file );
});

//Make pretty css from SASS files
gulp.task('css', function () {
    gulp.src(paths.css.files)
    .pipe(sass({
        outputStyle: 'compressed',
        sourceComments: 'map',
        includePaths : [paths.css.src]
    }))
    .pipe(gulp.dest(paths.css.dest))
    .on('error', gutil.log)
});

//Throw JS together and minify
gulp.task('js', function() {  
    gulp.src(paths.js.files)
    .pipe(uglify())
    .pipe(filesize())
    .pipe(gulp.dest(paths.js.dest))
    .on('error', gutil.log)
});

//Optimize images
gulp.task('images', function () {
     gulp.src(paths.images.src)
     .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
         use: [pngquant()]
     }))
     .pipe(gulp.dest(paths.images.dest));
});

//Optimize HTML
gulp.task('html', function() {
  gulp.src(paths.html.src)
    .pipe(minifyHTML())
    .pipe(gulp.dest(paths.html.dest));
});

//Look for changes
gulp.task('watch', function() {
  gulp.watch(paths.css.files, ['css']);
  gulp.watch(paths.js.files, ['js']);
  gulp.watch(paths.html.files, ['html']);
});

//Serve up the fancy part
gulp.task('serve', ['css','js','images','html','webserver','watch','openbrowser']);