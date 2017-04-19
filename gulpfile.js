// Needed packages
const gulp  = require('gulp');
const gts   = require('gulp-typescript');
const gsm   = require('gulp-sourcemaps');
const del   = require('del');
const path  = require('path');

// External config
const tsConfig = require(path.resolve(__dirname, './tsconfig.json'));

// Config
const distFolder  = 'dist';
const srcFolder   = 'src';

/**
 * Tasks
 */
gulp.task('build', () => {
  return gulp
    .src([srcFolder + '/**/*.ts', 'node_modules/@types/**/*.ts', srcFolder + '/custom-typings/**/*.ts'])
    .pipe(gsm.init())
    .pipe(gts(tsConfig.compilerOptions))
    .pipe(gulp.dest(distFolder));
});

gulp.task('clean', () => {
  return del(distFolder);
});