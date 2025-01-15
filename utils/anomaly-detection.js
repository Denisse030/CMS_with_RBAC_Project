const ss = require('simple-statistics');

/**
 * Train a model to calculate thresholds for anomalies.
 * @param {Array} data Array of training data, e.g., failed login attempts
 */

function calculateThreshold(data) {
    const mean = ss.mean(data);
    const stdDev = ss.standardDeviation(data);
    return {
        upperThreshold: mean + 3 * stdDev,
        lowerThreshold: mean - 3 * stdDev,
    };
}

/**
 * Detect anomalies based on thresholds.
 * @param {number} value A value to check for anomalies (e.g., failed attempts)
 * @param {Object} thresholds Calculated thresholds
 * @returns {boolean} True if the value is an anomaly, false otherwise
 */
function isAnomalous(value, thresholds) {
    return value > thresholds.upperThreshold || value < thresholds.lowerThreshold;
}

module.exports = { calculateThreshold, isAnomalous };
