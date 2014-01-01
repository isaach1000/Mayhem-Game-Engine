module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            main: {
                files: ['js/**/*.js', '!js/lib/**'],
                tasks: ['jsbeautifier:main', 'jshint:main'],
                options: {
                    livereload: true
                }
            },
            worker: {
                files: ['js/**/*.js', '!js/lib/**'],
                tasks: [
                    'jsbeautifier:main',
                    'jshint:main',
                    'requirejs:worker'
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
                src: ['js/**/*.js', 'Gruntfile.js', 'package.json'],
                options: {
                    js: {
                        indentSize: 4,
                        jsLintHappy: true,
                        wrapLineLength: 80,
                        keepArrayIndentation: true
                    }
                }
            }
        },
        jshint: {
            main: ['Gruntfile.js', 'js/**/*.js', '!js/lib/**']
        },
        yuidoc: {
            main: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: ['js'],
                    ignorepaths: ['js/lib/*', 'js/template.js'],
                    outdir: 'docs'
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'js',
                    name: 'main',
                    out: 'build/optimized.js',
                    paths: {
                        jquery: 'lib/jquery',
                        underscore: 'lib/underscore'
                    },
                    shim: {
                        underscore: {
                            exports: '_'
                        }
                    }
                }
            },
            worker: {
                options: {
                    baseUrl: 'js',
                    name: 'task',
                    out: 'build/task.js',
                    paths: {
                        jquery: 'lib/jquery',
                        underscore: 'lib/underscore'
                    },
                    shim: {
                        underscore: {
                            exports: '_'
                        }
                    },
                    include: ['lib/require.js'],
                    optimize: 'none'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.registerTask('default', ['jsbeautifier:*', 'jshint:*', 'yuidoc:*']);
    grunt.registerTask('build', [
        'default',
        'requirejs:compile',
        'requirejs:worker'
    ]);
};
