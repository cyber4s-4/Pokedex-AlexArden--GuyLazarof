const gulp = require("gulp");
const clean = require("gulp-clean");
const rename = require("gulp-rename");
const webpack = require("webpack-stream");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const { exec } = require("child_process");
const webpackConfig = require("./webpack.config.js");

// Removes previous dist
gulp.task("start", () => {
  return gulp.src("./dist", { allowEmpty: true }).pipe(clean());
});

// Creates js bundle from several js files
gulp.task("build", () => {
  return webpack(webpackConfig).pipe(gulp.dest("./dist/client"));
});

// Converts scss to css
gulp.task("scss", () => {
  return gulp.src("./src/**/*.scss").pipe(sass()).pipe(gulp.dest("./dist"));
});

// Transfers client files
gulp.task("client", () => {
  return gulp
    .src(["./src/client/*.html", "./src/client/favicon.ico"])
    .pipe(gulp.dest("./dist/client"));
});

// Transfers client js files
gulp.task("images", () => {
  return gulp
    .src(["./src/client/img/*"])
    .pipe(gulp.dest("./dist/client/img")); 
});

// Transfers server files
gulp.task("server", () => {
  return gulp
    .src(["./src/server/data.json"])
    .pipe(gulp.dest("./dist/server")); 
});



// // Browser Sync
gulp.task("browser-sync", () => {
  browserSync.init({
    browser: "default",
    port: 4000,
    server: { baseDir: "./dist" },
  });
});

// Browser Sync live reload
gulp.task("browser-sync-watch", () => {
  gulp.watch("./dist/styles.css").on("change", browserSync.reload);
  gulp.watch("./dist/app.js").on("change", browserSync.reload);
  gulp.watch("./dist/*.html").on("change", browserSync.reload);
});

// Watch scss files
gulp.task("watch-scss", () => {
  return gulp.watch("./src/client/*.scss", gulp.series("scss"));
});

// Watch html files
gulp.task("watch-html", () => {
  return gulp.watch("./src/client/*.html", gulp.series("client")); 
});

// Watch tsc files
gulp.task("watch-tsc", () => {
  return gulp.watch("./dist/js/**/*.js", gulp.series("build"));
});

// Initial ts compile
gulp.task("tsc", (cb) => {
  exec("tsc", (err, msg) => {
    cb();
  });
});

// Watch ts files and recompile
gulp.task("tsc-w", () => {
  exec("tsc -w");
});

// Run all together
gulp.task(
  "default",
  gulp.series(
    "start",
    "scss",
    "tsc", 
    "client",
    "images",
    "server", 
    "build",
    gulp.parallel(
      // "browser-sync",
      // "browser-sync-watch",
      "watch-scss",
      "watch-html",
      "watch-tsc",
      "tsc-w"
    )
  )
);
