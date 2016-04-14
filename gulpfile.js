var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var lessify = require('lessify');
var bulkify = require('bulkify');

var path = {
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'public/dist',
  DEST_BUILD: 'public/dist/build',
  DEST_SRC: 'public/dist/src',
  ENTRY_POINT: './public/app.js'
};

/*
** watch
** -----
** this function allows your app to watch for changes made to a specific set of files.
** essentially, we pass it our app.js file, and it discovers all app dependencies, monitoring
** them for any changes and recompiling our distributed js file whenever changes are made.
**
** to run: `gulp watch` or just `gulp`
*/
gulp.task('watch', function() {
  var watcher  = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify, lessify, bulkify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher
    .on('update', function () {
      watcher
        .bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(path.OUT))
        .pipe(gulp.dest(path.DEST_SRC))
        console.log('Updated');
    })
    .on('transform', function (tr, file) {
      console.log('^.^: ', file);
    })
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC));
});

/*
** build
** -----
** This function is similar to watch, except in that it compiles your assets and then shuts down.
** it is meant for production.
**
** to run: `gulp build`
*/
gulp.task('build', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify, lessify, bulkify],
  })
  .bundle()
  .pipe(source(path.OUT))
  .pipe(gulp.dest(path.DEST_SRC));
});

// sets the default gulp task to `watch`. this means that when you run `gulp` from
// the project directory, the `watch` command will be run.
gulp.task('default', ['watch']);
