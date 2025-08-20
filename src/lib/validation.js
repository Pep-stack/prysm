// Validation utilities for auth forms

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

export const validatePassword = (password) => {
  if (!password) {
    return { 
      isValid: false, 
      message: 'Password is required', 
      strength: 0,
      strengthText: 'Very Weak',
      suggestions: {
        needsLength: true,
        needsLowercase: true,
        needsUppercase: true,
        needsNumbers: true,
        needsSpecialChars: true
      }
    };
  }
  if (password.length < 6) {
    return { 
      isValid: false, 
      message: 'Password must be at least 6 characters long', 
      strength: 1,
      strengthText: 'Very Weak',
      suggestions: {
        needsLength: password.length < 8,
        needsLowercase: !/[a-z]/.test(password),
        needsUppercase: !/[A-Z]/.test(password),
        needsNumbers: !/\d/.test(password),
        needsSpecialChars: !/[!@#$%^&*(),.?":{}|<>]/.test(password)
      }
    };
  }
  
  // Calculate password strength
  let strength = 0;
  const checks = [
    password.length >= 8, // Length check
    /[a-z]/.test(password), // Lowercase
    /[A-Z]/.test(password), // Uppercase
    /\d/.test(password), // Numbers
    /[!@#$%^&*(),.?":{}|<>]/.test(password) // Special characters
  ];
  
  strength = checks.filter(Boolean).length;
  
  let message = '';
  let strengthText = '';
  
  switch (strength) {
    case 0:
    case 1:
      strengthText = 'Very Weak';
      message = 'Password is too weak';
      break;
    case 2:
      strengthText = 'Weak';
      message = 'Consider adding uppercase letters, numbers, or special characters';
      break;
    case 3:
      strengthText = 'Fair';
      message = 'Good! Consider adding more character types for better security';
      break;
    case 4:
      strengthText = 'Good';
      message = 'Strong password! Consider adding special characters';
      break;
    case 5:
      strengthText = 'Excellent';
      message = 'Excellent password strength!';
      break;
    default:
      strengthText = 'Unknown';
  }
  
  return { 
    isValid: password.length >= 6, 
    message, 
    strength, 
    strengthText,
    suggestions: {
      needsLength: password.length < 8,
      needsLowercase: !/[a-z]/.test(password),
      needsUppercase: !/[A-Z]/.test(password),
      needsNumbers: !/\d/.test(password),
      needsSpecialChars: !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  };
};

export const validatePasswordConfirm = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  return { isValid: true, message: 'Passwords match' };
};

export const validateName = (name, fieldName = 'Name') => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: `${fieldName} must be at least 2 characters long` };
  }
  if (name.length > 50) {
    return { isValid: false, message: `${fieldName} must be less than 50 characters` };
  }
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return { isValid: false, message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  return { isValid: true, message: '' };
};

// Utility function to get password strength color
export const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 0:
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-orange-500';
    case 3:
      return 'bg-yellow-500';
    case 4:
      return 'bg-blue-500';
    case 5:
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
};

// Utility function to get validation input border color
export const getValidationBorderColor = (isValid, hasValue) => {
  if (!hasValue) return 'border-gray-300';
  return isValid ? 'border-green-300' : 'border-red-300';
};

// Utility function to get validation input focus ring color
export const getValidationFocusColor = (isValid, hasValue) => {
  if (!hasValue) return 'focus:ring-[#00C896] focus:border-[#00C896]';
  return isValid ? 'focus:ring-green-500 focus:border-green-500' : 'focus:ring-red-500 focus:border-red-500';
};
