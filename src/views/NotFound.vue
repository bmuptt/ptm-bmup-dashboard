<template>
  <div class="not-found-container">
    <v-container class="fill-height">
      <v-row
        justify="center"
        align="center"
      >
        <v-col
          cols="12"
          md="8"
          lg="6"
          class="text-center"
        >
          <!-- 404 Icon -->
          <div class="mb-8">
            <v-icon
              size="120"
              color="primary"
              class="mb-4"
            >
              mdi-alert-circle-outline
            </v-icon>
          </div>

          <!-- 404 Text -->
          <h1 class="text-h1 font-weight-bold text-primary mb-4">
            404
          </h1>
          
          <h2 class="text-h4 font-weight-medium mb-4">
            Halaman Tidak Ditemukan
          </h2>
          
          <p class="text-h6 text-medium-emphasis mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Periksa kembali URL atau gunakan tombol di bawah untuk kembali ke halaman utama.
          </p>

          <!-- Action Buttons -->
          <div class="d-flex flex-column flex-sm-row gap-4 justify-center">
            <v-btn
              color="primary"
              size="large"
              variant="flat"
              prepend-icon="mdi-home"
              @click="goToHome"
            >
              Kembali ke Beranda
            </v-btn>
            
            <v-btn
              color="primary"
              size="large"
              variant="outlined"
              prepend-icon="mdi-arrow-left"
              @click="goBack"
            >
              Kembali
            </v-btn>
          </div>

          <!-- Additional Info -->
          <div class="mt-12">
            <p class="text-body-2 text-medium-emphasis">
              Jika masalah ini berlanjut, silakan hubungi administrator sistem.
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToHome = () => {
  router.push('/');
};

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push('/');
  }
};
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.text-primary {
  color: rgb(var(--v-theme-primary)) !important;
}

.text-medium-emphasis {
  color: rgba(var(--v-theme-on-surface), 0.6) !important;
}

.gap-4 {
  gap: 1rem;
}

@media (max-width: 600px) {
  .gap-4 {
    gap: 0.75rem;
  }
}
</style>
