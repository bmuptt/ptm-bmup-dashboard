<template>
  <div class="ma-6">
    <v-row>
      <v-col cols="12">
        <p class="font-24 font-weight-bold">
          {{ route.matched[2].meta.label }}
        </p>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-tabs
          v-model="activeTab"
          fixed-tabs
        >
          <v-tab value="home">
            Home
          </v-tab>
          <v-tab value="about">
            Tentang Kami
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col
        cols="12"
        md="9"
      >
        <v-window v-model="activeTab">
          <v-window-item value="home">
            <HomeSectionForm
              :items="homeItems"
              :loading="resultLoading"
              @update:items="updateHomeItems"
              @update:image="updateHomeImage"
            />
          </v-window-item>
          <v-window-item value="about">
            <AboutSectionForm
              :items="aboutItems"
              :loading="resultLoading"
              @update:items="updateAboutItems"
            />
          </v-window-item>
        </v-window>
      </v-col>
      <v-col
        cols="12"
        md="3"
      >
        <v-card class="pa-4">
          <v-row>
            <v-col cols="12">
              <v-alert
                type="info"
                variant="tonal"
                density="compact"
              >
                Perubahan akan disimpan untuk seluruh section sekaligus.
              </v-alert>
            </v-col>
          </v-row>
          <v-row class="mt-4">
            <v-col cols="12">
              <v-btn
                v-if="permission?.update"
                color="primary"
                block
                class="text-none"
                :loading="resultLoading"
                :disabled="resultLoading"
                @click="handleSubmit"
              >
                Simpan Perubahan
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { useLoadingComponent } from '@/utils/loading';
import { getPermission } from '@/service/auth';
import type { IResPermission } from '@/model/auth-interface';
import { getLandingSections, upsertLandingItems } from '@/service/Setting/landing';
import type { ILandingItem, IUpsertLandingRequestPayload } from '@/model/landing-interface';
import HomeSectionForm from '@/components/UI/Setting/Landing/HomeSectionForm.vue';
import AboutSectionForm from '@/components/UI/Setting/Landing/AboutSectionForm.vue';

const route = useRoute();
const swal = inject('$swal') as typeof import('sweetalert2').default;

const { loading, resultLoading } = useLoadingComponent();

const activeTab = ref<'home' | 'about'>('home');
const permission = ref<IResPermission | null>(null);

const homeItems = ref<ILandingItem[]>([]);
const aboutItems = ref<ILandingItem[]>([]);

const homeImageFile = ref<File | null>(null);
const homeImageStatus = ref<'0' | '1'>('0');

const fetchPermission = () => {
  loading.permission = true;
  const paramsPermission = {
    key_menu: (route.matched[2]?.name as string) || '',
  };

  getPermission(paramsPermission)
    .then(({ data }) => {
      permission.value = data.data;
    })
    .catch(() => {})
    .finally(() => {
      loading.permission = false;
    });
};

const fetchSections = () => {
  loading.data = true;

  getLandingSections()
    .then(({ data }) => {
      if (data.success) {
        const homeSection = data.data.find((section) => section.section.page_key === 'home');
        const aboutSection = data.data.find((section) => section.section.page_key === 'about');

        homeItems.value = homeSection ? homeSection.items : [];
        aboutItems.value = aboutSection ? aboutSection.items : [];

        homeImageFile.value = null;
        homeImageStatus.value = '0';
      }
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      loading.data = false;
    });
};

const updateHomeItems = (items: ILandingItem[]) => {
  homeItems.value = items;
};

const updateAboutItems = (items: ILandingItem[]) => {
  aboutItems.value = items;
};

const updateHomeImage = (file: File | null, statusImage: '0' | '1') => {
  homeImageFile.value = file;
  homeImageStatus.value = statusImage;
};

const handleSubmit = () => {
  if (!permission.value?.update) {
    return;
  }

  loading.submit = true;

  const homePayloadItems = homeItems.value.map((item) => {
    if (item.key === 'tentang_kami') {
      return {
        key: item.key,
        type: item.type,
        title: item.title,
        content: item.content,
        button_label: item.button_label,
        button_url: item.button_url,
        published: item.published,
        status_image: homeImageStatus.value,
      };
    }

    return {
      key: item.key,
      type: item.type,
      title: item.title,
      content: item.content,
      button_label: item.button_label,
      button_url: item.button_url,
      published: item.published,
    };
  });

  const aboutPayloadItems = aboutItems.value.map((item) => ({
    key: item.key,
    type: item.type,
    title: item.title,
    content: item.content,
    button_label: item.button_label,
    button_url: item.button_url,
    published: item.published,
  }));

  const payload: IUpsertLandingRequestPayload = {
    sections: [
      {
        page_key: 'home',
        items: homePayloadItems,
      },
      {
        page_key: 'about',
        items: aboutPayloadItems,
      },
    ],
  };

  const images: Record<string, File | null> = {
    tentang_kami: homeImageFile.value,
  };

  upsertLandingItems(payload, images)
    .then(({ data }) => {
      if (data.success) {
        swal.fire('Success', data.message || 'Landing page berhasil disimpan', 'success');
        fetchSections();
      }
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      loading.submit = false;
    });
};

fetchPermission();
fetchSections();
</script>
