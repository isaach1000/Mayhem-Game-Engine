module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            css: {
                files: ['style.css'],
                tasks: ['cssmin:main'],
                options: {
                    livereload: true
                }
            },
            main: {
                files: ['js/**/*.js', '!js/lib/**'],
                tasks: [
                    'jsbeautifier:main',
                    'jshint:main',
                    'browserify:*',
                    'concat:*'
                ],
                options: {
                    livereload: true
                }
            },
            docs: {
                files: ['js/**/*.js', '!js/lib/**'],
                tasks: ['jsbeautifier:main', 'jshint:main', 'yuidoc:main']
            }
        },
        jsbeautifier: {
            main: {
                src: ['js/**/*.js', 'Gruntfile.js', 'package.json',
                    '!js/intro.js', '!js/outro.js'],
                options: {
                    js: {
                        indentSize: 4,
                        wrapLineLength: 80,
                        keepArrayIndentation: true
                    }
                }
            }
        },
        jshint: {
            main: ['Gruntfile.js', 'js/**/*.js', '!js/lib/**',
                '!js/intro.js', '!js/outro.js']
        },
        yuidoc: {
            main: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: ['js'],
                    ignorepaths: ['js/lib/*'],
                    // TODO: lint: true,
                    outdir: 'docs'
                }
            }
        },
        concat: {
            main: {
                src: [
                    'js/intro.js',
                    'tmp/bundle.js',
                    'js/outro.js'
                ],
                dest: 'bundle.js'
            },
            worker: {
                src: [
                    'js/intro.js',
                    'tmp/worker.js',
                    'js/outro.js'
                ],
                dest: 'worker.js'
            },
            specs: {
                src: [
                    'js/intro.js',
                    'tmp/specs.js',
                    'js/outro.js'
                ],
                dest: 'specs.js'
            }
        },
        browserify: {
            main: {
                files: {
                    'tmp/bundle.js': ['js/main.js'],
                    'tmp/worker.js': ['js/task.js'],
                    'tmp/specs.js': ['js/spec/specRunner.js']
                }
            }
        },
        uglify: {
            main: {
                files: {
                    'build/bundle.js': ['bundle.js'],
                    'build/worker.js': ['worker.js']
                }
            }
        },
        cssmin: {
            main: {
                files: {
                    'build/style.min.css': 'style.css'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.registerTask('default', [
        'jsbeautifier:*',
        'jshint:*',
        'yuidoc:*',
        'cssmin:*',
        'browserify:*',
        'concat:*'
    ]);
    grunt.registerTask('build', ['default', 'uglify:main']);
};
