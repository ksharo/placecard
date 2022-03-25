const gulp = require("gulp");
const mocha = require("gulp-mocha");

async function runTests(){
    gulp.src("tests/**/*_test.js")
        .pipe(mocha({}));    
}

gulp.task("build", gulp.series(runTests));
