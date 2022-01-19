const concat = require('gulp-concat');
const del = require('del');
const expose = require('gulp-expose');
const gulp = require('gulp');

gulp.task('clean', async function() {
  return del([
    'dist/*'
  ]);
});

gulp.task('dist', gulp.series('clean', async function(){
  return gulp.src('src/**/*.js')
      .pipe(concat('Tamotsu.gs'))
      .pipe(expose('this', 'Tamotsu'))
      .pipe(gulp.dest('dist'));
}));

gulp.task('test', gulp.series('clean', async function(){
  return gulp.src('src/**/*.js')
      .pipe(concat('Tamotsu.js'))
      .pipe(expose('this', 'Tamotsu'))
      .pipe(gulp.dest('tests'));
}));