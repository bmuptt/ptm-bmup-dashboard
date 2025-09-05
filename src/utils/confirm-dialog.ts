import { ref } from 'vue';

interface ConfirmDialogOptions {
  title: string;
  html: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
}

export function useConfirmDialog() {
  const showDialog = ref(false);
  const dialogOptions = ref<ConfirmDialogOptions>({
    title: '',
    html: '',
    confirmButtonText: 'Save',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#f86f24',
  });

  let resolveFunction: ((value: boolean) => void) | null = null;

  const showConfirm = (options: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      dialogOptions.value = {
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#f86f24',
        ...options,
      };
      showDialog.value = true;
      resolveFunction = resolve;
    });
  };

  const handleConfirm = () => {
    if (resolveFunction) {
      resolveFunction(true);
      resolveFunction = null;
    }
  };

  const handleCancel = () => {
    if (resolveFunction) {
      resolveFunction(false);
      resolveFunction = null;
    }
  };

  return {
    showDialog,
    dialogOptions,
    showConfirm,
    handleConfirm,
    handleCancel,
  };
}

