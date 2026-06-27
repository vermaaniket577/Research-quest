/**
 * Paper Search Schemas & Validation
 */

exports.validateSimpleSearch = (data) => {
  const errors = [];
  // The simple search API requires 'subject' which acts as the title
  if (!data.subject || typeof data.subject !== 'string') {
    errors.push('Subject is required and must be a string for simple search.');
  }
  return errors;
};

exports.validateDeepSearch = (data) => {
  const errors = [];
  if (!data.subject || typeof data.subject !== 'string') {
    errors.push('Subject is required and must be a string.');
  }
  if (!data.specialization || typeof data.specialization !== 'string') {
    errors.push('Specialization is required and must be a string.');
  }
  if (!data.keywords || !Array.isArray(data.keywords)) {
    errors.push('Keywords array is required and must be a list of strings.');
  }
  return errors;
};