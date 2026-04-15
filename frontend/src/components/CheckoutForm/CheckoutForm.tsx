import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../contexts/CartContext';
import { ApiError } from '../../services/apiClient';
import { createOrderFromCart } from '../../services/orderService';
import styles from './CheckoutForm.module.css';

interface CheckoutFormData {
  shippingAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

interface CheckoutFormErrors {
  shippingAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

const INITIAL_FORM_DATA: CheckoutFormData = {
  shippingAddress: '',
  city: '',
  state: '',
  zipCode: '',
};

const FIELD_NAMES: Array<keyof CheckoutFormData> = [
  'shippingAddress',
  'city',
  'state',
  'zipCode',
];

const US_STATES = ['OH', 'CA', 'NY', 'TX', 'FL'];

export function CheckoutForm() {
  const navigate = useNavigate();
  const { state, cartTotal, cartItemCount, dispatch } = useCartContext();
  const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateField = (
    fieldName: keyof CheckoutFormData,
    value: string,
  ): string | undefined => {
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
  };

  const validateAllFields = (data: CheckoutFormData): CheckoutFormErrors => {
    const nextErrors: CheckoutFormErrors = {};

    FIELD_NAMES.forEach((fieldName) => {
      const fieldError = validateField(fieldName, data[fieldName]);
      if (fieldError) {
        nextErrors[fieldName] = fieldError;
      }
    });

    return nextErrors;
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    const key = name as keyof CheckoutFormData;

    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSubmitError(null);
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    const key = name as keyof CheckoutFormData;

    setTouchedFields((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });

    const fieldError = validateField(key, value);
    setErrors((prev) => ({
      ...prev,
      [key]: fieldError,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError(null);

    if (cartItemCount === 0) {
      setSubmitError('Your cart is empty.');
      return;
    }

    const nextErrors = validateAllFields(formData);
    const hasErrors = Object.keys(nextErrors).length > 0;

    if (hasErrors) {
      setErrors(nextErrors);
      setTouchedFields(new Set(FIELD_NAMES));
      return;
    }

    setErrors({});
    setIsProcessing(true);

    try {
      const shippingAddress = `${formData.shippingAddress.trim()}, ${formData.city.trim()}, ${formData.state.trim()} ${formData.zipCode.trim()}`;
      const created = await createOrderFromCart({ shippingAddress });

      dispatch({
        type: 'SET_CART_FROM_SERVER',
        payload: { items: [] },
      });

      setFormData(INITIAL_FORM_DATA);
      setTouchedFields(new Set());
      navigate(`/order-confirmation/${created.id}`, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Failed to place order. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getFieldError = (fieldName: keyof CheckoutFormData): string | undefined => {
    if (!touchedFields.has(fieldName)) {
      return undefined;
    }

    return errors[fieldName];
  };

  const isCartEmpty = cartItemCount === 0;
  const isSubmitDisabled = isCartEmpty || isProcessing;

  return (
    <section id="checkout" className={styles.checkoutSection} aria-label="Checkout form">
      <h3 className={styles.heading}>Checkout</h3>
      <p className={styles.subheading}>
        {cartItemCount} item{cartItemCount === 1 ? '' : 's'} · ${cartTotal.toFixed(2)}
      </p>

      <section className={styles.summaryCard} aria-label="Order summary">
        <h4 className={styles.summaryHeading}>Order Summary</h4>
        {state.items.length === 0 ? (
          <p className={styles.emptySummary}>Your cart is empty.</p>
        ) : (
          <ul className={styles.summaryList} aria-label="Summary items">
            {state.items.map((item) => (
              <li key={item.productId} className={styles.summaryRow}>
                <span className={styles.summaryName}>{item.productName}</span>
                <span className={styles.summaryQty}>×{item.quantity}</span>
                <span className={styles.summaryTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.summaryFooter} aria-label="Summary total">
          <span className={styles.summaryLabel}>Total</span>
          <span className={styles.summaryAmount}>${cartTotal.toFixed(2)}</span>
        </div>
      </section>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.fieldGroup}>
          <label htmlFor="shippingAddress" className={styles.label}>
            Shipping Address
          </label>
          <input
            id="shippingAddress"
            name="shippingAddress"
            type="text"
            className={styles.input}
            value={formData.shippingAddress}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
            minLength={5}
            aria-label="Shipping Address"
            aria-invalid={Boolean(getFieldError('shippingAddress'))}
            aria-describedby={getFieldError('shippingAddress') ? 'shippingAddress-error' : undefined}
          />
          {getFieldError('shippingAddress') && (
            <p id="shippingAddress-error" className={styles.errorText} role="alert">
              {getFieldError('shippingAddress')}
            </p>
          )}
        </div>

        <div className={styles.gridRow}>
          <div className={styles.fieldGroup}>
            <label htmlFor="city" className={styles.label}>
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              className={styles.input}
              value={formData.city}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              aria-label="City"
              aria-invalid={Boolean(getFieldError('city'))}
              aria-describedby={getFieldError('city') ? 'city-error' : undefined}
            />
            {getFieldError('city') && (
              <p id="city-error" className={styles.errorText} role="alert">
                {getFieldError('city')}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="state" className={styles.label}>
              State
            </label>
            <select
              id="state"
              name="state"
              className={styles.select}
              value={formData.state}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              aria-label="State"
              aria-invalid={Boolean(getFieldError('state'))}
              aria-describedby={getFieldError('state') ? 'state-error' : undefined}
            >
              <option value="">Select state</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {getFieldError('state') && (
              <p id="state-error" className={styles.errorText} role="alert">
                {getFieldError('state')}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="zipCode" className={styles.label}>
              Zip Code
            </label>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              inputMode="numeric"
              className={styles.input}
              value={formData.zipCode}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
              aria-label="Zip Code"
              aria-invalid={Boolean(getFieldError('zipCode'))}
              aria-describedby={getFieldError('zipCode') ? 'zipCode-error' : undefined}
            />
            {getFieldError('zipCode') && (
              <p id="zipCode-error" className={styles.errorText} role="alert">
                {getFieldError('zipCode')}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          aria-label="Place order"
          disabled={isSubmitDisabled}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </button>

        {submitError && (
          <p className={styles.errorText} role="alert" aria-label="Checkout submit error">
            {submitError}
          </p>
        )}
      </form>
    </section>
  );
}