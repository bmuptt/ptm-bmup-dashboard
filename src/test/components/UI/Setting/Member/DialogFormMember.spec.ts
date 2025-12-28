import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { mount, VueWrapper, flushPromises } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DialogFormMember from '@/components/UI/Setting/Member/DialogFormMember.vue';
import { add, update, detail } from '@/service/Setting/member';
import { responseMemberSuccess, responseMemberError, responseMemberDetailSuccess, responseMemberUpdateSuccess } from '../../../../mock/member-mock';
import type { IResponseMember } from '@/model/member-interface';
import type { AxiosResponse } from 'axios';

// Mock services
vi.mock('@/service/Setting/member', () => ({
  add: vi.fn(),
  update: vi.fn(),
  detail: vi.fn(),
}));

// Mock loading utils
vi.mock('@/utils/loading', () => ({
  useLoadingComponent: () => ({
    loading: { submit: false },
    resultLoading: false,
  }),
}));

// Mock URL methods for file handling
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock SweetAlert
const mockSwal = {
  fire: vi.fn(),
};

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
});

// Mock visualViewport for Vuetify
Object.defineProperty(window, 'visualViewport', {
  value: {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    width: 1024,
    height: 768,
  },
  writable: true,
});

// Mock matchMedia for Vuetify
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('DialogFormMember Component', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  test('should render component correctly for new member', () => {
    wrapper = mount(DialogFormMember, {
      props: {
        selectData: null,
      },
      global: {
        plugins: [vuetify],
        provide: {
          $swal: mockSwal,
        },
      },
    });

    expect(wrapper.find('.font-24').text()).toBe('Form Member');
  });

  test('should render component correctly for edit member', async () => {
    const mockMember: IResponseMember = {
      id: 1,
      user_id: null,
      name: 'John Doe',
      username: 'johndoe',
      gender: 'Male',
      birthdate: '1990-01-01',
      address: 'Jakarta, Indonesia',
      phone: '08123456789',
      photo: 'http://localhost:8000/storage/members/photo.jpg',
      active: true,
      has_user_account: false,
      created_by: 1,
      updated_by: null,
      created_at: '2025-09-13T22:25:00.000000Z',
      updated_at: '2025-09-13T22:25:00.000000Z'
    };

    vi.mocked(detail).mockResolvedValue(responseMemberDetailSuccess as AxiosResponse);

    wrapper = mount(DialogFormMember, {
      props: {
        selectData: mockMember,
      },
      global: {
        plugins: [vuetify],
        provide: {
          $swal: mockSwal,
        },
      },
    });

    await wrapper.vm.$nextTick();
    await flushPromises(); // Wait for detail API call

    expect(wrapper.find('.font-24').text()).toBe('Form Member');
    expect(detail).toHaveBeenCalledWith(1);
  });

  test('should call add service when creating new member', async () => {
    vi.mocked(add).mockResolvedValue(responseMemberSuccess as AxiosResponse);
    
    wrapper = mount(DialogFormMember, {
      props: {
        selectData: null,
      },
      global: {
        plugins: [vuetify],
        provide: {
          $swal: mockSwal,
        },
      },
    });

    // Set form data
    await wrapper.vm.$nextTick();
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).name = 'John Doe';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).username = 'johndoe';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).gender = 'Male';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).birthdate = '1990-01-01';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).address = 'Jakarta';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).phone = '08123456789';

    // Submit form
    await ((wrapper.vm as unknown as Record<string, unknown>).submitForm as () => Promise<void>)();
    await wrapper.vm.$nextTick();

    expect(add).toHaveBeenCalledWith(expect.any(FormData));
  });

  test('should call update service when editing member', async () => {
    const mockMember: IResponseMember = {
      id: 1,
      user_id: null,
      name: 'John Doe',
      username: 'johndoe',
      gender: 'Male',
      birthdate: '1990-01-01',
      address: 'Jakarta, Indonesia',
      phone: '08123456789',
      photo: 'http://localhost:8000/storage/members/photo.jpg',
      active: true,
      has_user_account: false,
      created_by: 1,
      updated_by: null,
      created_at: '2025-09-13T22:25:00.000000Z',
      updated_at: '2025-09-13T22:25:00.000000Z'
    };

    vi.mocked(detail).mockResolvedValue(responseMemberDetailSuccess as AxiosResponse);
    vi.mocked(update).mockResolvedValue(responseMemberSuccess as AxiosResponse);
    
    wrapper = mount(DialogFormMember, {
      props: {
        selectData: mockMember,
      },
      global: {
        plugins: [vuetify],
        provide: {
          $swal: mockSwal,
        },
      },
    });

    await wrapper.vm.$nextTick();
    await flushPromises(); // Wait for detail API call

    // Submit form
    await ((wrapper.vm as unknown as Record<string, unknown>).submitForm as () => Promise<void>)();
    await wrapper.vm.$nextTick();
    await flushPromises();

    expect(detail).toHaveBeenCalledWith(1);
    expect(update).toHaveBeenCalledWith(1, expect.any(FormData));
  });

  test('should handle service error gracefully', async () => {
    vi.mocked(add).mockRejectedValue(responseMemberError);
    
    wrapper = mount(DialogFormMember, {
      props: {
        selectData: null,
      },
      global: {
        plugins: [vuetify],
        provide: {
          $swal: mockSwal,
        },
      },
    });

    // Set form data
    await wrapper.vm.$nextTick();
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).name = 'John Doe';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).username = 'johndoe';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).gender = 'Male';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).birthdate = '1990-01-01';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).address = 'Jakarta';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).phone = '08123456789';

    // Submit form
    await ((wrapper.vm as unknown as Record<string, unknown>).submitForm as () => Promise<void>)();
    await wrapper.vm.$nextTick();

    expect(add).toHaveBeenCalledWith(expect.any(FormData));
  });

  test('should emit closeDialog when cancel button clicked', async () => {
    wrapper = mount(DialogFormMember, {
      props: {
        selectData: null,
      },
      global: {
        plugins: [vuetify],
        provide: {
          $swal: mockSwal,
        },
      },
    });

    await wrapper.vm.$nextTick();
    wrapper.vm.$emit('closeDialog');

    expect(wrapper.emitted('closeDialog')).toBeTruthy();
  });

  test('should emit refreshPage after successful submit', async () => {
    vi.mocked(add).mockResolvedValue(responseMemberSuccess as AxiosResponse);
    
    wrapper = mount(DialogFormMember, {
      props: {
        selectData: null,
      },
      global: {
        plugins: [vuetify],
        provide: {
          $swal: mockSwal,
        },
      },
    });

    // Set form data
    await wrapper.vm.$nextTick();
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).name = 'John Doe';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).username = 'johndoe';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).gender = 'Male';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).birthdate = '1990-01-01';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).address = 'Jakarta';
    ((wrapper.vm as unknown as Record<string, unknown>).state as Record<string, unknown>).phone = '08123456789';

    // Submit form
    await ((wrapper.vm as unknown as Record<string, unknown>).submitForm as () => Promise<void>)();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('refreshPage')).toBeTruthy();
    expect(wrapper.emitted('closeDialog')).toBeTruthy();
  });

  // Service Layer Tests
  describe('Member Service', () => {
    test('should get member detail successfully', async () => {
      vi.mocked(detail).mockResolvedValue(responseMemberDetailSuccess as AxiosResponse);
      const result = await detail(1);
      expect(result.data.success).toBe(true);
      expect(result.data.data.name).toBe('John Doe');
      expect(result.data.data.username).toBe('johndoe');
    });

    test('should update member successfully', async () => {
      const formData = new FormData();
      formData.append('name', 'John Updated');
      formData.append('username', 'johnupdated');
      formData.append('gender', 'Female');
      formData.append('birthdate', '1995-05-15');
      formData.append('address', 'Surabaya, Jawa Timur, Indonesia');
      formData.append('phone', '08123456788');
      formData.append('active', 'true');
      formData.append('status_file', '1');

      vi.mocked(update).mockResolvedValue(responseMemberUpdateSuccess as AxiosResponse);
      const result = await update(1, formData);
      expect(result.data.success).toBe(true);
      expect(result.data.data.name).toBe('John Updated');
      expect(result.data.message).toBe('Member updated successfully');
    });

    test('should handle detail error gracefully', async () => {
      vi.mocked(detail).mockRejectedValue(responseMemberError);
      await expect(detail(1)).rejects.toEqual(responseMemberError);
    });

    test('should handle update error gracefully', async () => {
      const formData = new FormData();
      formData.append('name', 'John Updated');
      
      vi.mocked(update).mockRejectedValue(responseMemberError);
      await expect(update(1, formData)).rejects.toEqual(responseMemberError);
    });
  });

  describe('Username Field Readonly Functionality', () => {
    test('should make username field readonly when member is synced with user (user_id is not null)', async () => {
      const mockMemberWithUser: IResponseMember = {
        id: 1,
        user_id: 123, // Member is synced with user
        name: 'John Doe',
        username: 'johndoe',
        gender: 'Male',
        birthdate: '1990-01-01',
        address: 'Jakarta, Indonesia',
        phone: '08123456789',
        photo: 'http://localhost:8000/storage/members/photo.jpg',
        active: true,
        has_user_account: true,
        created_by: 1,
        updated_by: null,
        created_at: '2025-09-13T22:25:00.000000Z',
        updated_at: '2025-09-13T22:25:00.000000Z'
      };

      // Mock detail to avoid error in fetchForm
      vi.mocked(detail).mockResolvedValue(responseMemberDetailSuccess as AxiosResponse);

      wrapper = mount(DialogFormMember, {
        props: {
          selectData: mockMemberWithUser,
        },
        global: {
          plugins: [vuetify],
          provide: {
            $swal: mockSwal,
          },
        },
      });

      await wrapper.vm.$nextTick();
      await flushPromises();

      // Find username field
      const usernameField = wrapper.find('input[name="username"]');
      expect(usernameField.exists()).toBe(true);
      expect(usernameField.attributes('readonly')).toBeDefined();
    });

    test('should make username field editable when member is not synced with user (user_id is null)', async () => {
      const mockMemberWithoutUser: IResponseMember = {
        id: 1,
        user_id: null, // Member is not synced with user
        name: 'John Doe',
        username: 'johndoe',
        gender: 'Male',
        birthdate: '1990-01-01',
        address: 'Jakarta, Indonesia',
        phone: '08123456789',
        photo: 'http://localhost:8000/storage/members/photo.jpg',
        active: true,
        has_user_account: false,
        created_by: 1,
        updated_by: null,
        created_at: '2025-09-13T22:25:00.000000Z',
        updated_at: '2025-09-13T22:25:00.000000Z'
      };

      // Mock detail to avoid error in fetchForm
      vi.mocked(detail).mockResolvedValue(responseMemberDetailSuccess as AxiosResponse);

      wrapper = mount(DialogFormMember, {
        props: {
          selectData: mockMemberWithoutUser,
        },
        global: {
          plugins: [vuetify],
          provide: {
            $swal: mockSwal,
          },
        },
      });

      await wrapper.vm.$nextTick();

      // Find username field
      const usernameField = wrapper.find('input[name="username"]');
      expect(usernameField.exists()).toBe(true);
      expect(usernameField.attributes('readonly')).toBeUndefined();
    });

    test('should make username field editable for new member (selectData is null)', async () => {
      wrapper = mount(DialogFormMember, {
        props: {
          selectData: null, // New member
        },
        global: {
          plugins: [vuetify],
          provide: {
            $swal: mockSwal,
          },
        },
      });

      await wrapper.vm.$nextTick();

      // Find username field
      const usernameField = wrapper.find('input[name="username"]');
      expect(usernameField.exists()).toBe(true);
      expect(usernameField.attributes('readonly')).toBeUndefined();
    });
  });
});
