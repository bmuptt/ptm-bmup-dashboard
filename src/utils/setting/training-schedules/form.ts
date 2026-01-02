import { helpers, maxLength, required } from '@vuelidate/validators';

const isTimeValueValid = (value: string) => {
  if (!value) return false;
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value);
};

const toTimeSeconds = (value: string) => {
  const parts = value.split(':');
  const hh = Number(parts[0] ?? 0);
  const mm = Number(parts[1] ?? 0);
  const ss = Number(parts[2] ?? 0);
  return hh * 3600 + mm * 60 + ss;
};

export const rules = {
  day_of_week: {
    required: helpers.withMessage('Hari wajib diisi', required),
    validRange: helpers.withMessage('Hari tidak valid', (value: number) => {
      if (typeof value !== 'number') return false;
      return value >= 1 && value <= 7;
    }),
  },
  start_time: {
    required: helpers.withMessage('Start time wajib diisi', required),
    timeFormat: helpers.withMessage('Format start time tidak valid', isTimeValueValid),
  },
  end_time: {
    required: helpers.withMessage('End time wajib diisi', required),
    timeFormat: helpers.withMessage('Format end time tidak valid', isTimeValueValid),
    greaterThanStart: helpers.withMessage(
      'End time harus lebih besar dari start time',
      (value: string, state: { start_time?: string }) => {
        if (!isTimeValueValid(value) || !isTimeValueValid(state.start_time || '')) return true;
        return toTimeSeconds(value) > toTimeSeconds(state.start_time || '');
      }
    ),
  },
  category: {
    required: helpers.withMessage('Category wajib diisi', required),
    maxLength: helpers.withMessage('Category maksimal 100 karakter', maxLength(100)),
  },
};
