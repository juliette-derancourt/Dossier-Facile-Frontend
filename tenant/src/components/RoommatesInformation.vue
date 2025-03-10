<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <ValidationObserver v-slot="{ invalid }">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12">
            <h6>{{ $t("roommatesinformation.title") }}</h6>
            <v-gouv-fr-modal>
              <template v-slot:button>
                <span class="small-font">{{ $t("roommatesinformation.more-information") }}</span>
              </template>
              <template v-slot:title>
                {{ $t("roommatesinformation.more-information") }}
              </template>
              <template v-slot:content>
                <p>
                  <RoommatesInformationHelp></RoommatesInformationHelp>
                </p>
              </template>
            </v-gouv-fr-modal>
          </div>
          <div class="fr-col-12 fr-mt-2w">
            <div v-if="showEmailExists" class="fr-callout">
              <p class="fr-mb-1w" v-html="$t('roommatesinformation.email-exists')"></p>
            </div>
            <div v-if="value.length > 0">
              <div
                v-for="(roommate, key) in value"
                v-bind:key="key"
                class="fr-mb-1w"
              >
                <NakedCard>
                  <div class="fr-grid-row bg--white">
                    <div class="fr-col-10">
                      <div class="fr-grid-row nowrap">
                        <div class="center-icon fr-mr-1w">
                          <span
                            class="color--white material-icons md-24 round-icon"
                            >person</span
                          >
                        </div>
                        <div class="fr-grid-col overflow--hidden max-content">
                          <div :title="roommate.email" class="overflow--hidden">
                            <b>
                              {{ roommate.email }}
                            </b>
                          </div>
                          <div class="small-text">
                            {{
                              $t(roommate.id ? "invite-sent" : "invite-waiting")
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="fr-col-2 center-icon">
                      <button
                        class="fr-btn fr-btn--secondary icon-btn"
                        :title="$t('roommatesinformation.delete')"
                        @click="remove(roommate)"
                        type="button"
                      >
                        <span class="color--primary material-icons md-24"
                          >delete_forever</span
                        >
                      </button>
                    </div>
                  </div>
                </NakedCard>
              </div>
            </div>
          </div>
          <div class="fr-col-12 fr-col-xl-7 fr-mt-2w">
            <label class="fr-label fr-mb-1w">{{ $t("roommatesinformation.roommateEmail") }}</label>
            <validation-provider
              :rules="{ email: true, required: value.length == 0 }"
              v-slot="{ errors }"
            >
              <div
                class="fr-input-group"
                :class="errors[0] ? 'fr-input-group--error' : ''"
              >
                <input
                  v-model="newRoommate"
                  class="form-control fr-input"
                  name="email"
                  placeholder="Ex : exemple@exemple.fr"
                  type="email"
                />
                <span class="fr-error-text" v-if="errors[0]">{{
                  $t(errors[0])
                }}</span>
              </div>
            </validation-provider>
          </div>

          <div class="fr-col-12 fr-col-xl-5 align-bottom">
            <div class="fr-grid-row fr-grid-row--right">
              <v-gouv-fr-button
                class="full-width-xs"
                :fullWidth="isMobile()"
                :secondary="true"
                :label="$t('roommatesinformation.add-a-roommate')"
                :btn-type="'button'"
                @click="addMail"
                :disabled="invalid"
              ></v-gouv-fr-button>
            </div>
          </div>
        </div>
      </ValidationObserver>
    </NakedCard>
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-mb-3w fr-mt-3w bg-bf200">
        <validation-provider rules="is" v-slot="{ errors }" class="fr-col-10">
          <div
            class="fr-checkbox-group bg-purple"
            :class="errors[0] ? 'fr-input-group--error' : ''"
          >
            <input
              type="checkbox"
              id="authorize"
              value="false"
              v-model="authorize"
              @change="updateAuthorize()"
            />
            <label for="authorize">{{ $t("roommatesinformation.acceptAuthor") }}</label>
            <span class="fr-error-text" v-if="errors[0]">{{
              $t(errors[0])
            }}</span>
          </div>
        </validation-provider>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { extend } from "vee-validate";
import { required, email, is } from "vee-validate/dist/rules";
import { User } from "df-shared/src/models/User";
import { mapGetters, mapState } from "vuex";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import RoommatesInformationHelp from "./helps/RoommatesInformationHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import { UtilsService } from "../services/UtilsService";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";

extend("email", {
  ...email,
  message: "email-not-valid"
});

extend("is", {
  ...is,
  message: "field-required",
  validate: value => !!value
});

extend("required", {
  ...required,
  message: "field-required"
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    VGouvFrButton,
    RoommatesInformationHelp,
    VGouvFrModal,
    NakedCard,
    TroubleshootingModal
  },
  computed: {
    ...mapState({
      user: "user"
    }),
    ...mapGetters({
      coTenantAuthorize: "coTenantAuthorize"
    })
  }
})
export default class RoommatesInformation extends Vue {
  @Prop({ default: () => [] }) value!: User[];

  user!: User;
  authorize = false;
  coTenantAuthorize!: boolean;
  newRoommate = "";
  showEmailExists = false;

  mounted() {
    this.authorize = this.coTenantAuthorize;
  }

  addMail() {
    this.showEmailExists = false;
    if (this.newRoommate !== "") {
      if (this.user.email !== this.newRoommate) {
        const coTenant = new User();
        coTenant.email = this.newRoommate;
        this.$store.commit("createCoTenant", this.newRoommate);
        this.value.push(coTenant);
        this.$emit("input", this.value);
        this.newRoommate = "";
      } else {
        this.showEmailExists = true;
      }
    }
  }

  remove(tenant: User) {
    if (tenant.id) {
      this.$store.dispatch("deleteCoTenant", tenant).then(() =>
        this.$emit(
          "input",
          this.value.filter(t => t.email != tenant.email)
        )
      );
    } else {
      this.$emit(
        "input",
        this.value.filter(t => t.email != tenant.email)
      );
    }
    return false;
  }

  updateAuthorize() {
    this.$store.commit("updateCoTenantAuthorize", this.authorize);
  }

  isMobile() {
    return UtilsService.isMobile();
  }
}
</script>

<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

.overflow--hidden {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.fr-btn {
  box-shadow: none;
  background-color: none;
  --color-hover: none;
  --color-active: none;
  padding: 0;
}

.icon-btn {
  display: block;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
}

.material-icons,
.material-icons-outlined {
  border-radius: 50%;
  --color-hover: var(--block-color-hover);
  --color-active: var(--block-color-active);
  padding: 0.25rem;
}

.center-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.round-icon {
  border-radius: 50%;
  background-color: var(--primary);
  padding: 0.25rem;
}

.card {
  box-shadow: 0 1px 8px 0 #cecece;
  @media all and (min-width: 992px) {
    padding: 1.5rem;
  }
}

.nowrap {
  flex-wrap: nowrap;
  overflow: auto;
}

.bg-bf200 {
  background-color: var(--blue-france-200);
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.align-bottom {
  align-self: flex-end;
  @media all and (max-width: 1247px) {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }
}

.max-content {
  max-width: max-content;
  @media all and (max-width: 420px) {
    max-width: 200px;
  }
}
</style>

