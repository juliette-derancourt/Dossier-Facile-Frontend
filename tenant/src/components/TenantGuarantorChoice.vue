<template>
  <div>
    <div>
      <div v-if="isMobile()" class="remark fr-mt-3w fr-mb-3w">
        <div class="fr-h5">{{ $t("tenantguarantorchoice.remark-title") }}</div>
        <div v-html="$t('tenantguarantorchoice.remark-text')"></div>
      </div>

      <div ref="guarantor-body-content">
        <NakedCard class="fr-p-md-5w">
          <div v-if="!isMobile()">
            <div class="text-bold fr-mb-1w">
              <h1 class="fr-h5" v-if="isCotenant">
                {{ $t("tenantguarantorchoice.cotenant-guarantor") }}
              </h1>
              <h1 class="fr-h5" v-else>
                {{ $t("tenantguarantorchoice.my-guarantor") }}
              </h1>
            </div>
            <TroubleshootingModal>
              <GuarantorChoiceHelp></GuarantorChoiceHelp>
            </TroubleshootingModal>
            <div class="remark fr-mt-3w">
              <div class="fr-h6">
                {{ $t("tenantguarantorchoice.remark-title") }}
              </div>
              <div
                class="small-font"
                v-html="$t('tenantguarantorchoice.remark-text')"
              ></div>
            </div>
          </div>
          <div class="fr-mt-3w fr-mb-2w">
            {{ $t("tenantguarantorchoice.ask-guarantor") }}
          </div>
          <TroubleshootingModal v-if="isMobile()">
            <GuarantorChoiceHelp></GuarantorChoiceHelp>
          </TroubleshootingModal>

          <div class="fr-grid-col">
            <div class="width--fit-content">
              <BigRadio
                val="NATURAL_PERSON"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("tenantguarantorchoice.natural-person") }}</span>
                </div>
              </BigRadio>
            </div>
            <div class="width--fit-content">
              <BigRadio
                val="ORGANISM"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("tenantguarantorchoice.organism") }}</span>
                </div>
              </BigRadio>
            </div>
            <div class="width--fit-content">
              <BigRadio
                val="LEGAL_PERSON"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span>{{ $t("tenantguarantorchoice.legal-person") }}</span>
                </div>
              </BigRadio>
            </div>
            <div class="width--fit-content">
              <BigRadio
                class="fr-mt-md-3w"
                val="NO_GUARANTOR"
                :value="tmpGuarantorType"
                @input="onSelectChange"
              >
                <div class="fr-grid-col spa">
                  <span v-if="isCotenant">{{
                    $t("tenantguarantorchoice.no-guarantor-cotenant")
                  }}</span>
                  <span v-else>{{
                    $t("tenantguarantorchoice.no-guarantor")
                  }}</span>
                </div>
              </BigRadio>
            </div>
          </div>
        </NakedCard>
        <div
          v-if="tmpGuarantorType === 'NO_GUARANTOR'"
          class="bg-purple fr-mt-3w fr-p-5w"
        >
          <div class="fr-grid-row space-between">
            <div class="fr-h5">
              {{ $t("tenantguarantorchoice.visale-title") }}
            </div>
            <img
              alt="logo visale"
              class="logo-visale"
              src="../assets/visale.svg"
            />
          </div>
          <p>{{ $t("tenantguarantorchoice.visale-text") }}</p>
          <div style="text-align: right">
            <DfButton primary="true" @on-click="gotoVisale()">
              {{ $t("tenantguarantorchoice.visale-btn") }}
            </DfButton>
          </div>
        </div>
      </div>

      <GuarantorFooter
        @on-back="goBack"
        @on-next="setGuarantorType"
      ></GuarantorFooter>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import { UtilsService } from "../services/UtilsService";
import { AnalyticsService } from "../services/AnalyticsService";
import GuarantorFooter from "./footer/GuarantorFooter.vue";
import GuarantorChoiceHelp from "./helps/GuarantorChoiceHelp.vue";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";

@Component({
  components: {
    TroubleshootingModal,
    VGouvFrModal,
    DfButton,
    BigRadio,
    NakedCard,
    GuarantorFooter,
    GuarantorChoiceHelp
  }
})
export default class TenantGuarantorChoice extends Vue {
  @Prop() tenantId!: number;
  @Prop({ default: false }) isCotenant!: boolean;
  tmpGuarantorType = "";

  getLocalStorageKey() {
    return "cotenantGuarantorType_" + this.tenantId;
  }

  beforeMount() {
    this.$store.dispatch("updateSelectedGuarantor", this.tenantId);

    // TODO : will be better to have the data on the backend (also valid for main tenant)
    const localType = localStorage.getItem(this.getLocalStorageKey());
    if (localType) {
      this.tmpGuarantorType = localType;
    }
  }

  updated() {
    // each dom update involved a scrollToEnd
    this.$nextTick(() => this.scrollToEnd());
  }

  scrollToEnd() {
    const element: any = this.$refs["guarantor-body-content"];
    window.scrollTo(0, element.lastElementChild.offsetTop);
  }

  onSelectChange(value: string) {
    this.tmpGuarantorType = value;
    localStorage.setItem(this.getLocalStorageKey(), this.tmpGuarantorType);
  }

  setGuarantorType() {
    if (!this.tmpGuarantorType) {
      this.$toasted.show(
        this.$i18n.t("tenantguarantorchoice.type-required").toString(),
        {
          type: "error",
          duration: 7000
        }
      );
      return;
    }
    AnalyticsService.addGuarantor(this.tmpGuarantorType);
    if (this.tmpGuarantorType === "NO_GUARANTOR") {
      this.$emit("on-select", this.tmpGuarantorType);
    } else {
      this.$store
        .dispatch("setGuarantorType", {
          tenantId: this.tenantId.toString(),
          typeGuarantor: this.tmpGuarantorType
        })
        .then(
          () => {
            this.$emit("on-select", this.tmpGuarantorType);
          },
          () => {
            this.$toasted.show(this.$i18n.t("try-again").toString(), {
              type: "error",
              duration: 7000
            });
          }
        );
    }
  }

  goBack() {
    this.$emit("on-back");
  }

  gotoVisale() {
    window.open("https://www.visale.fr", "_blank");
  }

  isMobile() {
    return UtilsService.isMobile();
  }
}
</script>

<style scoped lang="scss">
@import "df-shared/src/scss/_variables.scss";

.remark {
  background-color: #e5e5f4;
  padding: 1rem;
  border-radius: 0.25rem;
}

.logo-visale {
  width: 138px;
  height: 45px;
  margin-bottom: 1rem;
}

.width--fit-content {
  @media all and (min-width: 768px) {
    width: fit-content;
  }
}

h2 {
  font-size: 1rem;
  margin: 0.5rem;
  display: inline-block;
  align-self: center;
  line-height: 1.5rem;
}

.icon {
  align-self: center;
}

.document-title {
  border: 1px solid #ececec;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
}

.selected {
  background-color: $secondary;
}

.check {
  padding: 0.5rem;
  margin-left: auto;
  color: green;
}

.buttons {
  justify-content: space-between;
}

.guarantorselected {
  background-color: $light-blue-transparent;
}

.title-bar {
  display: flex;
  align-items: center;
  span {
    padding: 0.5rem;
    line-height: 1rem;
  }
}

.btn-group {
  width: fit-content;
}

.card {
  padding: 1rem;
}

.card-container {
  @media all and (min-width: 992px) {
    width: 100%;
  }
}

.small-font {
  font-size: 14px;
}

.add-guarantor-btn {
  border-radius: 0.5rem;
  padding: 1.75rem;
  color: var(--primary);
  border: 1px solid var(--primary);
  width: 100%;
  font-size: 16px;
  background: var(--blue-france-925);
  &:hover {
    background: var(--blue-france-hover);
  }
  &:active {
    background: var(--blue-france-active);
  }
}
</style>
