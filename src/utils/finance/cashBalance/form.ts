import { helpers, minValue, required } from '@vuelidate/validators';

export const rules = {
  value: {
    required: helpers.withMessage('Nominal wajib diisi', required),
    minValue: helpers.withMessage('Nominal harus lebih dari 0', minValue(0.01)),
  },
  description: {
    required: helpers.withMessage('Deskripsi wajib diisi', required),
  },
};

