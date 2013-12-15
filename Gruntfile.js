module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsbeautifier: {
            main: {
                src: ['js/**/*.js', 'Gruntfile.js', 'package.json'],
                options: {}
            }
        },
        concat: {},
        uglify: {},
        watch: {}
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('default', [
        'jsbeautifier:*'
    ]);
}
