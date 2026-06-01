// Simple in-memory storage for CSV batches
// Keys are batchId strings, values are arrays of contact objects.
const batches = new Map();

module.exports = batches;
