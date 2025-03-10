<template>
  <div>
    <div>
      <h2 class="fr-h2 text-center fr-mt-3w fr-mb-5w color--primary">
        {{ t("title") }}
      </h2>

      <template v-if="franceConnect">
        <div class="fr-mt-5w fr-mb-5w text-center">
          <div>
            <div class="text-center">
              <div class="fr-mt-2w fr-mb-2w small-text">
                FranceConnect est la solution proposée par l’État pour sécuriser et
                simplifier la connexion à vos services en ligne
              </div>
            </div>
            <div id="kc-social-providers" class="fr-mt-5w fr-mb-1w">
              <div class="fr-connect-group">
                <button class="fr-connect" @click="loginFranceConnect()">
                  <span class="fr-connect__login">S’identifier avec</span>
                  <span class="fr-connect__brand">FranceConnect</span>
                </button>
                <p>
                  <a
                    href="https://franceconnect.gouv.fr/"
                    target="_blank"
                    rel="noopener"
                    :title="t('whatis-france-connect')"
                    >{{ t("whatis-france-connect") }}</a
                  >
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="separator">{{ t("or") }}</div>
      </template>

      <Form @submit="onSubmit">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label class="fr-label" for="email">{{ t("email") }}</label>
              <Field
                id="email"
                name="email"
                v-model="user.email"
                v-slot="{ field, meta }"
                :rules="{ email: true, required: true }"
              >
                <input
                  v-bind="field"
                  class="form-control validate-required fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid,
                  }"
                  :placeholder="t('email-placeholder')"
                  type="email"
                  autocomplete="email"
                />
              </Field>
              <ErrorMessage name="email" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || "") }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="fr-col-12 fr-mb-1w">
            <div class="fr-input-group">
              <label class="fr-label" for="password">{{ t("password") }}</label>
              <Field
                id="password"
                name="password"
                v-model="user.password"
                v-slot="{ field, meta }"
                :rules="{ required: true, strength: score }"
              >
                <input
                  v-bind="field"
                  class="form-control validate-required fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid,
                  }"
                  :placeholder="generatedPwd"
                  type="password"
                  autocomplete="new-password"
                />
              </Field>
              <PasswordMeter @score="setScore" :password="user.password || ''" />
              <ErrorMessage name="password" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || "") }}</span>
              </ErrorMessage>
            </div>
          </div>
          <div class="fr-col-12 fr-mb-3w">
            <div class="fr-input-group">
              <label class="fr-label" for="confirm-password">
                {{ t("confirm-password") }}</label
              >
              <Field
                id="confirm-password"
                name="confirm-password"
                v-model="user.confirm"
                v-slot="{ field, meta }"
                :rules="{
                  required: true,
                  confirm: [user.password, user.confirm],
                }"
              >
                <input
                  v-bind="field"
                  class="validate-required form-control fr-input"
                  :class="{
                    'fr-input--valid': meta.valid,
                    'fr-input--error': !meta.valid,
                  }"
                  type="password"
                  autocomplete="new-password"
                />
              </Field>
              <ErrorMessage name="confirm-password" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || "") }}</span>
              </ErrorMessage>
            </div>
          </div>

          <div class="fr-col-12 fr-mb-3w">
            <div class="bg-purple fr-checkbox-group">
              <Field
                name="terms"
                id="terms"
                type="checkbox"
                rules="isTrue"
                :value="true"
              />
              <label for="terms"><div v-html="t('accept-cgu')"></div></label>
              <ErrorMessage class="fr-error-text" name="terms" v-slot="{ message }">
                <span role="alert" class="fr-error-text">{{ t(message || "") }}</span>
              </ErrorMessage>
            </div>
          </div>

          <div class="fr-col-12 text-center fr-mb-5w">
            <button
              class="fr-btn full-width-btn"
              type="submit"
            >
              {{ t("submit") }}
            </button>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from "df-shared-next/src/models/User";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Form, Field, ErrorMessage } from "vee-validate";
import PasswordMeter from "df-shared-next/src/components/PasswordMeter/PasswordMeter.vue";

const FRANCE_CONNECT_LOGIN_URL = import.meta.env.VUE_APP_FRANCE_CONNECT_LOGIN_URL;

const { t } = useI18n();

const emit = defineEmits(["on-register"]);
const franceConnect =
  window.location.href.includes("locataire-dev") ||
  window.location.href.includes("localhost");

const user: User = new User();
const score = ref(0);
const generatedPwd = ref("");

function generatePlaceholder() {
  const chars = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    "0123456789",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    "#!?-_.",
  ];
  generatedPwd.value =
    t("ex") +
    [4, 4, 2, 2]
      .map((len, i) =>
        Array(len)
          .fill(chars[i])
          .map((x) => x[Math.floor(Math.random() * x.length)])
          .join("")
      )
      .concat()
      .join("")
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
}

function loginFranceConnect() {
  if (FRANCE_CONNECT_LOGIN_URL) {
    window.location.href = FRANCE_CONNECT_LOGIN_URL.toString();
  }
}

onMounted(() => {
  generatePlaceholder();
});

function onSubmit() {
  emit("on-register", user);
}

function setScore(s: number) {
  score.value = s;
}
</script>

<style lang="scss">
.fr-connect {
  display: inline-flex;
}
.full-width-btn {
  width: 100%;
  display: table-cell;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  color: #6a6a6a;
  font-size: 12px;
}

.separator::before,
.separator::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #cecece;
}

.separator:not(:empty)::before {
  margin-right: 2rem;
}

.separator:not(:empty)::after {
  margin-left: 2rem;
}

a.zocial.franceconnect-particulier {
  background: url(../assets/fc/franceconnect-bouton@2x.png) no-repeat left top;
  height: 70px;
  width: auto;
  padding-top: 60px;
}

a.zocial.franceconnect-particulier:hover {
  background: url(../assets/fc/franceconnect-bouton-hover@2x.png) no-repeat left top !important;
  height: 70px;
  width: auto;
}

a.zocial.franceconnect-particulier span {
  display: none;
}

a#social-franceconnect-particulier {
  background: url(../assets/fc/franceconnect-bouton.png) no-repeat left top;
  height: 60px;
  width: 230px;
}

a#social-franceconnect-particulier:hover {
  background: url(../assets/fc/franceconnect-bouton-hover.png) no-repeat left top !important;
  height: 60px;
  width: 230px;
}

a#social-franceconnect-particulier span {
  display: none;
}

.inline-block {
  display: inline-block;
}
</style>

<i18n>
{
  "en": {
    "title": "Create account",
    "password": "Password :",
    "email-placeholder": "E.g.: example{'@'}example.fr",
    "confirm-password": "Confirm password :",
    "email": "Email :",
    "submit": "I create my account",
    "email-not-valid": "Email not valid",
    "field-required": "This field is required",
    "password-not-confirmed": "Password not confirmed",
    "pwd-not-complex": "Password not secure enough",
    "accept-cgu": "En cochant cette case et en cliquant sur \"Je crée mon compte\", j’accepte expressément les <a target=\"_blank\" href='https://dossierfacile.fr/mentions-legales#cgu'>Conditions générales d’utilisation</a> de DossierFacile et je comprends que mes données personnelles seront utilisées conformément à la <a target=\"_blank\" href='https://dossierfacile.fr/mentions-legales#politique-de-confidentialite'>Politique de confidentialité</a> de DossierFacile",
    "require-accept": "Vous devez accepter les Conditions générales d’utilisation et la Politique de confidentialité de DossierFacile pour continuer",
    "ex": "E.g.: ",
    "or": "or",
    "connect-france-connect": "Connect with FranceConnect",
    "whatis-france-connect": "What is FranceConnect ?",
    "strength-not-valid": "Password is too easy",
    "confirm-not-valid": "Password not valid"
  },
  "fr": {
    "title": "Rejoindre DossierFacile",
    "password": "Votre mot de passe :",
    "confirm-password": "Confirmation de votre mot de passe :",
    "email-placeholder": "Ex : exemple{'@'}exemple.fr",
    "email": "Votre e-mail :",
    "submit": "Je crée mon compte",
    "email-not-valid": "Email non valide",
    "field-required": "Ce champ est requis",
    "password-not-confirmed": "Le mot de passe ne correspond pas",
    "pwd-not-complex": "Mot de passe trop simple",
    "accept-cgu": "En cochant cette case et en cliquant sur \"Je crée mon compte\", j’accepte expressément les <a class=\"cgu\" target=\"_blank\" href='https://www.dossierfacile.fr/mentions-legales#cgu'>Conditions générales d’utilisation</a> de DossierFacile et je comprends que mes données personnelles seront utilisées conformément à la <a target=\"_blank\" class=\"cgu\" href='https://www.dossierfacile.fr/mentions-legales#politique-de-confidentialite'>Politique de confidentialité</a> de DossierFacile",
    "require-accept": "Vous devez accepter les Conditions générales d’utilisation et la Politique de confidentialité de DossierFacile pour continuer",
    "ex": "Ex : ",
    "or": "Ou",
    "connect-france-connect": "Se connecter avec FranceConnect",
    "whatis-france-connect": "Qu'est-ce que FranceConnect ?",
    "strength-not-valid": "Le mot de passe est trop simple",
    "confirm-not-valid": "Le mot de passe ne correspond pas"
  }
}
</i18n>
