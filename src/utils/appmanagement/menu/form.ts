import { helpers, required } from '@vuelidate/validators';

export const rules = {
  key_menu: {
    required: helpers.withMessage('Key Menu is Required', required),
    lowercaseNoSpace: helpers.withMessage(
      'Key Name must be lowercase and no space',
      (value: string) => {
        return /^[a-z]+$/.test(value) && !/\s/.test(value);
      }
    ),
  },
  name: {
    required: helpers.withMessage('Name is Required', required),
  },
};
