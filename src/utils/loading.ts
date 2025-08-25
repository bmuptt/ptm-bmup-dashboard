import { reactive, computed } from 'vue';

export function useLoading() {
  const dataLoading = {
    data: false,
    submit: false,
  };

  const loading = reactive({
    ...dataLoading,
  });

  const resultLoading = computed(() => {
    let result = false;
    Object.keys(dataLoading).forEach((key) => {
      if (loading[key as keyof typeof dataLoading]) {
        result = true;
      }
    });
    return result;
  });

  return {
    loading,
    resultLoading,
  };
}

export function useLoadingComponent() {
  const dataLoading = {
    data: false,
    submit: false,
    role: false,
    permission: false,
    structureMenu: false
  };

  const loading = reactive({
    ...dataLoading,
  });

  const resultLoading = computed(() => {
    let result = false;
    Object.keys(dataLoading).forEach((key) => {
      if (loading[key as keyof typeof dataLoading]) {
        result = true;
      }
    });
    return result;
  });

  return {
    loading,
    resultLoading,
  };
}

export function useLoadingForm() {
  const dataLoading = {
    data: false,
    submit: false
  };

  const loading = reactive({
    ...dataLoading,
  });

  const resultLoading = computed(() => {
    let result = false;
    Object.keys(dataLoading).forEach((key) => {
      if (loading[key as keyof typeof dataLoading]) {
        result = true;
      }
    });
    return result;
  });

  return {
    loading,
    resultLoading,
  };
}
