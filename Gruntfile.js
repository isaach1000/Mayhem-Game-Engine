module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {},
        uglify: {},
        watch: {},
        jsbeautifier: {
            main: {
                src: ['js/**/*.js', 'Gruntfile.js', 'package.json'],
                options: {}
            }
        },
        jshint: {
            main: ['Gruntfile.js', 'js/**/*.js', '!js/lib/**']
        },
        yuidoc: {
            main: {
                options: {
                    paths: ['js/**/*.js', '!js/lib/*'],
                    outdir: ['docs']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('default', [
        'jsbeautifier:*',
        'jshint:*',
        'yuidoc:*'
    ]);
};
