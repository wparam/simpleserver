module.exports = function(grunt){
    grunt.initConfig({
        jshint: {
            mine: ['server.js', 'app/**/*.js'],
            options: {
                esversion: 6
            }
        },
        watch:{
            files: ['<%=jsHint.files %>', 'server.js', 'app.js', 'app/**/*.js'],
            tasks: ['jsHint']
        },
        nodemon: {
            dev: {
                script: 'app.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('default', ['jshint', 'nodemon']);
};