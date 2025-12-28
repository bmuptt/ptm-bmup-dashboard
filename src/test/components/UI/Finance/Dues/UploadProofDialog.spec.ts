import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import UploadProofDialog from '@/components/UI/Finance/Dues/UploadProofDialog.vue';
import { uploadMembershipDuesProof, getMembershipDuesDetail } from '@/service/Finance/membershipDues';
import type { IUploadProofDialogData, IMembershipDuesDetailResponse } from '@/model/finance-interface';
import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from 'axios';

vi.mock('@/service/Finance/membershipDues', () => ({
  uploadMembershipDuesProof: vi.fn(),
  getMembershipDuesDetail: vi.fn(),
}));

describe('UploadProofDialog Component', () => {
  let wrapper: VueWrapper;
  let vuetify: ReturnType<typeof createVuetify>;

  beforeEach(() => {
    vuetify = createVuetify({ components, directives });
    vi.clearAllMocks();
    // Mock visualViewport used by Vuetify VOverlay
    (globalThis as unknown as { visualViewport?: unknown }).visualViewport = {
      width: 1024,
      height: 768,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as VisualViewport;
  });

  afterEach(() => { wrapper && wrapper.unmount(); });

  const data: IUploadProofDialogData = {
    membership_dues_id: 123,
    member_name: 'Member One',
    month: 1,
    period_year: 2025,
    current_status: 'paid',
  };

  const createWrapper = (modelValue = true) => mount(UploadProofDialog, {
    props: { modelValue, data },
    global: { plugins: [vuetify] },
  });

  const mockAxiosResponseDetail = (proofPath: string | null = null): AxiosResponse<IMembershipDuesDetailResponse> => ({
    data: {
      success: true,
      message: 'ok',
      data: {
        membership_dues: {
          id: 123,
          member_id: 1,
          amount: 100000,
          status: 'paid',
          due_date: '2024-06-01T00:00:00.000Z',
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
          proof_file_path: proofPath,
        },
        member: {
          id: 1,
          name: 'Member One',
          username: 'memberone',
          gender: 'Male',
          birthdate: '1990-01-01T00:00:00.000Z',
          address: 'Test Address',
          phone: '081234567890',
          photo: null,
          active: true,
        },
      },
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: {} as AxiosRequestHeaders } as InternalAxiosRequestConfig,
  });

  test('submits dengan file (replace proof)', async () => {
    vi.mocked(getMembershipDuesDetail).mockResolvedValue(mockAxiosResponseDetail('http://example.com/proof.jpg'));
    vi.mocked(uploadMembershipDuesProof).mockResolvedValue({
      data: { data: { message: 'ok' } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as AxiosRequestHeaders } as InternalAxiosRequestConfig,
    });
    wrapper = createWrapper();

    const file = new File([new Blob(['dummy'])], 'proof.jpg', { type: 'image/jpeg' });
    // Set internal file state
    (wrapper.vm as unknown as Record<string, unknown>).file = file;
    (wrapper.vm as unknown as Record<string, unknown>).statusFile = 1;

    // Submit
    const submitFn = (wrapper.vm as unknown as { submit?: () => Promise<void> }).submit;
    await submitFn?.();

    expect(uploadMembershipDuesProof).toHaveBeenCalledWith(123, expect.objectContaining({
      status_file: 1,
      proof_file: file,
    }));

    // Emits success
    const emitted = wrapper.emitted('success');
    expect(emitted).toBeTruthy();
  });

  test('submits delete (status_file=1 tanpa file)', async () => {
    vi.mocked(getMembershipDuesDetail).mockResolvedValue(mockAxiosResponseDetail(null));
    vi.mocked(uploadMembershipDuesProof).mockResolvedValue({
      data: { data: { message: 'ok' } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as AxiosRequestHeaders } as InternalAxiosRequestConfig,
    });
    wrapper = createWrapper();

    // Ensure no file is set and status_file = 1
    (wrapper.vm as unknown as Record<string, unknown>).file = null;
    (wrapper.vm as unknown as Record<string, unknown>).statusFile = 1;

    const submitFn = (wrapper.vm as unknown as { submit?: () => Promise<void> }).submit;
    await submitFn?.();

    expect(uploadMembershipDuesProof).toHaveBeenCalledWith(123, expect.objectContaining({
      status_file: 1,
      proof_file: undefined,
    }));
  });

  test('submits tanpa perubahan (status_file=0)', async () => {
    vi.mocked(getMembershipDuesDetail).mockResolvedValue(mockAxiosResponseDetail('http://example.com/proof.pdf'));
    vi.mocked(uploadMembershipDuesProof).mockResolvedValue({
      data: { data: { message: 'ok' } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as AxiosRequestHeaders } as InternalAxiosRequestConfig,
    });
    wrapper = createWrapper();

    (wrapper.vm as unknown as Record<string, unknown>).statusFile = 0;
    (wrapper.vm as unknown as Record<string, unknown>).file = null;

    const submitFn = (wrapper.vm as unknown as { submit?: () => Promise<void> }).submit;
    await submitFn?.();

    expect(uploadMembershipDuesProof).toHaveBeenCalledWith(123, expect.objectContaining({
      status_file: 0,
      proof_file: undefined,
    }));
  });

  test('fetches detail on open and sets image preview', async () => {
    vi.mocked(getMembershipDuesDetail).mockResolvedValue(mockAxiosResponseDetail('http://example.com/proof.png'));
    wrapper = createWrapper();
    // After mount, dialog is open; wait for async detail fetch
    await flushPromises();
    const src = (wrapper.vm as unknown as Record<string, unknown>).previewSrc as unknown as string | null;
    expect(getMembershipDuesDetail).toHaveBeenCalledWith(123);
    expect(src).toBe('http://example.com/proof.png');
  });

  test('fetches detail on open and sets pdf preview', async () => {
    vi.mocked(getMembershipDuesDetail).mockResolvedValue(mockAxiosResponseDetail('http://example.com/proof.PDF'));
    wrapper = createWrapper();
    await flushPromises();
    const src = (wrapper.vm as unknown as Record<string, unknown>).previewSrc as unknown as string | null;
    expect(getMembershipDuesDetail).toHaveBeenCalledWith(123);
    expect(src).toBe('pdf');
  });

  test('shows fallback image when no proof path', async () => {
    vi.mocked(getMembershipDuesDetail).mockResolvedValue(mockAxiosResponseDetail(null));
    wrapper = createWrapper();
    await flushPromises();
    const src = (wrapper.vm as unknown as Record<string, unknown>).previewSrc as unknown as string | null;
    expect(getMembershipDuesDetail).toHaveBeenCalledWith(123);
    expect(src).toBe('/static/img/no_image.png');
  });
});
