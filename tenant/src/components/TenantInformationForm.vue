<template>
  <div>
    <div v-if="!isOwner()">
      <NakedCard class="fr-p-md-5w">
        <div
          class="fr-grid-row fr-grid-row--center"
          v-if="applicationType === 'COUPLE'"
        >
          <div class="fr-col-12">
            <validation-provider
              rules="is"
              v-slot="{ errors }"
              class="fr-col-10"
            >
              <div
                class="fr-checkbox-group bg-purple"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <input
                  type="checkbox"
                  id="authorize"
                  value="false"
                  v-model="localSpouseAuthorize"
                />
                <label for="authorize">{{ $t("tenantinformationform.acceptAuthorSpouse") }}</label>
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
        </div>
        <div
          class="fr-grid-row fr-grid-row--center"
          v-if="applicationType === 'GROUP'"
        >
          <div class="fr-col-12">
            <validation-provider
              rules="is"
              v-slot="{ errors }"
              class="fr-col-10"
            >
              <div
                class="fr-checkbox-group bg-purple"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <input
                  type="checkbox"
                  id="authorize"
                  value="false"
                  v-model="localCoTenantAuthorize"
                />
                <label for="authorize">{{ $t("tenantinformationform.acceptAuthorCoTenant") }}</label>
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>
        </div>
      </NakedCard>
      <ProfileFooter @on-back="goBack" @on-next="authorize()"></ProfileFooter>
    </div>

    <div v-if="isOwner()">
      <ValidationObserver ref="observer" v-slot="{ validate }">
        <form
          name="form"
          @submit.prevent="validate().then(handleOthersInformation)"
        >
          <NakedCard class="fr-p-md-5w">
            <h1 class="fr-h6">{{ $t("tenantinformationform.title") }}</h1>
            <div class="fr-form-group fr-mt-3w fr-mb-0">
              <fieldset class="fr-fieldset">
                <div class="fr-fieldset__content">
                  <div class="fr-grid-row space-between">
                    <BigRadio
                      :big="true"
                      val="ALONE"
                      :value="applicationType"
                      @input="updateApplicationType"
                    >
                      <div class="fr-grid-col spa">
                        <div class="icon-container">
                          <span class="material-icons md-36" aria-hidden="true"
                            >person</span
                          >
                        </div>
                        {{ $t("tenantinformationform.alone") }}
                      </div>
                    </BigRadio>
                    <BigRadio
                      :big="true"
                      class="fr-mt-2w fr-mt-md-0"
                      val="COUPLE"
                      :value="applicationType"
                      @input="updateApplicationType"
                    >
                      <div class="fr-grid-col spa">
                        <div class="icon-container">
                          <span class="material-icons md-36" aria-hidden="true"
                            >group</span
                          >
                        </div>
                        {{ $t("tenantinformationform.couple") }}
                      </div>
                    </BigRadio>
                    <BigRadio
                      :big="true"
                      class="fr-mt-2w fr-mt-md-0"
                      val="GROUP"
                      :value="applicationType"
                      @input="updateApplicationType"
                    >
                      <div class="fr-grid-col spa">
                        <div class="icon-container">
                          <span class="material-icons md-36" aria-hidden="true"
                            >groups</span
                          >
                        </div>
                        {{ $t("tenantinformationform.roommate") }}
                      </div>
                    </BigRadio>
                  </div>
                </div>
              </fieldset>
            </div>
          </NakedCard>

          <CoupleInformation
            v-model="coTenants"
            class="fr-mt-2w"
            v-if="applicationType === 'COUPLE'"
          >
          </CoupleInformation>
          <RoommatesInformation
            v-model="coTenants"
            class="fr-mt-2w"
            v-if="applicationType === 'GROUP'"
          >
          </RoommatesInformation>
          <ProfileFooter @on-back="goBack"></ProfileFooter>
        </form>
      </ValidationObserver>
    </div>
    <ConfirmModal
      v-if="isDeleteGroupVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("tenantinformationform.will-delete-roommates") }}</span>
    </ConfirmModal>
    <ConfirmModal
      v-if="isDeleteCoupleVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("tenantinformationform.will-delete-couple") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { User } from "df-shared/src/models/User";
import RoommatesInformation from "./RoommatesInformation.vue";
import CoupleInformation from "./CoupleInformation.vue";
import { mapGetters, mapState } from "vuex";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import SubmitButton from "df-shared/src/Button/SubmitButton.vue";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import { AnalyticsService } from "../services/AnalyticsService";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import ProfileFooter from "./footer/ProfileFooter.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";

@Component({
  computed: {
    ...mapState({
      user: "user"
    }),
    ...mapGetters({
      roommates: "getRoommates",
      coTenantAuthorize: "coTenantAuthorize",
      spouseAuthorize: "spouseAuthorize"
    })
  },
  components: {
    CoupleInformation,
    RoommatesInformation,
    ValidationObserver,
    ValidationProvider,
    BigRadio,
    SubmitButton,
    WarningMessage,
    DfButton,
    ConfirmModal,
    ProfileFooter,
    NakedCard
  }
})
export default class TenantInformationForm extends Vue {
  user!: User;
  roommates!: User[];
  coTenants: User[] = [];
  coTenantAuthorize!: boolean;
  spouseAuthorize!: boolean;
  applicationType = "";
  isDeleteCoupleVisible = false;
  isDeleteGroupVisible = false;
  newApplicationType = "";

  localCoTenantAuthorize!: boolean;
  localSpouseAuthorize!: boolean;

  beforeMount() {
    if (this.user.applicationType) {
      this.applicationType = this.user.applicationType;
    }
    this.localCoTenantAuthorize = this.coTenantAuthorize;
    this.localSpouseAuthorize = this.spouseAuthorize;

    if (this.applicationType === "GROUP" || this.applicationType === "COUPLE") {
      this.coTenants = this.roommates;
    }
  }

  async handleOthersInformation() {
    const isValid = await (this.$refs.observer as Vue & {
      validate: () => boolean;
    }).validate();

    if (!isValid) return;

    if (this.hasNothingToSave()) {
      this.$router.push({
        name: "TenantDocuments",
        params: { substep: "1" }
      });
      return;
    }

    const dispatchMethod =
      this.applicationType === "GROUP"
        ? () => {
            const data = {
              applicationType: this.applicationType,
              coTenantEmail: this.coTenants.flatMap(t => t.email),
              acceptAccess: true
            };
            return this.$store.dispatch("setRoommates", data);
          }
        : () => {
            const data = {
              applicationType: this.applicationType,
              coTenants: this.coTenants,
              acceptAccess: true
            };
            return this.$store.dispatch("setCoTenants", data);
          };
    const loader = this.$loading.show();

    dispatchMethod()
      .then(
        () => {
          AnalyticsService.confirmType();
          this.$router.push({
            name: "TenantDocuments",
            params: { substep: "1" }
          });
          if (this.applicationType === "COUPLE") {
            this.$toasted.show(this.$i18n.t("tenantinformationform.couple-saved").toString(), {
              type: "show",
              duration: 7000
            });
            return;
          }
          if (this.applicationType === "GROUP") {
            this.$toasted.show(this.$i18n.t("tenantinformationform.roommates-saved").toString(), {
              type: "show",
              duration: 7000
            });
            return;
          }
        },
        error => {
          if (error.response.data.message.includes("are already being used")) {
            this.$toasted.show(this.$i18n.t("tenantinformationform.email-exists").toString(), {
              type: "error",
              duration: 7000
            });
            return;
          } else {
            this.$toasted.show(this.$i18n.t("tenantinformationform.error").toString(), {
              type: "error",
              duration: 7000
            });
            return;
          }
        }
      )
      .finally(() => {
        loader.hide();
      });
  }

  updateApplicationType(value: string) {
    if (this.applicationType != value) {
      this.newApplicationType = value;
      if (
        value !== this.applicationType &&
        (this.user.apartmentSharing?.tenants.length || 0) > 1
      ) {
        if (this.applicationType === "COUPLE") {
          this.isDeleteCoupleVisible = true;
        } else if (this.applicationType === "GROUP") {
          this.isDeleteGroupVisible = true;
        }
      } else {
        this.coTenants = [];
        this.applicationType = this.newApplicationType;
      }
    }
    return false;
  }

  hasNothingToSave() {
    if (
      this.applicationType === this.user.applicationType &&
      this.applicationType === "ALONE"
    ) {
      return true;
    }
    if (
      this.applicationType === this.user.applicationType &&
      this.applicationType === "GROUP"
    ) {
      const unregisteredRoommate = this.coTenants.find((r: any) => {
        return r.id === undefined;
      });
      if (unregisteredRoommate === undefined) {
        return true;
      }
    }
    return false;
  }

  undoSelect() {
    this.isDeleteCoupleVisible = false;
    this.isDeleteGroupVisible = false;
  }

  validSelect() {
    this.applicationType = this.newApplicationType;
    this.user.apartmentSharing?.tenants.forEach(t => {
      if (t.tenantType !== "CREATE") {
        this.$store
          .dispatch("deleteCoTenant", t)
          .then()
          .catch(() => {
            this.$toasted.global.error();
            this.undoSelect();
            return;
          });
      }
    });
    this.coTenants = [];
    this.isDeleteCoupleVisible = false;
    this.isDeleteGroupVisible = false;
  }

  isOwner() {
    return (
      this.user.tenantType === undefined || this.user.tenantType === "CREATE"
    );
  }

  authorize() {
    if (this.applicationType === "COUPLE" && !this.localSpouseAuthorize) {
      return;
    }
    if (this.applicationType === "GROUP" && !this.localCoTenantAuthorize) {
      return;
    }
    this.$router.push({ name: "TenantDocuments", params: { substep: "1" } });
  }

  goBack() {
    this.$router.push({ name: "TenantName" });
  }
}
</script>

<style scoped lang="scss">
.warning {
  padding: 0.5rem;
}

.spa {
  justify-content: space-around;
  align-content: space-around;
  height: 100%;
  align-items: center;
}

.selected {
  .icon-container {
    background-color: var(--primary);
    color: white;
  }
}

.icon-container {
  border-radius: 0.5rem;
  height: 5rem;
  width: 6rem;
  color: var(--primary);
  background-color: var(--white);
  border: 1px solid var(--primary);

  display: flex;
  justify-content: center;
  align-items: center;

  @media all and (max-width: 991px) {
    display: none;
  }
}
</style>

