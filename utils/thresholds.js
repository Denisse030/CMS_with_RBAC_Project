const { calculateThreshold } = require('./anomaly-detection');

// Example training data for failed login attempts
const trainingData = [
    [0, 9],  // Normal login (0 failed attempts, login at 9 AM)
    [0, 18], // Normal login (0 failed attempts, login at 6 PM)
    [3, 23], // Anomalous login (3 failed attempts, login at 11 PM)
    [10, 3], // Highly anomalous (10 failed attempts, login at 3 AM)
    [1, 14], // Normal login (1 failed attempt, login at 2 PM)
];

// Calculate thresholds
const thresholds = calculateThreshold(trainingData.map(data => data[0])); // Use the first column (failed attempts)

console.log('Anomaly Detection Thresholds:', thresholds);

module.exports = thresholds;
