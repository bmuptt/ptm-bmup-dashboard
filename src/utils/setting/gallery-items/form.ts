import { helpers, maxLength, required, requiredIf } from '@vuelidate/validators';

export const createRules = (requireImage: boolean) => {
  return {
    image: {
      required: helpers.withMessage('Gambar wajib diupload', requiredIf(() => requireImage)),
    },
    title: {
      required: helpers.withMessage('Title wajib diisi', required),
      maxLength: helpers.withMessage('Title maksimal 255 karakter', maxLength(255)),
    },
  };
};
