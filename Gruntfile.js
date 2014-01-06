module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            tmp: ['tmp/']
        },
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
                    'jsbeautifier:js',
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
                tasks: ['jsbeautifier:js', 'jshint:main', 'yuidoc:main']
            }
        },
        jsbeautifier: {
            js: {
                src: ['js/**/*.js', 'Gruntfile.js', 'package.json',
                    '!js/intro.js', '!js/outro.js'],
                options: {
                    js: {
                        indentSize: 4,
                        wrapLineLength: 80,
                        keepArrayIndentation: true
                    }
                }
            },
            css: {
                src: ['style.css'],
                options: {
                    css: {
                        indentChar: ' ',
                        indentSize: 4
                    }
                }
            },
            html: {
                src: ['index.html'],
                options: {
                    html: {
                        braceStyle: 'collapse',
                        indentChar: ' ',
                        indentScripts: 'keep',
                        indentSize: 4,
                        maxPreserveNewlines: 10,
                        preserveNewlines: true,
                        unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u'],
                        wrapLineLength: 0
                    }
                }
            }
        },
        jshint: {
            main: ['Gruntfile.js', 'js/**/*.js', '!js/lib/**',
                '!js/intro.js', '!js/outro.js']
        },
        yuidoc: {
            lint: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    lint: true,
                    paths: ['js'],
                    exclude: 'js/lib,.DS_Store,.git'
                }
            },
            main: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    linkNatives: true,
                    paths: ['js'],
                    exclude: 'js/lib,.DS_Store,.git',
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
            },
            markdown: {
                src: [
                    'canvas.md',
                    'workers.md'
                ],
                dest: 'tmp/project.md'
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
        },
        markdown: {
            all: {
                files: {
                    'index.html': ['tmp/project.md']
                },
                options: {
                    template: 'game.jst',
                    markdownOptions: {
                        gfm: true,
                        highlight: 'manual',
                        codeLines: {
                            before: '<span>',
                            after: '</span>'
                        }
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-markdown');

    grunt.registerTask('default', [
        'clean:*',
        'jsbeautifier:js',
        'jsbeautifier:css',
        'jshint:*',
        'yuidoc:*',
        'cssmin:*',
        'browserify:*',
        'concat:*',
        'markdown:*',
        'jsbeautifier:html'
    ]);
    grunt.registerTask('build', ['default', 'uglify:main']);
};
