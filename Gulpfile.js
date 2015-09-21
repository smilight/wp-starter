var gulp = require('gulp'),
    del = require('del'),
    path = require('path'),
    fs = require('fs'),
    $ = require('gulp-load-plugins')(),
    pjson = require('./package.json'),
    request = require('request'),
    critical = require('critical'),
    cssLint = {
        "adjoining-classes": true,
        "box-model": false,
        "box-sizing": true,
        "compatible-vendor-prefixes": true,
        "empty-rules": true,
        "display-property-grouping": true,
        "duplicate-background-images": true,
        "duplicate-properties": true,
        "fallback-colors": true,
        "floats": true,
        "font-faces": true,
        "font-sizes": true,
        "gradients": true,
        "ids": true,
        "import": true,
        "important": true,
        "known-properties": true,
        "outline-none": true,
        "overqualified-elements": true,
        "qualified-headings": false,
        "regex-selectors": true,
        "shorthand": true,
        "star-property-hack": true,
        "text-indent": true,
        "underscore-property-hack": true,
        "unique-headings": false,
        "universal-selector": true,
        "unqualified-attributes": true,
        "vendor-prefix": true,
        "zero-units": true
    },
    config = {
        "dev_folder": 'dev', // dir path end without "/"
        "dist_folder": 'assets', // dir path end without "/"
        'env': 'development', // production or development
        'sass': 'dev/**/*.scss', // with file extension
        'css': './assets/css', // without file extension
        'images': ['!dev/images/**/{sprite,sprite/**,sprite/*.*,sprites,sprites/**,sprites/*.png}', 'dev/images/**/*.png', 'dev/images/**/*.jpg', 'dev/images/**/*.gif'],
        'images_dest': 'assets/',
        'fonts': 'dev/fonts/**',
        'js': 'dev/js/**/*.js'
    },
    AUTOPREFIXER_BROWSERS = [
        'ie >= 9',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 5',
        'opera >= 23',
        'ios >= 5',
        'android >= 4.1',
        'bb >= 10'
    ];

function createPath(userPath) {
    return path.join(
        __dirname,
        userPath
    )
}

function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 0777;
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}

gulp.task('js', function () {
    return gulp.src(['dev/components/**/*.min.js', 'dev/js/*.js'])
        .pipe($.concat('all.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('assets/js'));
});

gulp.task('themeinfo', function () {
    fs.writeFileSync('./style.css', '' +
        '/* \n ' +
        'Theme Name: ' + pjson.name + '\n ' +
        'Version: ' + pjson.version + '\n ' +
        'Theme URI: "' + pjson.homepage + '"\n ' +
        'Author: ' + pjson.author + '\n ' +
        'Author URI: "' + pjson.creaditials.authorUrl + '"\n ' +
        'Description: ' + pjson.creaditials.description + '\n ' +
        'Text Domain: ' + pjson.creaditials.textDomain + '\n ' +
        '*/'
    );
});

gulp.task('iconfont', function () {
    gulp.src(['dev/fonts/**/*.svg'])
        .pipe($.iconfontCss({
            fontName: pjson.name + '-icons',
            appendUnicode: true,
            path: 'dev/sass/templates/_icons.scss',
            targetPath: createPath('dev/sass/modules/_icons.scss'),
            fontPath: '../fonts/'
        }))
        .pipe($.iconfont({
            fontName: pjson.name + '-icons',
            normalize: true,
            centerHorizontally: true
        }))
        .pipe(gulp.dest(createPath('assets/fonts/')));
});

gulp.task('critical',['styles:compile'], function () {
    ensureExists(__dirname + '/.tmp', 0777, function(err) {
        if (err) console.log( err);
        else console.log('folder ok!');
    });
    function writeToHeader(styles){
        var fs = require('fs'),
            fileList = './header.php';

        fs.readFile(fileList, function(err, data) {
            if(err) throw err;
            data = data.toString();
            data = data.replace(/<style id="criticalcss">(.*?)<\/style>/g, '<style id="criticalcss">'+styles+'</style>');
            fs.writeFile(fileList, data, function(err) {
                err || console.log('critical css added');
            });
            return true;
        });
    }

    request(pjson.homepage, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            critical.generate({
                base: '.tmp/',
                html: body,
                css: ['./assets/css/main.css'],
                dimensions: [{
                    height: 200,
                    width: 500
                }, {
                    height: 900,
                    width: 1200
                }],
                minify: true,
                ignore: ['@font-face',/url\(/]
            }).then(function (output) {
                writeToHeader(output);
            });
        }
    });
});

gulp.task('images:optimize', function () {
    return gulp.src(config.images)
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(config.images_dest))
});

gulp.task('images:optimize:sprites', function () {
    return gulp.src('./assets/images/sprites/*.png')
        .pipe($.imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest('assets/images/sprites/'))
});

gulp.task('styles:compile', function () {
    return gulp.src(config.sass)
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe($.tap(function (file, t) {
            if (path.basename(file.path).substring(0, 1) != "_") {
                return gulp.src(file.path)
                    .pipe($.compass({
                        css: path.dirname(file.path).replace(config.dev_folder, config.dist_folder).replace('sass', 'css'),
                        sass: path.dirname(file.path),
                        image: path.dirname(file.path).replace('sass', 'images'),
                        http_path: path.dirname(file.path).replace('sass', ''),
                        generated_images_path: path.dirname(file.path).replace(config.dev_folder, config.dist_folder).replace('sass', 'images'),
                        require: ['sass-globbing', 'sass-media_query_combiner'],
                        relative: true,
                        sourcemap: config.env != 'production',
                        comments: config.env != 'production'
                    }))
                    .on('error', console.error.bind(console))
                    //.pipe($.csslint(cssLint))
                    //.pipe($.csslint.reporter())
                    .pipe($.if(config.env == 'production', $.autoprefixer({browsers: AUTOPREFIXER_BROWSERS})))
                    .pipe($.if(config.env == 'production', $.csso()))
                    .pipe(gulp.dest(path.dirname(file.path).replace(config.dev_folder, config.dist_folder).replace('sass', 'css')))
                    .pipe($.size({title: 'styles'}));
            }
        }));
});
gulp.task('styles:watch', function () {
    return gulp.src(config.sass)
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe($.tap(function (file, t) {
            if (path.basename(file.path).substring(0, 1) != "_") {
                return gulp.src(file.path)
                    .pipe($.compass({
                        css: path.dirname(file.path).replace(config.dev_folder, config.dist_folder).replace('sass', 'css'),
                        sass: path.dirname(file.path),
                        image: path.dirname(file.path).replace('sass', 'images'),
                        http_path: path.dirname(file.path).replace('sass', ''),
                        generated_images_path: path.dirname(file.path).replace(config.dev_folder, config.dist_folder).replace('sass', 'images'),
                        require: ['sass-globbing', 'sass-media_query_combiner'],
                        relative: true,
                        sourcemap: true,
                        comments: true
                    }))
                    .on('error', console.error.bind(console))
                    //.pipe($.csslint(cssLint))
                    //.pipe($.csslint.reporter())
                    .pipe(gulp.dest(path.dirname(file.path).replace(config.dev_folder, config.dist_folder).replace('sass', 'css')))
                    .pipe($.size({title: 'styles'}));
            }
        }));
});

gulp.task('clean:all', del.bind(null, config.dist_folder));

gulp.task('clean:cache', function (done) {
    return $.cache.clearAll(done);
});

gulp.task('watch', function () {
    gulp.watch(config.sass, ['styles:watch']);
    gulp.watch(config.images, ['images:copy']);
    gulp.watch(config.js, ['js']);
});
gulp.task('default', ['watch']);
gulp.task('build:prod', function (cb) {
    config.env = 'production';
    $.runSequence('clean:all', ['clean:cache', 'styles:compile', 'images:optimize', 'images:optimize:sprites', 'iconfont', 'js', 'themeinfo'], cb);
});
gulp.task('build:loc', function (cb) {
    config.env = 'development';
    $.runSequence('clean:all', ['clean:cache', 'styles:compile', 'fonts', 'js', 'images:copy'], cb);
});