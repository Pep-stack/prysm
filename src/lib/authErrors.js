// Auth error handling utilities

export const getAuthErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred';
  
  const message = error.message || error.toString();
  
  // Supabase specific errors
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (message.includes('User already registered') || message.includes('already registered')) {
    return 'An account with this email already exists. Please try logging in instead.';
  }
  
  if (message.includes('Password should be at least 6 characters')) {
    return 'Password must be at least 6 characters long.';
  }
  
  if (message.includes('Unable to validate email address')) {
    return 'Please enter a valid email address.';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Please check your email and click the verification link before logging in.';
  }
  
  if (message.includes('Invalid email')) {
    return 'Please enter a valid email address.';
  }
  
  if (message.includes('Email address not authorized')) {
    return 'This email address is not authorized to create an account.';
  }
  
  if (message.includes('Too many requests')) {
    return 'Too many attempts. Please wait a few minutes before trying again.';
  }
  
  if (message.includes('Token has expired')) {
    return 'The verification link has expired. Please request a new one.';
  }
  
  if (message.includes('Invalid token')) {
    return 'The verification link is invalid. Please request a new one.';
  }
  
  if (message.includes('Network request failed')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  if (message.includes('Failed to fetch')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  // Password reset specific errors
  if (message.includes('User not found')) {
    return 'No account found with this email address.';
  }
  
  if (message.includes('Password is too weak')) {
    return 'Please choose a stronger password with at least 6 characters.';
  }
  
  // Session/auth state errors
  if (message.includes('No active session')) {
    return 'Your session has expired. Please log in again.';
  }
  
  if (message.includes('Unauthorized')) {
    return 'You are not authorized to perform this action.';
  }
  
  // Signup specific errors
  if (message.includes('Signup disabled')) {
    return 'Account registration is temporarily disabled. Please try again later.';
  }
  
  if (message.includes('Email sending failed')) {
    return 'Unable to send verification email. Please try again or contact support.';
  }
  
  // Generic fallbacks
  if (message.includes('400')) {
    return 'Invalid request. Please check your information and try again.';
  }
  
  if (message.includes('500')) {
    return 'Server error. Please try again later or contact support.';
  }
  
  if (message.includes('503')) {
    return 'Service temporarily unavailable. Please try again in a few minutes.';
  }
  
  // Return original message if no specific handling found
  return message;
};

export const getSuccessMessage = (action) => {
  switch (action) {
    case 'signup':
      return 'Account created successfully! Please check your email to verify your account.';
    case 'login':
      return 'Welcome back! You have been logged in successfully.';
    case 'logout':
      return 'You have been logged out successfully.';
    case 'password_reset_sent':
      return 'Password reset email sent! Please check your inbox.';
    case 'password_updated':
      return 'Password updated successfully! You can now log in with your new password.';
    case 'email_verified':
      return 'Email verified successfully! You can now log in to your account.';
    case 'profile_updated':
      return 'Profile updated successfully!';
    default:
      return 'Action completed successfully!';
  }
};

// Utility to check if an error is retryable
export const isRetryableError = (error) => {
  if (!error) return false;
  
  const message = error.message || error.toString();
  
  const retryableErrors = [
    'Network request failed',
    'Failed to fetch',
    'Too many requests',
    '500',
    '503',
    'timeout'
  ];
  
  return retryableErrors.some(retryError => 
    message.toLowerCase().includes(retryError.toLowerCase())
  );
};

// Utility to get user-friendly field names
export const getFieldDisplayName = (fieldName) => {
  const displayNames = {
    email: 'Email address',
    password: 'Password',
    confirmPassword: 'Password confirmation',
    firstName: 'First name',
    lastName: 'Last name',
    name: 'Name'
  };
  
  return displayNames[fieldName] || fieldName;
};
