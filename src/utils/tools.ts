import { profile } from '@/service/auth';
import { useAppStore } from '@/stores/app';

export const getProfile = () => {
  const store = useAppStore();
  profile()
    .then(({ data }) => {
      store.addProfileGlobal(data);
    })
    .catch(() => {});
};
