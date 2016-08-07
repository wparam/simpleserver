module.exports = function(grunt){
    grunt.initConfig({
        jsHint: {
            files: ['server.js', 'app/**/*.js']
        },
        watch:{
            files: ['<%=jsHint.files %>'],
            tasks: ['jsHint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jsHint']);
};