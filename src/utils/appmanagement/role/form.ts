import { helpers, required } from '@vuelidate/validators';

export const rules = {
  name: {
    required: helpers.withMessage('Name is Required', required),
  },
};
