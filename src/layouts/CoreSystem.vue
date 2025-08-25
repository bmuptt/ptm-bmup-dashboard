<template>
  <div>
    <!--Sidebar-->
    <v-navigation-drawer
      v-model="drawer"
      app
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

      <!-- <v-list class="mb-6">
        <v-list-item
          link
          to="/app-management/user"
          color="primary"
          rounded="xl"
        >
          <v-list-item-title>User</v-list-item-title>
        </v-list-item>

        <v-list-item
          link
          to="/app-management/role"
          color="primary"
          rounded="xl"
        >
          <v-list-item-title>Role</v-list-item-title>
        </v-list-item>

        <v-list-item
          link
          to="/app-management/menu"
          color="primary"
          rounded="xl"
        >
          <v-list-item-title>Menu</v-list-item-title>
        </v-list-item>

        <v-list-item
          link
          to="/app-management/role-menu"
          color="primary"
          rounded="xl"
        >
          <v-list-item-title>Role Menu</v-list-item-title>
        </v-list-item>
      </v-list> -->
    </v-navigation-drawer>

    <!--Toolbar-->
    <v-app-bar
      color="primary"
      dark
      app
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title>Elinda Furniture</v-toolbar-title>

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
  </div>
</template>

<script lang="ts" setup>
import type { IResProfile } from '@/model/auth-interface';
import { logout, profile } from '@/service/auth';
import { useAppStore } from '@/stores/app';
import { useAttributeDialogConfirm } from '@/utils/attribute-dialog-confirm';
import { useLoading } from '@/utils/loading';
import Swal from 'sweetalert2';
import RecursiveMenu from './RecursiveMenu.vue';

const store = useAppStore();
const swal = inject<typeof Swal>('$swal');
const router = useRouter()

if (!swal) {
  throw new Error('Swal instance is not provided!');
}

// loading
const { loading, resultLoading } = useLoading();

// data
const drawer = ref(true);
const dataProfile = ref<IResProfile | null>(null);
const keyMenu = ref(0);

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

const submitLogout = () => {
  const data = {
    title: 'Logout',
    html: `Are you sure you want to log out?`,
    confirmButtonText: 'Yes, Logout',
  };

  swal.fire(useAttributeDialogConfirm(data)).then((result) => {
    if (result.isConfirmed) {
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
  });
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
