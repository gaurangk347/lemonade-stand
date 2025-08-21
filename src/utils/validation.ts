import { Customer, ValidationError, CustomerFormData } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10; // Only allow exactly 10 digits
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '').slice(0, 10); // Only take first 10 digits
  
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
  }
  
  return phone; // Return as is if not enough digits
};

export const validateStreetAddress = (street: string): boolean => {
  return street.trim().length >= 3;
};

export const validateCity = (city: string): boolean => {
  return city.trim().length >= 2;
};

export const validateState = (state: string): boolean => {
  return state.trim().length >= 2;
};

export const validateZipCode = (zipCode: string): boolean => {
  const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
  const cleanZip = zipCode.trim().toUpperCase();
  return canadianPostalRegex.test(cleanZip);
};

export const validateCountry = (country: string): boolean => {
  return country.trim().length >= 2;
};

// Check if any address fields are filled
export const hasAddressData = (formData: CustomerFormData): boolean => {
  return !!(formData.street || formData.city || formData.state || formData.zipCode || formData.country);
};

export const validateCustomerForm = (formData: CustomerFormData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Name validation
  if (!formData.name || !formData.name.trim()) {
    errors.push({
      field: 'name',
      message: 'Name is required'
    });
  } else if (!validateName(formData.name)) {
    errors.push({
      field: 'name',
      message: 'Name must be at least 2 characters long'
    });
  }
  
  // Contact validation - at least one required
  const hasEmail = formData.email && formData.email.trim();
  const hasPhone = formData.phone && formData.phone.trim();
  
  if (!hasEmail && !hasPhone) {
    errors.push({
      field: 'general',
      message: 'Either email or phone number is required'
    });
  }
  
  // Email validation (if provided)
  if (hasEmail && !validateEmail(formData.email.trim())) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address'
    });
  }
  
  // Phone validation (if provided)
  if (hasPhone && !validatePhone(formData.phone)) {
    errors.push({
      field: 'phone',
      message: 'Please enter a valid phone number'
    });
  }
  
  // Address validation - if any address field is filled, validate all required fields
  const hasAddress = hasAddressData(formData);
  
  if (hasAddress) {
    // If user starts filling address, require street, city, state, and zipCode
    if (!formData.street || !formData.street.trim()) {
      errors.push({
        field: 'street',
        message: 'Street address is required when providing delivery address'
      });
    } else if (!validateStreetAddress(formData.street)) {
      errors.push({
        field: 'street',
        message: 'Street address must be at least 3 characters long'
      });
    }
    
    if (!formData.city || !formData.city.trim()) {
      errors.push({
        field: 'city',
        message: 'City is required when providing delivery address'
      });
    } else if (!validateCity(formData.city)) {
      errors.push({
        field: 'city',
        message: 'City must be at least 2 characters long'
      });
    }
    
    if (!formData.state || !formData.state.trim()) {
      errors.push({
        field: 'state',
        message: 'State/Province is required when providing delivery address'
      });
    } else if (!validateState(formData.state)) {
      errors.push({
        field: 'state',
        message: 'State/Province must be at least 2 characters long'
      });
    }
    
    if (!formData.zipCode || !formData.zipCode.trim()) {
      errors.push({
        field: 'zipCode',
        message: 'ZIP/Postal code is required when providing delivery address'
      });
    } else if (!validateZipCode(formData.zipCode)) {
      errors.push({
        field: 'zipCode',
        message: 'Please enter a valid ZIP/Postal code (e.g., 12345 or A1B 2C3)'
      });
    }
    
    // Country is optional but validated if provided
    if (formData.country && formData.country.trim() && !validateCountry(formData.country)) {
      errors.push({
        field: 'country',
        message: 'Country must be at least 2 characters long'
      });
    }
  }
  
  return errors;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const calculateItemSubtotal = (price: number, quantity: number): number => {
  return Math.round((price * quantity) * 100) / 100;
};

export const calculateOrderTotal = (items: Array<{ subtotal: number }>): number => {
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  return Math.round(total * 100) / 100;
};

export const sanitizeCustomerData = (customer: Customer): Customer => {
  return {
    name: customer.name?.trim() || '',
    email: customer.email?.trim() || undefined,
    phone: customer.phone?.replace(/[^\d\s\-\(\)\+]/g, '') || undefined,
    address: customer.address ? {
      street: customer.address.street?.trim() || '',
      city: customer.address.city?.trim() || '',
      state: customer.address.state?.trim() || '',
      zipCode: customer.address.zipCode?.trim() || '',
      country: customer.address.country?.trim() || undefined
    } : undefined
  };
};

// Helper function to convert form data to Customer format
export const formDataToCustomer = (formData: CustomerFormData): Customer => {
  if (!formData) {
    return { name: '', email: '', phone: '' };
  }
  
  const hasAddress = hasAddressData(formData);
  
  return {
    name: formData.name || '',
    email: formData.email || undefined,
    phone: formData.phone || undefined,
    address: hasAddress ? {
      street: formData.street || '',
      city: formData.city || '',
      state: formData.state || '',
      zipCode: formData.zipCode || '',
      country: formData.country || undefined
    } : undefined
  };
};

// Helper function to convert Customer to form data format
export const customerToFormData = (customer: Customer = { name: '', email: '', phone: '' }): CustomerFormData => {
  return {
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    street: customer?.address?.street || '',
    city: customer?.address?.city || '',
    state: customer?.address?.state || '',
    zipCode: customer?.address?.zipCode || '',
    country: customer?.address?.country || ''
  };
};