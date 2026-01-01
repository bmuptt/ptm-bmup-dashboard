import { helpers, maxLength, minValue, required } from '@vuelidate/validators';

export const rules = {
  year: {
    required: helpers.withMessage('Year wajib diisi', required),
    minValue: helpers.withMessage('Year minimal 1900', minValue(1900)),
  },
  title: {
    required: helpers.withMessage('Title wajib diisi', required),
    maxLength: helpers.withMessage('Title maksimal 255 karakter', maxLength(255)),
  },
  description: {
    required: helpers.withMessage('Deskripsi wajib diisi', required),
    maxLength: helpers.withMessage('Deskripsi maksimal 2000 karakter', maxLength(2000)),
  },
};

