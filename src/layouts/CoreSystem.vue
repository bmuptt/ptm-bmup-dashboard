<template>
  <div>
    <!--Sidebar-->
    <v-navigation-drawer
      v-model="drawer"
      app
      :temporary="$vuetify.display.smAndDown"
    >
      <v-sheet
        color="grey-lighten-4"
        class="pa-4"
      >
        <v-avatar
          class="mb-4"
          size="64"
          color="primary"
        >
          <span class="text-h5">{{ stringAvatar }}</span>
        </v-avatar>

        <div class="font-weight-bold">
          {{
            resultLoading
              ? 'Loading...'
              : dataProfile === null
                ? 'No Data'
                : dataProfile.profile.name
          }}
        </div>
      </v-sheet>

      <v-divider />

      <!--MENU HOME-->
      <v-list>
        <v-list-item
          link
          to="/home"
          color="primary"
          rounded="xl"
        >
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list
        class="mb-6"
        :data-key="keyMenu"
      >
        <recursive-menu
          v-if="!resultLoading && dataProfile !== null"
          :items="dataProfile.menu"
        />
      </v-list>
    </v-navigation-drawer>

    <!--Toolbar-->
    <v-app-bar
      :color="appBarColor"
      dark
      app
    >
      <v-app-bar-nav-icon 
        @click="drawer = !drawer"
      />

      <v-toolbar-title>{{ appBarTitle }}</v-toolbar-title>

      <v-spacer />

      <v-btn
        type="text"
        color="white"
        @click="submitLogout"
      >
        <i class="fas fa-sign-out-alt" /> Logout
      </v-btn>
    </v-app-bar>

    <!-- MAIN COMPONENT -->
    <v-main>
      <router-view />
    </v-main>

    <!-- CONFIRM DIALOG -->
    <confirm-dialog
      v-model="showDialog"
      :title="dialogOptions.title"
      :html="dialogOptions.html"
      :confirm-button-text="dialogOptions.confirmButtonText"
      :cancel-button-text="dialogOptions.cancelButtonText"
      :confirm-button-color="dialogOptions.confirmButtonColor"
      :icon="dialogOptions.icon"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script lang="ts" setup>
import type { IResProfile } from '@/model/auth-interface';
import { logout, profile } from '@/service/auth';
import { useAppStore } from '@/stores/app';
import { useConfirmDialog } from '@/utils/confirm-dialog';
import { useLoading } from '@/utils/loading';
import RecursiveMenu from './RecursiveMenu.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

const store = useAppStore();
const router = useRouter();

// Create reactive refs for app bar
const appBarTitle = ref('-');
const appBarColor = ref('primary');

// Set initial title from store if available
if (store.coreSetting) {
  appBarTitle.value = store.coreSetting.name || '-';
  appBarColor.value = store.coreSetting.primary_color || 'primary';
}

// Confirm dialog
const { showDialog, dialogOptions, showConfirm, handleConfirm, handleCancel } = useConfirmDialog();

// loading
const { loading, resultLoading } = useLoading();

// data
const drawer = ref(true); // Start open by default for desktop
const dataProfile = ref<IResProfile | null>(null);
const keyMenu = ref(0);

// Responsive drawer logic using Vuetify breakpoints
const isDesktop = computed(() => {
  // Use window.innerWidth directly with Vuetify breakpoint values
  return window.innerWidth >= 1280; // lg breakpoint
});

watch(isDesktop, (newValue) => {
  if (newValue) {
    // On desktop (lg and up - 1280px+), keep drawer open by default
    drawer.value = true;
  } else {
    // On mobile/tablet (below 1280px), close drawer
    drawer.value = false;
  }
}, { immediate: true });

// Add window resize listener
const handleResize = () => {
  // This will trigger the watcher when window resizes
  const newIsDesktop = window.innerWidth >= 1280;
  if (newIsDesktop !== isDesktop.value) {
    if (newIsDesktop) {
      drawer.value = true;
    } else {
      drawer.value = false;
    }
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const stringAvatar = computed(() => {
  let tempAvatar = null;

  if (dataProfile.value && dataProfile.value.profile.name) {
    const nameParts = dataProfile.value.profile.name.split(' ');
    if (nameParts.length > 1) {
      tempAvatar = `${nameParts[0][0]}${nameParts[1][0]}`;
    } else {
      tempAvatar = `${nameParts[0][0]}`;
    }
  }

  return tempAvatar;
});

watch(
  () => store.profileGlobal,
  (newV) => {
    if (newV) {
      const min = 1; // Minimum value
      const max = 100; // Maximum value
      const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
      keyMenu.value = randomInt;

      dataProfile.value = JSON.parse(JSON.stringify(newV));
    }
  },
  { deep: true }
);

// Watch for core setting changes
watch(
  () => store.coreSetting,
  (newV) => {
    if (newV) {
      appBarTitle.value = newV.name || '-';
      appBarColor.value = newV.primary_color || 'primary';
    }
  },
  { deep: true }
);

const submitLogout = async () => {
  const confirmed = await showConfirm({
    title: 'Logout',
    html: 'Are you sure you want to log out?',
    confirmButtonText: 'Yes, Logout',
    icon: 'question',
  });

  if (confirmed) {
    loading.submit = true;

    logout()
      .then(() => {
        store.addProfileGlobal(null);
        localStorage.removeItem('refresh_token')
        router.push('/');
      })
      .catch(() => {})
      .finally(() => (loading.submit = false));
  }
};


const fetchData = () => {
  loading.data = true;
   
  profile()
    .then(({ data }) => {
      store.addProfileGlobal(data);
    })
    .catch(() => {})
    .finally(() => (loading.data = false));
};

fetchData();
</script>
