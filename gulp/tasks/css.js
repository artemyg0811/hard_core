import gulp from 'gulp'
import del from "del";
import browserSync from 'browser-sync';
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'

import autoPrefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import groupCssMediaQueries from 'gulp-group-css-media-queries'
import replace from 'gulp-replace';

const sass = gulpSass(dartSass);


export default function cssBuild() {
    del("./dist/css/**/*.css");
    return gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
        .pipe(plumber(
            notify.onError({
                title: 'CSS',
                message: 'Error <%= error.message %>'
            })
        ))
        .pipe(sass())
        .pipe(replace(/@img\//g, '../img/'))
        .pipe(app.plugins.if(
            app.isProd,
            groupCssMediaQueries()
        ))
        .pipe(app.plugins.if(
            app.isProd,
            autoPrefixer({
                grid: true,
                overrideBrowserslist: ["last 3 versions"],
            })
        ))
        .pipe(gulp.dest(app.path.build.css))

        .pipe(app.plugins.if(
            app.isProd,
            cleanCSS()
        ))
        .pipe(app.plugins.if(
            app.isProd,
            rename({ extname: ".min.css" })
        ))
        .pipe(gulp.dest(app.path.build.css))
        .pipe(browserSync.reload({stream: true}))
}