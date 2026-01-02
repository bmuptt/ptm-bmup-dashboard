import { helpers, maxLength, minValue, required } from '@vuelidate/validators';

export const rules = {
  member_id: {
    required: helpers.withMessage('Member wajib diisi', required),
    minValue: helpers.withMessage('Member tidak valid', minValue(1)),
  },
  role: {
    required: helpers.withMessage('Role wajib diisi', required),
    maxLength: helpers.withMessage('Role maksimal 120 karakter', maxLength(120)),
  },
};

