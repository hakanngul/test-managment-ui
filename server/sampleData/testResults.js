// Test sonuçlarını test runs'lardan çıkaralım
const testRuns = require('./testRuns');

// Tüm test sonuçlarını topla
const testResults = testRuns.flatMap(run => {
  return run.results.map(result => {
    return {
      ...result,
      testRunId: run.id,
      environment: run.environment,
      browser: run.browser,
    };
  });
});

module.exports = testResults;
