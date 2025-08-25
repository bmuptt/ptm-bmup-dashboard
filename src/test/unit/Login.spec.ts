import { describe, test, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ResizeObserver from 'resize-observer-polyfill';
import LoginPage from '@/pages/Login.vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createRouter, createWebHistory } from 'vue-router';
import { login } from '@/service/auth';
import { responseRejectLogin, responseResolvedLogin } from './mock/auth-mock';

const router = createRouter({
  history: createWebHistory(),
  routes: [], // Tidak perlu rute nyata, cukup kosong
});

vi.mock('@/service/auth', () => ({
  login: vi.fn(), // Mock function login
}));

const vuetify = createVuetify({
  components,
  directives,
});

globalThis.ResizeObserver = ResizeObserver;

describe('Login Page', () => {
  afterEach(() => {
    vi.clearAllMocks(); // Membersihkan mock setelah setiap tes
  });

  test('Error validation FE', async () => {
    const page = mount(LoginPage, {
      global: {
        plugins: [vuetify, router],
      },
    });

    const emailInput = page.find('[data-testid="email-field"] input');
    const emailComponent = page.find('[data-testid="email-field"]');
    const passwordInput = page.find('[data-testid="password-field"] input');
    const passwordComponent = page.find('[data-testid="password-field"]');

    await emailInput.trigger('focus');
    await emailInput.trigger('blur');

    expect(emailComponent.text()).toContain('Email is Required');

    await emailInput.setValue('user');
    await emailInput.trigger('blur');

    expect(emailComponent.text()).toContain('Must e-mail format');

    await passwordInput.trigger('focus');
    await passwordInput.trigger('blur');

    expect(passwordComponent.text()).toContain('Password is Required');
  });

  test('Error validation BE', async () => {
    vi.mocked(login).mockRejectedValueOnce(responseRejectLogin);

    const page = mount(LoginPage, {
      global: {
        plugins: [vuetify, router],
      },
    });

    const emailInput = page.find('[data-testid="email-field"] input');
    const passwordInput = page.find('[data-testid="password-field"] input');
    const form = page.find('form'); // Ambil elemen form

    await emailInput.setValue('admin@test.com');
    await passwordInput.setValue('inputpassword');

    await page.vm.$nextTick();
    await page.vm.$forceUpdate();

    await form.trigger('submit'); // Jalankan event submit di form

    await page.vm.$nextTick();

    expect(login).toHaveBeenCalledTimes(1);
    expect(login).toHaveBeenCalledWith({
      email: 'admin@test.com',
      password: 'inputpassword',
    });
  });

  test('Success Login', async () => {
    // Mock fungsi login untuk mengembalikan respons sukses
    vi.mocked(login).mockResolvedValue(responseResolvedLogin);
  
    // Mock fungsi router.push untuk memeriksa navigasi
    const pushMock = vi.fn();
    router.push = pushMock;
  
    // Mount komponen LoginPage
    const page = mount(LoginPage, {
      global: {
        plugins: [vuetify, router],
      },
    });
  
    // Temukan input email dan password
    const emailInput = page.find('[data-testid="email-field"] input');
    const passwordInput = page.find('[data-testid="password-field"] input');
    const form = page.find('form'); // Ambil elemen form
  
    // Isi input email dan password dengan data yang valid
    await emailInput.setValue('admin@test.com');
    await passwordInput.setValue('truepassword');
  
    // Trigger submit form
    await form.trigger('submit');
  
    // Tunggu hingga proses asynchronous selesai
    await page.vm.$nextTick();
  
    // Assertions
    // 1. Pastikan fungsi login dipanggil dengan payload yang benar
    expect(login).toHaveBeenCalledTimes(1);
    expect(login).toHaveBeenCalledWith({
      email: 'admin@test.com',
      password: 'truepassword',
    });
  
    // 2. Pastikan router.push dipanggil dengan path yang benar
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/home'); // Sesuaikan dengan path default
  });
});
