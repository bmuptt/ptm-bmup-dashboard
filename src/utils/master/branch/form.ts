import { helpers, required, minLength, maxLength } from '@vuelidate/validators';

export const rules = {
  code: {
    required: helpers.withMessage('Code is required', required),
    minLength: helpers.withMessage('Code must be at least 2 characters', minLength(2)),
    maxLength: helpers.withMessage('Code must not exceed 2 characters', maxLength(2)),
  },
  name: {
    required: helpers.withMessage('Name is required', required),
    minLength: helpers.withMessage('Name must be at least 2 characters', minLength(2)),
    maxLength: helpers.withMessage('Name must not exceed 255 characters', maxLength(255)),
  },
  alamat: {
    required: helpers.withMessage('Address is required', required),
    minLength: helpers.withMessage('Address must be at least 2 characters', minLength(2)),
    maxLength: helpers.withMessage('Address must not exceed 255 characters', maxLength(255)),
  },
  phone: {
    required: helpers.withMessage('Phone is required', required),
    minLength: helpers.withMessage('Phone must be at least 8 characters', minLength(8)),
    maxLength: helpers.withMessage('Phone must not exceed 20 characters', maxLength(20)),
  },
  logo: {
    // Optional field, no validation required
  },
  pic_id: {
    // Optional field, no validation required
  },
};
