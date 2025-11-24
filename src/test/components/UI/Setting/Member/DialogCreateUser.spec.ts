import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DialogCreateUser from '@/components/UI/Setting/Member/DialogCreateUser.vue';
import type { IResponseMember } from '@/model/member-interface';
import { createUser } from '@/service/Setting/member';
import type { AxiosRequestHeaders } from 'axios';
import { responseCreateUserSuccess, responseCreateUserError } from '@/test/mock/member-mock';

// Mock services
vi.mock('@/service/Setting/member', () => ({
  createUser: vi.fn(),
}));



// Mock sweetalert2
const mockSwal = {
  fire: vi.fn(),
};

const vuetify = createVuetify({
  components,
  directives,
});

const mockMemberData: IResponseMember = {
  id: 1,
  user_id: null,
  name: 'John Doe',
  username: 'johndoe',
  gender: 'male',
  birthdate: '1990-01-01',
  address: 'Test Address',
  phone: '1234567890',
  photo: null,
  active: true,
  has_user_account: false,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  created_by: 0,
  updated_by: null
};




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

describe('DialogCreateUser', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    wrapper = mount(DialogCreateUser, {
      props: {
        memberData: mockMemberData,
      },
      global: {
        plugins: [vuetify],
        provide: {
          $swal: mockSwal,
        },
      },
    });
  });

  it('should render component correctly', () => {
    expect(wrapper.find('.font-24').text()).toBe('Create User Account');
    expect((wrapper.find('input[name="name"]').element as HTMLInputElement).value).toBe('John Doe');
    expect((wrapper.find('input[name="username"]').element as HTMLInputElement).value).toBe('johndoe');
    expect(wrapper.find('input[name="email"]').exists()).toBe(true);
  });

  it('should have readonly name and username fields', () => {
    const nameField = wrapper.find('input[name="name"]');
    const usernameField = wrapper.find('input[name="username"]');
    const roleField = wrapper.find('input[name="role"]');
    
    expect(nameField.attributes('readonly')).toBeDefined();
    expect(usernameField.attributes('readonly')).toBeDefined();
    expect(roleField.attributes('readonly')).toBeDefined();
  });

  it('should have proper styling for readonly fields', () => {
    const nameFieldWrapper = wrapper.find('[name="name"]').element.closest('.readonly-field');
    const usernameFieldWrapper = wrapper.find('[name="username"]').element.closest('.readonly-field');
    
    expect(nameFieldWrapper).toBeTruthy();
    expect(usernameFieldWrapper).toBeTruthy();
  });

  it('should have clickable role field with button', () => {
    const roleField = wrapper.find('[name="role"]');
    const roleFieldWrapper = roleField.element.closest('.readonly-field');
    
    // Role field should not have readonly-field class
    expect(roleFieldWrapper).toBeFalsy();
    
    // Should have button with "..." text for role selection
    const roleButtons = wrapper.findAll('button');
    const roleButton = roleButtons.find(btn => btn.text().includes('...'));
    expect(roleButton).toBeTruthy();
  });

  it('should disable submit button when no role is selected or no email', () => {
    const submitButtons = wrapper.findAll('button');
    const submitButton = submitButtons.find(btn => btn.text().includes('Create User'));
    
    expect(submitButton).toBeTruthy();
    if (submitButton) {
      expect(submitButton.attributes('disabled')).toBeDefined();
    }
  });

  it('should open role dialog when openRoleDialog is triggered', async () => {
    const component = wrapper.vm as unknown as {
      openRoleDialog: () => void;
      roleDialogOpen: boolean;
    };
    
    component.openRoleDialog();
    
    expect(component.roleDialogOpen).toBe(true);
  });

  it('should call createUser service when form is submitted with selected role and email', async () => {
    vi.mocked(createUser).mockResolvedValue(responseCreateUserSuccess as any);
    
    // Open role dialog and select a role
    const component = wrapper.vm as unknown as {
      selectedRole: { id: number; name: string } | null;
      selectedRoleName: string;
      email: string;
      submitForm: () => void;
    };
    
    component.selectedRole = { id: 1, name: 'Admin' };
    component.selectedRoleName = 'Admin';
    component.email = 'user@example.com';
    
    await wrapper.vm.$nextTick();
    
    // Submit form
    await component.submitForm();
    
    expect(createUser).toHaveBeenCalledWith(
      1, // member ID
      {
        email: 'user@example.com',
        role_id: 1,
      }
    );
  });

  it('should show error when submitting without selected role', async () => {
    const component = wrapper.vm as unknown as { submitForm: () => void };
    
    await component.submitForm();
    
    expect(mockSwal.fire).toHaveBeenCalledWith('Error', 'Please select a role', 'error');
    expect(createUser).not.toHaveBeenCalled();
  });

  it('should show error when submitting without email', async () => {
    const component = wrapper.vm as unknown as {
      selectedRole: { id: number; name: string } | null;
      selectedRoleName: string;
      email: string;
      submitForm: () => void;
    };
    
    component.selectedRole = { id: 1, name: 'Admin' };
    component.selectedRoleName = 'Admin';
    component.email = '';
    
    await wrapper.vm.$nextTick();
    await component.submitForm();
    
    expect(mockSwal.fire).toHaveBeenCalledWith('Error', 'Please enter a valid email', 'error');
    expect(createUser).not.toHaveBeenCalled();
  });

  it('should show error when submitting with invalid email', async () => {
    const component = wrapper.vm as unknown as {
      selectedRole: { id: number; name: string } | null;
      selectedRoleName: string;
      email: string;
      submitForm: () => void;
    };
    
    component.selectedRole = { id: 1, name: 'Admin' };
    component.selectedRoleName = 'Admin';
    component.email = 'invalid-email';
    
    await wrapper.vm.$nextTick();
    await component.submitForm();
    
    expect(mockSwal.fire).toHaveBeenCalledWith('Error', 'Please enter a valid email', 'error');
    expect(createUser).not.toHaveBeenCalled();
  });

  it('should emit closeDialog when cancel button is clicked', async () => {
    const cancelButtons = wrapper.findAll('button');
    const cancelButton = cancelButtons.find(btn => btn.text().includes('Cancel'));
    
    expect(cancelButton).toBeTruthy();
    if (cancelButton) {
      await cancelButton.trigger('click');
      expect(wrapper.emitted('closeDialog')).toBeTruthy();
    }
  });

  it('should handle createUser service error', async () => {
    vi.mocked(createUser).mockRejectedValue(responseCreateUserError);
    
    const component = wrapper.vm as unknown as {
      selectedRole: { id: number; name: string } | null;
      selectedRoleName: string;
      email: string;
      submitForm: () => void;
    };
    
    component.selectedRole = { id: 1, name: 'Admin' };
    component.selectedRoleName = 'Admin';
    component.email = 'user@example.com';
    
    await wrapper.vm.$nextTick();
    await component.submitForm();
    
    expect(createUser).toHaveBeenCalledWith(
      1,
      {
        email: 'user@example.com',
        role_id: 1,
      }
    );
    // Error should be handled by the service layer
  });

  it('should emit refreshPage and closeDialog on successful user creation', async () => {
    vi.mocked(createUser).mockResolvedValue(responseCreateUserSuccess as any);
    
    const component = wrapper.vm as unknown as {
      selectedRole: { id: number; name: string } | null;
      selectedRoleName: string;
      email: string;
      submitForm: () => Promise<void>;
    };
    
    component.selectedRole = { id: 1, name: 'Admin' };
    component.selectedRoleName = 'Admin';
    component.email = 'user@example.com';
    
    await wrapper.vm.$nextTick();
    await component.submitForm();
    await wrapper.vm.$nextTick();
    
    expect(mockSwal.fire).toHaveBeenCalledWith('Success', responseCreateUserSuccess.data.message, 'success');
    expect(wrapper.emitted('refreshPage')).toBeTruthy();
    expect(wrapper.emitted('closeDialog')).toBeTruthy();
  });
});