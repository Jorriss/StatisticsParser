module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.js',
      '!src/**/*.test.js',
      '!src/**/__tests__/**/*.js'
    ],

    tests: [
      'src/**/*.test.js',
      'src/**/__tests__/**/*.js'
    ],

    env: {
      type: 'node',
      runner: 'node',
      params: {
        env: 'NODE_ENV=test'
      }
    },

    testFramework: 'vitest',

    setup: function (wallaby) {
      const jsdom = require('jsdom');
      const { JSDOM } = jsdom;
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
      
      global.window = dom.window;
      global.document = dom.window.document;
      global.navigator = dom.window.navigator;
      global.HTMLElement = dom.window.HTMLElement;
      global.XMLHttpRequest = dom.window.XMLHttpRequest;
      global.fetch = dom.window.fetch;
    }
  };
}; 