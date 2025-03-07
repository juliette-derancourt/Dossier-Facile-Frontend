<template>
  <div class="fr-container fr-container--fluid fluid-full-width">
    <div class="fr-grid-row">
      <div class="fr-col-lg-6 fr-col-12">
        <div class="bg-pic">
          <div class="bg-white max-450 left-row fr-pt-3w fr-mt-7w fr-mb-7w">
            <p class="fr-h5 blue-text text-center fr-mt-3w">
              En route pour rejoindre DossierFacile !
            </p>
            <p class="fr-pl-2w fr-pr-2w">
              Afin de faciliter la constitution de votre dossier, préparez les
              pièces suivantes :
            </p>
            <div
              class="bg-purple blue-text fr-pr-2w fr-pl-2w fr-pt-3w fr-pb-3w"
            >
              <ul>
                <li>
                  Votre pièce d’identité
                </li>
                <li>
                  Un justificatif de domicile
                </li>
                <li>
                  Un justificatif de situation professionnelle
                </li>
                <li>
                  Vos justificatifs de ressource
                </li>
                <li>
                  Votre dernier avis d’imposition
                </li>
              </ul>
              Pour vos garants ces mêmes pièces vous seront demandées.
            </div>
            <div class="fr-pl-2w fr-pr-2w">
              <p class="fr-mt-3w">
                Vous avez tout ?! Super !<br />
                Commençons par sécuriser votre compte !
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-col-lg-6 fr-col-12 bg-white">
        <div class="margin-auto max-400">
          <Register :source="true" :email="email" @on-register="onRegister" />
          <h1 class="fr-text--sm text-center fr-mb-5w">
            <a href="#" @click="connect" class="blue-text">
              {{ $t("source.existing-account") }}
            </a>
          </h1>
        </div>
      </div>
    </div>
    <Modal v-show="isValidModalVisible" @close="closeModal">
      <template v-slot:body>
        <div class="fr-container">
          <div class="fr-grid-row justify-content-center">
            <div class="fr-col-12">
              <p>
                {{ $t("source.mail-sent") }}
              </p>
              <p>
                {{ $t("source.clic-to-confirm") }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Modal>
    <ConfirmModal
      v-if="showConfirmModal"
      @valid="validModal()"
      @cancel="closeConfirmModal()"
    >
      <span>{{ $t("source.will-link-to-partner") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import Register from "df-shared/src/Authentification/Register.vue";
import Modal from "df-shared/src/components/Modal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import { mapGetters } from "vuex";
import { RegisterService } from "../services/RegisterService";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";

@Component({
  components: {
    Register,
    Modal,
    DfButton,
    ConfirmModal
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn"
    })
  }
})
export default class Source extends Vue {
  isLoggedIn!: boolean;
  source = "";
  internalPartnerId = "";
  firstName = "";
  lastName = "";
  email = "";

  isValidModalVisible = false;
  showConfirmModal = false;

  created() {
    this.source = this.$route.params.source;
    this.internalPartnerId = this.$route.query.internalPartnerId.toString();
    this.firstName = this.$route.query.firstName.toString();
    this.lastName = this.$route.query.lastName.toString();
    this.email = this.$route.query.email.toString();
  }

  mounted() {
    if (this.isLoggedIn) {
      this.showConfirmModal = true;
    }
  }

  validModal() {
    RegisterService.connectSource(this.internalPartnerId, this.source)
      .then(() => {
        this.$toasted.show(this.$i18n.t("source.connected").toString(), {
          type: "success",
          duration: 3000
        });
        this.$router.push("/account");
      })
      .catch(() => {
        this.$toasted.show(this.$i18n.t("source.register-error").toString(), {
          type: "error",
          duration: 7000
        });
      });
  }

  onRegister(user: User) {
    user.firstName = this.firstName;
    user.lastName = this.lastName;
    if (user.email && user.password) {
      this.$store
        .dispatch("register", {
          user,
          source: this.source,
          internalPartnerId: this.internalPartnerId
        })
        .then(
          () => {
            this.isValidModalVisible = true;
          },
          error => {
            if (
              error.response.data.errors.indexOf(
                "email: the emails are already being used"
              ) >= 0
            ) {
              this.$toasted.show(this.$i18n.t("source.duplicate-email").toString(), {
                type: "error",
                duration: 7000
              });
            } else {
              this.$toasted.show(this.$i18n.t("source.register-error").toString(), {
                type: "error",
                duration: 7000
              });
            }
          }
        );
    }
  }

  connect() {
    if (this.isLoggedIn) {
      this.showConfirmModal = true;
    } else {
      (Vue as any).$keycloak.login({
        redirectUri: this.$route.query.page
      });
    }
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
  }

  closeModal() {
    this.isValidModalVisible = false;
    this.$router.push("/account");
  }
}
</script>


<style lang="scss">
body {
  background-color: var(--g100);
}

.bg-pic {
  &:before {
    content: " ";
    background-color: black;
    height: 100%;
    width: 100%;
  }
}
.bg-pic {
  background: linear-gradient(rgba(0, 0, 0, 0.527), rgba(0, 0, 0, 0.5)),
    url("../assets/immeuble.jpg") no-repeat;
  background-size: cover;
  height: 100%;
  overflow: hidden;
}
</style>

<style scoped lang="scss">
.bg-white {
  background-color: white;
  padding: 16px;
}

.inline-block {
  display: inline-block;
}

.text-center {
  text-align: center;
}

.margin-auto {
  margin: auto;
}

.max-450 {
  max-width: 450px;
}

.max-400 {
  max-width: 400px;
}

.left-row {
  margin-left: auto;
  margin-right: 32px;
}

li {
  padding: 0 !important;
}

button.blue-text {
  background-color: transparent;
}
</style>
