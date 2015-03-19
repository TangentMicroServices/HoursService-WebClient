// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-03-10 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/lib/jquery/dist/jquery.js',
      'bower_components/lib/angular/angular.js',
      'bower_components/lib/bootstrap/dist/js/bootstrap.js',
      'bower_components/lib/angular-mocks/angular-mocks.js',
      'bower_components/lib/angular-animate/angular-animate.js',
      'bower_components/lib/angular-cookies/angular-cookies.js',
      'bower_components/lib/angular-resource/angular-resource.js',
      'bower_components/lib/angular-route/angular-route.js',
      'bower_components/lib/angular-sanitize/angular-sanitize.js',
      'bower_components/lib/angular-touch/angular-touch.js',
      'bower_components/lib/pnotify/pnotify.core.js',
      'bower_components/lib/pnotify/pnotify.buttons.js',
      'bower_components/lib/pnotify/pnotify.callbacks.js',
      'bower_components/lib/pnotify/pnotify.confirm.js',
      'bower_components/lib/pnotify/pnotify.desktop.js',
      'bower_components/lib/pnotify/pnotify.history.js',
      'bower_components/lib/pnotify/pnotify.nonblock.js',
      'bower_components/lib/angular-pnotify/src/angular-pnotify.js',
      'bower_components/lib/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/lib/moment/moment.js',
      'bower_components/lib/underscore/underscore.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    reporters: ['dots', 'progress', 'junit', 'html', 'coverage'],

    preprocessors: {
      'app/scripts/*.js' : 'coverage',
      'app/scripts/**/*.js' : 'coverage'      
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      }
    },

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-junit-reporter'
    ],

    junitReporter : {
      outputFile: 'reports/unit.xml',
      suite: 'unit'
    },

    coverageReporter: {
      reporters: [
        { type: 'lcov', dir: 'reports/coverage' },
        { type: 'cobertura', dir: 'reports/coverage', file: 'cobertura.xml' }
      ]
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
