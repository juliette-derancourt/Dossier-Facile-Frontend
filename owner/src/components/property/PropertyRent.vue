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
  store.updatePropertyToEdit(Number(id.value));
}

const rent = computed({
  get() {
    return store.getPropertyToEdit?.rentCost;
  },
  set(val: number) {
    store.setRent(val);
  },
});

const charges = computed({
  get() {
    return store.getPropertyToEdit?.chargesCost;
  },
  set(val: number) {
    store.setCharges(val);
  },
});

function onSubmit() {
  store.saveProperty().then(() => {
    router.push({ name: 'ValidateProperty', params: { id: store.getPropertyToEdit.id } });
  });
}

function onBack() {
  router.push({ name: 'PropertyLivingSpace', params: { id: store.getPropertyToEdit.id } });
}
</script>

<template>
  <PropertyPage @on-back="onBack" @submit="onSubmit">
    <h1 class="fr-h4">{{ t('rent-title') }}</h1>
    <p>{{ t('rent-subtitle') }}</p>
    <p>
      <label class="fr-label" for="rent">{{ t('monthly-rent') }} :</label>
      <Field
        id="rent"
        name="rent"
        v-model="rent"
        v-slot="{ field, meta }"
        :rules="{
          required: true,
          positive: true,
        }"
      >
        <input
          v-bind="field"
          class="validate-required form-control fr-input"
          :class="{
            'fr-input--valid': meta.valid,
            'fr-input--error': !meta.valid,
          }"
          :placeholder="t('rent-amount')"
          type="number"
        />
      </Field>
      <ErrorMessage name="rent" v-slot="{ message }">
        <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
      </ErrorMessage>
    </p>
    <p>
      <label class="fr-label" for="charges">{{ t('monthly-charges') }} :</label>
      <Field
        id="charges"
        name="charges"
        v-model="charges"
        v-slot="{ field, meta }"
        :rules="{
          required: true,
          positiveOrNull: true,
        }"
      >
        <input
          v-bind="field"
          class="validate-required form-control fr-input"
          :class="{
            'fr-input--valid': meta.valid,
            'fr-input--error': !meta.valid,
          }"
          :placeholder="t('charges-amount')"
          type="number"
        />
      </Field>
      <ErrorMessage name="charges" v-slot="{ message }">
        <span role="alert" class="fr-error-text">{{ t(message || '') }}</span>
      </ErrorMessage>
    </p>
  </PropertyPage>
</template>

<i18n>
{
  "en": {
    "rent-title": "Rent and charges",
    "rent-subtitle": "Indicate the amount of rent requested as well as the associated charges.",
    "monthly-rent": "Monthly rent",
    "rent-amount": "Rent amount",
    "monthly-charges": "Monthly charges",
    "charges-amount": "Charges amount"
  },
  "fr": {
    "rent-title": "Loyer et charges mensuels",
    "rent-subtitle": "Indiquez le montant du loyer demandé ainsi que les charges associées.",
    "monthly-rent": "Loyer mensuel",
    "rent-amount": "Montant du loyer",
    "monthly-charges": "Montant des charges mensuel",
    "charges-amount": "Montant des charges"
  }
}
</i18n>
