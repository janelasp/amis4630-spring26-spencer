import { describe, expect, it } from 'vitest';
import {
  validateCheckoutField,
  validateCheckoutForm,
  type CheckoutFormData,
} from './checkoutValidation';

describe('checkoutValidation', () => {
  it('validateCheckoutField returns required errors for blank values', () => {
    expect(validateCheckoutField('shippingAddress', '')).toBe('Shipping address is required.');
    expect(validateCheckoutField('city', '   ')).toBe('City is required.');
    expect(validateCheckoutField('state', '')).toBe('State is required.');
    expect(validateCheckoutField('zipCode', '')).toBe('Zip code is required.');
  });

  it('validateCheckoutField validates zip code format', () => {
    expect(validateCheckoutField('zipCode', '1234')).toBe('Zip code must be 5 digits.');
    expect(validateCheckoutField('zipCode', '12a45')).toBe('Zip code must be 5 digits.');
    expect(validateCheckoutField('zipCode', '12345')).toBeUndefined();
  });

  it('validateCheckoutForm returns an errors object keyed by invalid fields', () => {
    const data: CheckoutFormData = {
      shippingAddress: '1',
      city: '',
      state: '',
      zipCode: '999',
    };

    expect(validateCheckoutForm(data)).toEqual({
      shippingAddress: 'Shipping address must be at least 5 characters.',
      city: 'City is required.',
      state: 'State is required.',
      zipCode: 'Zip code must be 5 digits.',
    });
  });
});
