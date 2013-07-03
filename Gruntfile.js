module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      config: {
        options: {jshintrc: '.jshintrc'},
        src: ['Gruntfile.js', 'config/**/*.js'],
      },
      app: {
        options: {jshintrc: 'app/.jshintrc'},
        src: ['app/**/*.js'],
      },
    },
    clean: {
      build: ['build'],
    },
    jade: {
      options: {
        data: {
          config: require('./config/app'),
          target: '<%= grunt.task.current.target %>',
        },
      },
      dev: {
        expand: true,
        cwd: 'app/pages',
        src: '*.jade',
        dest: 'build/wwwroot',
        ext: '.html',
      },
      prod: '<%= jade.dev %>',
    },
    handlebars: {
      options: {
        node: true,
        processName: function(name) {
          return require('path').basename(name, '.hbs');
        },
      },
      templates: {
        src: 'app/templates/*.hbs',
        dest: 'build/templates.js',
      },
    },
    stylus: {
      dev: {
        options: {compress: false},
        files: [{src: 'app/css/app.styl', dest: 'build/wwwroot/app.css'}],
      },
      prod: {
        files: '<%= stylus.dev.files %>',
      },
    },
    browserify: {
      options: {
        alias: 'jquery2:jquery',
      },
      dev: {
        options: {debug:true},
        src: ['app/app.js'],
        dest: 'build/wwwroot/app.js',
      },
      prod: {
        options: {debug:false},
        src: '<%= browserify.dev.src %>',
        dest: '<%= browserify.dev.dest %>',
      },
    },
    connect: {
      options: { base: 'build/wwwroot', },
      dev: {},
      prod: {
        options: {
          base: 'build/wwwroot',
          keepalive: true,
        },
      },
    },
    watch: {
      jshint: {
        files: ['<%= jshint.config.src %>', '<%= jshint.app.src %>'],
        tasks: ['jshint']
      },
      jade: {
        files: ['app/pages/*.jade', 'config/**/*'],
        tasks: ['jade:dev'],
      },
      handlebars: {
        files: ['<%= handlebars.templates.src %>'],
        tasks: ['handlebars'],
      },
      stylus: {
        files: ['<%= stylus.dev.files[0].src %>'],
        tasks: ['stylus:dev'],
      },
      js: {
        files: ['app/**/*.js'],
        tasks: ['browserify:dev'],
      },
      livereload: {
        options: { livereload: true, },
        files: ['app/**/*.js', 'build/**/*', 'config/**/*'],
      }
    },
    'gh-pages': {
      site: {
        options: {
          base: 'build/wwwroot',
          clone: 'build/gh-pages',
        },
        src: ['**/*'],
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('build',
    'Build site files for testing or deployment.',
    ['jshint', 'clean', 'jade:prod', 'handlebars', 'browserify:prod', 'stylus:prod']);

  grunt.registerTask('deploy',
    'Deploy site via gh-pages.',
    ['build', 'gh-pages']);

  grunt.registerTask('dev',
    'Start a live-reloading dev webserver on localhost.',
    ['jshint', 'clean', 'jade:dev', 'handlebars', 'stylus:dev', 'browserify:dev', 'connect:dev', 'watch']);

  grunt.registerTask('prod',
    'Publish to build/wwwroot and start a webserver on localhost.',
    ['build', 'connect:prod:keepalive']);

  grunt.registerTask('default', ['dev']);

};
