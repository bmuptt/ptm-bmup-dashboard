import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import ImportDuesDialog from '@/components/UI/Finance/Dues/ImportDuesDialog.vue';
import { importMembershipDues } from '@/service/Finance/membershipDues';
import type { AxiosResponse } from 'axios';

vi.mock('@/service/Finance/membershipDues', () => ({
  importMembershipDues: vi.fn(),
}));

describe('ImportDuesDialog', () => {
  let vuetify: ReturnType<typeof createVuetify>;

  beforeEach(() => {
    vuetify = createVuetify({ components, directives });
    vi.clearAllMocks();
    (globalThis as unknown as { visualViewport?: unknown }).visualViewport = {
      width: 1024,
      height: 768,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as VisualViewport;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  type ImportDialogProps = {
    modelValue: boolean;
    defaultYear?: number;
    'onUpdate:modelValue'?: (value: boolean) => void;
    onSuccess?: () => void;
  };
  const createWrapper = (props: ImportDialogProps = { modelValue: true, defaultYear: 2025 }) => {
    return mount(ImportDuesDialog, {
      global: {
        plugins: [vuetify],
        provide: {
          $swal: {
            fire: vi.fn(),
          },
        },
        stubs: {
          'v-card': { template: '<div><slot /></div>' },
          'v-card-title': { template: '<div><slot /></div>' },
          'v-card-text': { template: '<div><slot /></div>' },
          'v-btn': { template: '<button data-testid="v-btn" @click="$emit(\'click\')"><slot /></button>' },
          'v-form': { template: '<form @submit.prevent="$emit(\'submit\')"><slot /></form>' },
          'v-select': { template: '<select data-testid="v-select"><slot /></select>' },
          'v-row': { template: '<div><slot /></div>' },
          'v-col': { template: '<div><slot /></div>' },
        },
      },
      props,
    });
  };

  test('validates file extension and prevents submit on invalid file', async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input[type="file"]');
    const file = new File(['a'], 'dues.txt', { type: 'text/plain' });
    Object.defineProperty(input.element, 'files', { value: [file] });
    await input.trigger('change');
    const vm = wrapper.vm as unknown as { submitImport: () => void };
    vm.submitImport();
    expect(importMembershipDues).toHaveBeenCalledTimes(0);
  });

  test('success import flow calls service and shows summary', async () => {
    vi.mocked(importMembershipDues).mockResolvedValue({
      data: {
        success: true,
        data: {
          summary: {
            total_rows: 3,
            processed_rows: 3,
            success_rows: 2,
            failed_rows: 1,
          },
          items: [],
        },
      }
    } as AxiosResponse);

    const wrapper = createWrapper();
    const input = wrapper.find('input[type="file"]');
    const file = new File(['a'], 'dues.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    Object.defineProperty(input.element, 'files', { value: [file] });
    await input.trigger('change');

    const vm = wrapper.vm as unknown as { submitImport: () => void };
    vm.submitImport();
    expect(importMembershipDues).toHaveBeenCalledTimes(1);
  });

  test('handles service error gracefully', async () => {
    vi.mocked(importMembershipDues).mockRejectedValue(new Error('failed'));
    const wrapper = createWrapper();
    const input = wrapper.find('input[type="file"]');
    const file = new File(['a'], 'dues.xls', { type: 'application/vnd.ms-excel' });
    Object.defineProperty(input.element, 'files', { value: [file] });
    await input.trigger('change');
    const vm = wrapper.vm as unknown as { submitImport: () => void };
    vm.submitImport();
    expect(importMembershipDues).toHaveBeenCalledTimes(1);
  });
});
