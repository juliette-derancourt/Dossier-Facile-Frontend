<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{ title: string; to: any }>();
</script>

<template>
  <div class="fr-grid-row item">
    <div>{{ props.title }}</div>
    <router-link class="fr-btn update-btn fr-btn--secondary" :to="props.to">
      <div class="desktop">{{ t('update') }}</div>
      <div class="mobile">
        <span class="color--primary material-icons md-16">edit</span>
      </div>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.update-btn {
  @media all and (min-width: 768px) {
    min-width: 150px;
    justify-content: center;
  }
  @media all and (max-width: 767px) {
    padding: 0.5rem;
    min-height: 1rem;
    line-height: 1rem;
  }
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--g200);
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 1rem;
  flex-wrap: nowrap;
}
</style>

<i18n>
{
  "en": {
    "update": "Update"
  },
  "fr": {
    "update": "Mettre à jour"
  }
}
</i18n>
