import { email, helpers, required, maxLength } from '@vuelidate/validators';

export const rules = {
  name: {
    required: helpers.withMessage('Name is Required', required),
    maxLength: helpers.withMessage('Name must not exceed 255 characters', maxLength(255)),
  },
  email: {
    email: helpers.withMessage('Must be valid email format', email),
    maxLength: helpers.withMessage('Email must not exceed 255 characters', maxLength(255)),
  },
  gender: {
    required: helpers.withMessage('Gender is Required', required),
  },
  birthdate: {
    required: helpers.withMessage('Birthdate is Required', required),
  },
  address: {
    required: helpers.withMessage('Address is Required', required),
    maxLength: helpers.withMessage('Address must not exceed 500 characters', maxLength(500)),
  },
  phone: {
    required: helpers.withMessage('Phone is Required', required),
    maxLength: helpers.withMessage('Phone must not exceed 20 characters', maxLength(20)),
  },
};
