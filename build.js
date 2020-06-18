const gulp = require('gulp')
const connect = require('gulp-connect')
const plumber = require('gulp-plumber')
const stylus = require('gulp-stylus')
const rename = require('gulp-rename')
const data = require('gulp-data')
const yaml = require('js-yaml')
const del = require('del')
const nib = require('nib')
const rupture = require('rupture')
const koutoSwiss = require('kouto-swiss')
const pug = require('gulp-pug')
const fs = require('fs')
const sequence = require('run-sequence')

const BUILD_FOLDER = 'build'

const paths = {
  html: './src/pug/**/*',
  css: './src/stylus/**/*',
  js: `./${BUILD_FOLDER}/assets/js/**/*`,
}

gulp.task('connect', () => {
  connect.server({
    host: '0.0.0.0',
    root: `./${BUILD_FOLDER}`,
    port: 3000,
    livereload: true,
  })
})

gulp.task('stylus', () => {
  gulp.src('./src/stylus/*.styl')
    .pipe(plumber())
    .pipe(stylus({
      compress: false,
      use: [nib(), rupture(), koutoSwiss()],
      import: ['nib', 'kouto-swiss'],
      'include css': true,
    }))
    .pipe(gulp.dest(`./${BUILD_FOLDER}/assets/css`))
    .pipe(connect.reload())
})

gulp.task('pug', () => {
  const data_config = yaml.safeLoad(fs.readFileSync('./_config.yml', 'utf-8'))
  const data_events = yaml.safeLoad(fs.readFileSync('./_events.yml', 'utf-8'))

  gulp.src('./src/pug/*.pug')
    .pipe(plumber())
    .pipe(data({
      config: data_config,
      events: data_events,
    }))
    .pipe(pug())
    .pipe(gulp.dest(`./${BUILD_FOLDER}`))
    .pipe(connect.reload())
})

gulp.task('copy:static', () => {
  return gulp.src('./src/static/**/*')
    .pipe(gulp.dest(`./${BUILD_FOLDER}/assets/static`))
})

gulp.task('clean:static', () => {
  return del(`./${BUILD_FOLDER}/assets/static`)
})

gulp.task('watch', () => {
  gulp.watch(paths.css, ['stylus'])
  gulp.watch([paths.html, paths.js, './*.yml'], ['pug'])
})

gulp.task('build', () => {
  sequence(
    'clean:static',
    'copy:static',
    'stylus',
    'pug',
  )
})

gulp.task('server', () => {
  sequence(
    'build',
    'connect',
    'watch',
  )
})
