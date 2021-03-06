var publicAssets  = './public/assets';
var sourceFiles   = './app/assets';
var bowerDir      = './vendor/assets/bower_components'; 

var _             = require('lodash');
var gulp          = require('gulp');
var gulpSequence  = require('gulp-sequence');
var browserify    = require('browserify');
var browserSync   = require('browser-sync');
var source        = require('vinyl-source-stream');
var watchify      = require('watchify');
var del           = require('del');
var changed       = require('gulp-changed');
var imagemin      = require('gulp-imagemin');
var rev           = require('gulp-rev');
var revCollector  = require('gulp-rev-collector');
var notify        = require("gulp-notify");
var sass          = require('gulp-sass');
var sourcemaps    = require('gulp-sourcemaps');
var autoprefixer  = require('gulp-autoprefixer');
var plumber       = require('gulp-plumber');

var bundleConfigs = [{
  entries: sourceFiles + '/javascripts/core/core.js.coffee',
  dest: publicAssets + '/javascripts',
  outputName: 'core.js',
  extensions: ['.js','.coffee']
}]

var browserSyncConfig =  {
  proxy: 'localhost:3000',
  files: ['./app/views/**']
}

var sassConfig = {
  src: sourceFiles + '/stylesheets/core/*.scss',
  dest: publicAssets + '/stylesheets',
  settings: {
    style: 'compressed',
    imagePath: '/assets/images',
    includePaths: [
      bowerDir + '/bootstrap-sass/assets/stylesheets',
      sourceFiles + '/stylesheets/core/'
    ]
  }
}

var imageConfig = {
  src: sourceFiles + '/images/**',
  dest: publicAssets + '/images'
}

var handleErrors = function() {
  var args = Array.prototype.slice.call(arguments);

  notify.onError({
    title: "Compile Error",
    message: "<%= error %>"
  }).apply(this, args);

  this.emit('end');
};

gulp.task('browserSync', function() {
  browserSync(browserSyncConfig);
});

var browserifyTask = function(callback, devMode) {
  var bundleQueue = bundleConfigs.length;

  var browserifyThis = function(bundleConfig) {

    if(devMode) {
      _.extend(bundleConfig, watchify.args, { debug: true });
      bundleConfig = _.omit(bundleConfig, ['external', 'require']);
    }

    var b = browserify(bundleConfig);

    var bundle = function() {
      return b
        .bundle()
        .on('error', handleErrors)
        .pipe(source(bundleConfig.outputName))
        .pipe(gulp.dest(bundleConfig.dest))
        .on('end', reportFinished)
        .pipe(browserSync.reload({stream:true}));
    };

    if(devMode) {
      b = watchify(b);
      b.on('update', bundle);
    } else {
      if(bundleConfig.require) b.require(bundleConfig.require);
      if(bundleConfig.external) b.external(bundleConfig.external);
    }

    var reportFinished = function() {
      if(bundleQueue) {
        bundleQueue--;
        if(bundleQueue === 0) {
          callback();
        }
      }
    };

    return bundle();
  };

  bundleConfigs.forEach(browserifyThis);
};

gulp.task('browserify', browserifyTask);

gulp.task('build', function(cb) {
  var tasks = ['clean',['images'], ['sass', 'browserify']];
  if(process.env.RAILS_ENV === 'production') tasks.push('rev');
  tasks.push(cb);
  gulpSequence.apply(this, tasks);
});

gulp.task('clean', function (cb) {
  del([publicAssets], cb);
});

gulp.task('default', ['sass', 'images', 'watch']);

gulp.task('images', function() {
  return gulp.src(imageConfig.src)
    .pipe(changed(imageConfig.dest)) // Ignore unchanged files
    .pipe(imagemin()) // Optimize
    .pipe(gulp.dest(imageConfig.dest))
    .pipe(browserSync.reload({stream:true}));
});

// Add md5 hashes to assets
gulp.task('rev-assets', function(){
  return gulp.src(publicAssets + '/**/!(*.{css,js})')
    .pipe(rev())
    .pipe(gulp.dest(publicAssets))
    .pipe(rev.manifest())
    .pipe(gulp.dest(publicAssets));
});

// Replace asset references in compiled css and js files
gulp.task('rev', ['rev-assets'], function(){
  return gulp.src([publicAssets + '/rev-manifest.json', publicAssets + '/**/*.{css,js}'])
    .pipe(revCollector())
    .pipe(gulp.dest(publicAssets));
});

gulp.task('sass', function () {
  return gulp.src(sassConfig.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass(sassConfig.settings))
    .on('error', handleErrors)
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'ie 8', 'firefox < 20'] }))
    .pipe(gulp.dest(sassConfig.dest))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', ['watchify','browserSync'], function(callback) {
  gulp.watch(sassConfig.src,  ['sass']);
  gulp.watch(imageConfig.src, ['images']);
  // watchify will watch and recompile our JS, so no need to gulp.watch it
});

gulp.task('watchify', function(callback) {
  browserifyTask(callback, true);
});
