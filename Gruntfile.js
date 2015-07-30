module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      // options: {
      //   separator: ';',
      // },
      dist: {
        src: ['public/client/*'],
        dest: 'built.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'built.min.js': ['built.js'],
          'public/lib/backbone.js': ['public/lib/backbone.js'],      
          'public/lib/handlebars.js': ['public/lib/handlebars.js'],
          'public/lib/jquery.js': ['public/lib/jquery.js'],
          'public/lib/underscore.js': ['public/lib/underscore.js']    
        }
      }
    },

    jshint: {
      files: [
        // Add filespec list here
        'app/collections/*', 
        'app/models/*', 
        'app/config.js',
        'lib/*',
        'public/client/*',
        'server-config.js',
        'server.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
        // Add filespec list here
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'output.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push azure'
      }
      // makeDir: {
      //   command: 'mkdir newdirectory'
      // },
      // touch: {
      //   command: ['cd newdirectory', 'touch newfile.txt'].join('&&')
      // }, 
      // rootTouch: {
      //   command: 'touch file.txt'
      // }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', ['jshint', 'mochaTest']);

  grunt.registerTask('build', ['test', 'concat', 'uglify', 'cssmin', 'shell']);

  grunt.registerTask('default', ['shell:prodServer' ]);
  
  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['default']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
      // add your production server task here
      'test',
      'build',
      'upload'
  ]);

  grunt.registerTask('make', ['shell']);
};
