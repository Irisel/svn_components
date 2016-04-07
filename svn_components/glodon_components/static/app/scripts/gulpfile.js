var gulp = require('gulp'),
    sass = require('gulp-ruby-sass');

var sass_list = [
    '*.scss',
    '**/*.scss',
    '**/**/*.scss'
];

var config_sass = {
    root: '/root/glodon_components/glodon_components/static/app/sass/*.scss',
    output: '/root/glodon_components/glodon_components/static/app/css/'
};

function getSassList(){
    var src = [];
    for(i=0;i<sass_list.length;i++){
        src.push(config_sass.root + sass_list[i]);
    };
    return src    
}

gulp.task('sass', function(){
    return sass(config_sass.root).pipe(gulp.dest(config_sass.output))
});

gulp.task('default', function() {
   var src = getSassList();
   console.log(src);
});
