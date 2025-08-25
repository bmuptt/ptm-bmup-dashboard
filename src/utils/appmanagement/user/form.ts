import { email, helpers, required } from '@vuelidate/validators';

export const rules = {
  name: {
    required: helpers.withMessage('Name is Required', required),
  },
  email: {
    required: helpers.withMessage('Email is Required', required),
    email: helpers.withMessage('Must e-mail format', email),
  },
  role: {
    required: helpers.withMessage('Role is Required', required),
  },
};
