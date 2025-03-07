<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import useOwnerStore from '../../store/owner-store';
import PropertyPage from './PropertyPage.vue';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const store = useOwnerStore();

const id = ref(0);
if (route.params.id) {
  id.value = Number(route.params.id);
  store.updatePropertyToEdit(id.value);
}

const name = computed({
  get() {
    return store.getPropertyToEdit?.name;
  },
  set(val: string) {
    store.setName(val);
  },
});

function onSubmit() {
  store.saveProperty().then((data) => {
    router.push({ name: 'PropertyType', params: { id: data.id } });
  });
}

function onBack() {
  router.push({ name: 'AccountName' });
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <h1 class="fr-h4">{{ t("name-title") }}</h1>
    <p>{{ t("name-subtitle") }}</p>
    <p>
      <label class="fr-label" for="name">{{ t("name-label") }} :</label>
      <Field
        id="name"
        name="name"
        v-model="name"
        v-slot="{ field, meta }"
        :rules="{
          required: true,
        }"
      >
        <input
          v-bind="field"
          class="validate-required form-control fr-input"
          :class="{
            'fr-input--valid': meta.valid,
            'fr-input--error': !meta.valid,
          }"
          :placeholder="t('name-placeholder')"
          type="text"
        />
      </Field>
      <ErrorMessage name="name" v-slot="{ message }">
        <span role="alert" class="fr-error-text">{{ t(message || "") }}</span>
      </ErrorMessage>
    </p>
  </PropertyPage>
</template>

<i18n>
{
  "en": {
    "name-title": "Property name",
    "name-subtitle": "Indicate the name of the property.",
    "name-placeholder": "Property name",
    "name-label": "Property name"
  },
  "fr": {
    "name-title": "Nom de la propriété",
    "name-subtitle": "Choisissez un nom pour la propriété (par exemple l'adresse)",
    "name-placeholder": "Nom de la propriété",
    "name-label": "Nom de la propriété"
  }
}
</i18n>
