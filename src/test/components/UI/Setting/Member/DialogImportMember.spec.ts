import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DialogImportMember from '@/components/UI/Setting/Member/DialogImportMember.vue';
import { importExcel } from '@/service/Setting/member';
import type { AxiosResponse } from 'axios';

vi.mock('@/service/Setting/member', () => ({
  importExcel: vi.fn(),
}));

vi.mock('@/utils/setting/member/import-utils', () => ({
  validateHeaders: vi.fn(),
  validateRows: vi.fn(),
}));

describe('DialogImportMember', () => {
  let vuetify: ReturnType<typeof createVuetify>;

  beforeEach(() => {
    vuetify = createVuetify({ components, directives });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = () => {
    return mount(DialogImportMember, {
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
          'v-card-actions': { template: '<div><slot /></div>' },
          'v-btn': { template: '<button data-testid="v-btn" @click="$emit(\'click\')"><slot /></button>' },
          'v-form': { template: '<form @submit.prevent="$emit(\'submit\')"><slot /></form>' },
          'v-spacer': { template: '<div></div>' },
        },
      },
      props: { modelValue: true },
    });
  };

  test('shows error when headers invalid', async () => {
    const { validateHeaders } = await import('@/utils/setting/member/import-utils');
    vi.mocked(validateHeaders).mockReturnValue({ valid: false, missing: ['name'], unknown: [], headerRow: [] });
    const wrapper = createWrapper();
    const input = wrapper.find('input[type="file"]');
    const file = new File(['a'], 'members.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    Object.defineProperty(input.element, 'files', { value: [file] });
    await input.trigger('change');
    const frMock = {
      onload: null as ((ev?: ProgressEvent<FileReader>) => void) | null,
      onerror: null as ((ev?: ProgressEvent<FileReader>) => void) | null,
      readAsArrayBuffer: vi.fn(function (this: FileReader) {
        const self = this as unknown as typeof frMock;
        if (self.onload) self.onload({} as ProgressEvent<FileReader>);
      }),
      result: new ArrayBuffer(8),
    };
    vi.spyOn(window as unknown as { FileReader: typeof FileReader }, 'FileReader').mockImplementation(() => frMock as unknown as FileReader);
    const vm = wrapper.vm as unknown as { submitImport: () => void };
    vm.submitImport();
    expect(validateHeaders).toHaveBeenCalledTimes(1);
  });

  test('success import flow calls service and shows success', async () => {
    const { validateHeaders, validateRows } = await import('@/utils/setting/member/import-utils');
    vi.mocked(validateHeaders).mockReturnValue({ valid: true, missing: [], unknown: [], headerRow: [] });
    vi.mocked(validateRows).mockReturnValue({ errors: [], duplicates: [], total: 2 });
    vi.mocked(importExcel).mockResolvedValue({
      data: { message: 'Import OK' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    } as AxiosResponse);
    const wrapper = createWrapper();
    const file = new File(['a'], 'members.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [file] });
    await input.trigger('change');
    // Mock FileReader
    const frMock = {
      onload: null as ((ev?: ProgressEvent<FileReader>) => void) | null,
      onerror: null as ((ev?: ProgressEvent<FileReader>) => void) | null,
      readAsArrayBuffer: vi.fn(function (this: FileReader) {
        const self = this as unknown as typeof frMock;
        if (self.onload) self.onload({} as ProgressEvent<FileReader>);
      }),
      result: new ArrayBuffer(8),
    };
    vi.spyOn(window as unknown as { FileReader: typeof FileReader }, 'FileReader').mockImplementation(() => frMock as unknown as FileReader);
    const vm = wrapper.vm as unknown as { submitImport: () => void };
    vm.submitImport();
    expect(importExcel).toHaveBeenCalledTimes(1);
  });

  test('shows error when duplicates found', async () => {
    const { validateHeaders, validateRows } = await import('@/utils/setting/member/import-utils');
    vi.mocked(validateHeaders).mockReturnValue({ valid: true, missing: [], unknown: [], headerRow: [] });
    vi.mocked(validateRows).mockReturnValue({ errors: [], duplicates: ['dupuser'], total: 2 });
    const wrapper = createWrapper();
    const file = new File(['a'], 'members.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [file] });
    await input.trigger('change');
    const frMock = {
      onload: null as ((ev?: ProgressEvent<FileReader>) => void) | null,
      onerror: null as ((ev?: ProgressEvent<FileReader>) => void) | null,
      readAsArrayBuffer: vi.fn(function (this: FileReader) {
        const self = this as unknown as typeof frMock;
        if (self.onload) self.onload({} as ProgressEvent<FileReader>);
      }),
      result: new ArrayBuffer(8),
    };
    vi.spyOn(window as unknown as { FileReader: typeof FileReader }, 'FileReader').mockImplementation(() => frMock as unknown as FileReader);
    const vm = wrapper.vm as unknown as { submitImport: () => void };
    vm.submitImport();
    expect(importExcel).toHaveBeenCalledTimes(0);
  });

  test('shows error when required fields missing', async () => {
    const { validateHeaders, validateRows } = await import('@/utils/setting/member/import-utils');
    vi.mocked(validateHeaders).mockReturnValue({ valid: true, missing: [], unknown: [], headerRow: [] });
    vi.mocked(validateRows).mockReturnValue({ errors: ['Row 2: name is required'], duplicates: [], total: 2 });
    const wrapper = createWrapper();
    const file = new File(['a'], 'members.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', { value: [file] });
    await input.trigger('change');
    const frMock = {
      onload: null as ((ev?: ProgressEvent<FileReader>) => void) | null,
      onerror: null as ((ev?: ProgressEvent<FileReader>) => void) | null,
      readAsArrayBuffer: vi.fn(function (this: FileReader) {
        const self = this as unknown as typeof frMock;
        if (self.onload) self.onload({} as ProgressEvent<FileReader>);
      }),
      result: new ArrayBuffer(8),
    };
    vi.spyOn(window as unknown as { FileReader: typeof FileReader }, 'FileReader').mockImplementation(() => frMock as unknown as FileReader);
    const vm = wrapper.vm as unknown as { submitImport: () => void };
    vm.submitImport();
    expect(importExcel).toHaveBeenCalledTimes(0);
  });
});
