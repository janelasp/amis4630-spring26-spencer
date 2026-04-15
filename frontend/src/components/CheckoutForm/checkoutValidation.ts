export interface CheckoutFormData {
  shippingAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CheckoutFormErrors {
  shippingAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export const CHECKOUT_FIELD_NAMES: Array<keyof CheckoutFormData> = [
  'shippingAddress',
  'city',
  'state',
  'zipCode',
];

export function validateCheckoutField(
  fieldName: keyof CheckoutFormData,
  value: string,
): string | undefined {
  const trimmedValue = value.trim();

  switch (fieldName) {
    case 'shippingAddress':
      if (trimmedValue.length === 0) {
        return 'Shipping address is required.';
      }
      if (trimmedValue.length < 5) {
        return 'Shipping address must be at least 5 characters.';
      }
      return undefined;
    case 'city':
      if (trimmedValue.length === 0) {
        return 'City is required.';
      }
      return undefined;
    case 'state':
      if (trimmedValue.length === 0) {
        return 'State is required.';
      }
      return undefined;
    case 'zipCode':
      if (trimmedValue.length === 0) {
        return 'Zip code is required.';
      }
      if (!/^\d{5}$/.test(trimmedValue)) {
        return 'Zip code must be 5 digits.';
      }
      return undefined;
  }
}

export function validateCheckoutForm(data: CheckoutFormData): CheckoutFormErrors {
  const nextErrors: CheckoutFormErrors = {};

  CHECKOUT_FIELD_NAMES.forEach((fieldName) => {
    const fieldError = validateCheckoutField(fieldName, data[fieldName]);
    if (fieldError) {
      nextErrors[fieldName] = fieldError;
    }
  });

  return nextErrors;
}
