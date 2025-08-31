import { helpers, required } from '@vuelidate/validators';

export const rules = {
  name: {
    required: helpers.withMessage('Nama aplikasi wajib diisi', required),
  },
  description: {
    required: helpers.withMessage('Deskripsi wajib diisi', required),
  },
  address: {
    required: helpers.withMessage('Alamat wajib diisi', required),
  },
  primary_color: {
    required: helpers.withMessage('Warna utama wajib diisi', required),
  },
  secondary_color: {
    required: helpers.withMessage('Warna sekunder wajib diisi', required),
  },
};
