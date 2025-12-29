import { helpers, maxLength, required } from '@vuelidate/validators';

export const rules = {
  icon_id: {
    required: helpers.withMessage('Icon wajib dipilih', required),
  },
  title: {
    required: helpers.withMessage('Title wajib diisi', required),
    maxLength: helpers.withMessage('Title maksimal 255 karakter', maxLength(255)),
  },
  subtitle: {
    required: helpers.withMessage('Subtitle wajib diisi', required),
    maxLength: helpers.withMessage('Subtitle maksimal 500 karakter', maxLength(500)),
  },
};

