const { ObjectId } = require('mongodb');

// Son 7 günü kapsayan tarihler oluştur
const getLast7Days = () => {
  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });
};

const last7Days = getLast7Days();

// Test sonuçları için statüsler
const statuses = ['passed', 'failed', 'pending', 'blocked'];

// Rastgele test sonuçları oluştur
const generateTestResults = (count, date) => {
  const results = [];
  for (let i = 0; i < count; i++) {
    const statusIndex = Math.floor(Math.random() * 100);
    let status;
    
    // Dağılım: %60 passed, %20 failed, %10 pending, %10 blocked
    if (statusIndex < 60) {
      status = 'passed';
    } else if (statusIndex < 80) {
      status = 'failed';
    } else if (statusIndex < 90) {
      status = 'pending';
    } else {
      status = 'blocked';
    }
    
    results.push({
      id: `result-${date.getTime()}-${i}`,
      testCaseId: `tc-${Math.floor(Math.random() * 1000)}`,
      status,
      duration: Math.floor(Math.random() * 120) + 10, // 10-130 saniye arası
      errorMessage: status === 'failed' ? 'Test assertion failed' : null,
      screenshot: status === 'failed' ? 'screenshot.png' : null,
      logs: 'Test execution logs...',
      startTime: new Date(date.getTime() + Math.floor(Math.random() * 3600000)).toISOString(),
      endTime: new Date(date.getTime() + Math.floor(Math.random() * 3600000) + 120000).toISOString(),
    });
  }
  return results;
};

// Test runs oluştur
const testRuns = last7Days.flatMap((day, index) => {
  // Her gün için 1-3 test run oluştur
  const runsPerDay = Math.floor(Math.random() * 3) + 1;
  
  return Array.from({ length: runsPerDay }).map((_, runIndex) => {
    const testCount = Math.floor(Math.random() * 10) + 5; // 5-15 test arası
    const startTime = new Date(day.getTime() + runIndex * 3600000);
    const endTime = new Date(startTime.getTime() + (testCount * 60 * 1000) + Math.floor(Math.random() * 3600000));
    
    return {
      id: `run-${day.getTime()}-${runIndex}`,
      name: `Daily Test Run ${index + 1}-${runIndex + 1}`,
      description: `Automated test run for day ${index + 1}`,
      status: 'completed',
      environment: ['production', 'staging', 'development'][Math.floor(Math.random() * 3)],
      browser: ['chrome', 'firefox', 'safari'][Math.floor(Math.random() * 3)],
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: (endTime.getTime() - startTime.getTime()) / 1000, // saniye cinsinden
      testSuiteId: `suite-${Math.floor(Math.random() * 5) + 1}`,
      triggeredBy: 'admin',
      results: generateTestResults(testCount, day),
      tags: ['automated', 'daily'],
      createdAt: startTime.toISOString(),
      updatedAt: endTime.toISOString(),
    };
  });
});

module.exports = testRuns;
