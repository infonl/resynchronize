module.exports = function (config) {
  config.set({
    mutate: ['src/lib/**/*.js', '!src/lib/**/*.test.js'],
    mutator: 'javascript',
    testRunner: 'jest',
    maxConcurrentTestRunners: 4,
    reporters: ['html'],
    htmlReporter: {
      baseDir: 'stryker-reports'
    },
    coverageAnalysis: 'off',
    jest: {
      project: 'custom'
    }
  })
}
