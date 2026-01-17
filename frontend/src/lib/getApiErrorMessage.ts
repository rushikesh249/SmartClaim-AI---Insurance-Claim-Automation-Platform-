/**
 * Utility to safely extract error messages from API responses
 * Handles various error response formats from FastAPI
 */
export function getApiErrorMessage(error: any): string {
  // Handle network errors
  if (!error.response) {
    return 'Network error. Please check your connection.';
  }

  const data = error.response.data;
  
  // Handle FastAPI validation errors { detail: [{ loc, msg, type }] }
  if (data?.detail && Array.isArray(data.detail)) {
    // Create a mapping for better field-specific error messages
    const fieldMessages: Record<string, string> = {};
    
    for (const err of data.detail) {
      if (Array.isArray(err.loc)) {
        const field = err.loc[err.loc.length - 1]; // Get the last part of the location (field name)
        const msg = err.msg || 'Invalid input';
        
        // Convert field names to user-friendly messages
        if (field === 'phone') {
          fieldMessages[field] = 'Phone number is required';
        } else if (field === 'password') {
          fieldMessages[field] = 'Password is required';
        } else if (field === 'incident_date') {
          fieldMessages[field] = 'Incident date must be a valid date';
        } else if (field === 'sum_insured') {
          fieldMessages[field] = 'Sum insured must be a valid number';
        } else if (field === 'premium_amount') {
          fieldMessages[field] = 'Premium amount must be a valid number';
        } else if (field === 'claimed_amount') {
          fieldMessages[field] = 'Claimed amount must be a valid number';
        } else {
          fieldMessages[field] = msg;
        }
      }
    }
    
    // If we have field-specific messages, return them
    const fieldNames = Object.keys(fieldMessages);
    if (fieldNames.length > 0) {
      // Return a combined message for all fields
      return fieldNames.map(field => fieldMessages[field]).join('; ');
    }
    
    // Fallback to joining all messages
    const messages = data.detail.map((err: any) => err.msg || 'Validation error').join(', ');
    return messages || 'Invalid input data';
  }
  
  // Handle FastAPI string detail errors
  if (typeof data?.detail === 'string') {
    return data.detail;
  }
  
  // Handle general error message
  if (typeof data?.message === 'string') {
    return data.message;
  }
  
  // Handle status text
  if (error.response.statusText) {
    return error.response.statusText;
  }
  
  // Fallback
  return 'An unexpected error occurred';
}