const validator = require('validator');

// Safe XSS sanitization middleware using validator
// Replacement for express-xss-sanitizer to fix GHSA-qhwp-454g-2gv4
const xssSanitizer = () => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    // Trim whitespace first
    str = validator.trim(str);
    
    // Remove script tags and their content completely
    str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove all other HTML tags but keep content
    str = str.replace(/<[^>]*>/g, '');
    
    // Strip low ASCII characters
    str = validator.stripLow(str);
    
    return str;
  };

  return (req, res, next) => {
    // Apply sanitization to all body fields
    if (req.body && typeof req.body === 'object') {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeString(req.body[key]);
        }
      }
    }

    // Apply sanitization to query parameters
    if (req.query && typeof req.query === 'object') {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
          req.query[key] = sanitizeString(req.query[key]);
        }
      }
    }

    // Apply sanitization to URL parameters
    if (req.params && typeof req.params === 'object') {
      for (const key in req.params) {
        if (typeof req.params[key] === 'string') {
          req.params[key] = sanitizeString(req.params[key]);
        }
      }
    }

    next();
  };
};

module.exports = { xss: xssSanitizer };