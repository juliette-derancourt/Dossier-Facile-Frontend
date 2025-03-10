<template>
  <div>
    <div class="main-information">
      <h3 class="fr-h4">{{ $t("tenantpanel.my-personnal-information") }}</h3>
      <div class="fr-grid-row fr-grid-row--gutters">
        <InfoCard
          :title="$t('tenantpanel.my-information')"
          editable="true"
          matIcon="person"
          @click="gotoTenantName()"
        >
          <div class="name-email-tile">
            {{ tenant | fullName }}<br />
            {{ tenant ? tenant.email : "" }}
          </div>
        </InfoCard>
      </div>
      <hr class="fr-mt-4w" />
      <h3 class="fr-h4">{{ $t("tenantpanel.my-files") }}</h3>

      <div class="fr-grid-row fr-grid-row--gutters">
        <InfoCard
          :title="$t('tenantpanel.identification')"
          editable="true"
          matIcon="person"
          @click="setTenantStep(1)"
        >
          <ColoredTag
            :status="getStatus('IDENTIFICATION')"
            :text="$t('tenantpanel.s_' + getStatus('IDENTIFICATION'))"
          ></ColoredTag>
        </InfoCard>
        <InfoCard
          :title="$t('tenantpanel.residency')"
          editable="true"
          matIcon="home"
          @click="setTenantStep(2)"
        >
          <ColoredTag
            :status="getStatus('RESIDENCY')"
            :text="$t('tenantpanel.s_' + getStatus('RESIDENCY'))"
          ></ColoredTag>
        </InfoCard>
        <InfoCard
          :title="$t('tenantpanel.professional')"
          editable="true"
          matIcon="work"
          @click="setTenantStep(3)"
        >
          <ColoredTag
            :status="getStatus('PROFESSIONAL')"
            :text="$t('tenantpanel.s_' + getStatus('PROFESSIONAL'))"
          ></ColoredTag>
        </InfoCard>
        <InfoCard
          :title="$t('tenantpanel.financial')"
          editable="true"
          matIcon="euro"
          @click="setTenantStep(4)"
        >
          <ColoredTag
            :status="getStatus('FINANCIAL')"
            :text="$t('tenantpanel.s_' + getStatus('FINANCIAL'))"
          ></ColoredTag>
        </InfoCard>
        <InfoCard
          :title="$t('tenantpanel.tax')"
          editable="true"
          matIcon="content_copy"
          @click="setTenantStep(5)"
        >
          <ColoredTag
            :status="getStatus('TAX')"
            :text="$t('tenantpanel.s_' + getStatus('TAX'))"
          ></ColoredTag>
        </InfoCard>
      </div>
    </div>

    <GuarantorsSection :tenant="tenant" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { User } from "df-shared/src/models/User";
import { DfDocument } from "df-shared/src/models/DfDocument";
import DfButton from "df-shared/src/Button/Button.vue";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import { AnalyticsService } from "@/services/AnalyticsService";
import { required } from "vee-validate/dist/rules";
import DeleteAccount from "@/components/DeleteAccount.vue";
import GuarantorsSection from "@/components/account/GuarantorsSection.vue";
import PartnersSection from "@/components/account/PartnersSection.vue";
import InfoCard from "@/components/account/InfoCard.vue";

extend("required", {
  ...required,
  message: "Ce champ est requis"
});

@Component({
  components: {
    InfoCard,
    PartnersSection,
    GuarantorsSection,
    ValidationProvider,
    ValidationObserver,
    DfButton,
    ColoredTag,
    DeleteAccount
  }
})
export default class TenantPanel extends Vue {
  @Prop() tenant!: User;
  @Prop({ default: false }) isCotenant!: boolean;

  getStatus(docType: string) {
    if (docType === "FINANCIAL") {
      const docs = this.tenant.documents?.filter(d => {
        return d.documentCategory === "FINANCIAL";
      });
      return this.isFinancialValid(docs || []);
    }
    const doc = this.tenant.documents?.find((d: DfDocument) => {
      return d.documentCategory === docType;
    });
    return doc?.documentStatus || "EMPTY";
  }

  isFinancialValid(docs: DfDocument[]) {
    if (!docs || docs.length === 0) {
      return "INCOMPLETE";
    }

    for (const doc of docs) {
      if (!doc.noDocument && (doc.files?.length || 0) <= 0) {
        return "INCOMPLETE";
      }
    }

    for (const doc of docs) {
      if (doc.documentStatus === "DECLINED") {
        return "DECLINED";
      }
    }

    for (const doc of docs) {
      if (doc.documentStatus === "TO_PROCESS") {
        return "TO_PROCESS";
      }
    }

    return "VALIDATED";
  }

  gotoTenantName() {
    if (this.isCotenant) {
      this.$router.push({
        name: "CoTenantDocuments",
        params: {
          tenantId: this.tenant?.id.toString(),
          step: "4",
          substep: "0"
        }
      });
    } else {
      this.$router.push({ name: "TenantName" });
    }
  }

  setTenantStep(n: number) {
    AnalyticsService.editFromAccount(n);
    if (this.isCotenant) {
      this.$router.push({
        name: "CoTenantDocuments",
        params: {
          tenantId: this.tenant?.id.toString(),
          step: "4",
          substep: n.toString()
        }
      });
    } else {
      this.$router.push({
        name: "TenantDocuments",
        params: { substep: n.toString() }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.main-bar {
  display: flex;
}

.main {
  background-color: var(--background-default-grey);
}

.bg-blue {
  width: 100%;
  background-color: var(--bf100-g750);
}

.fr-callout-white {
  background-color: var(--background-default-grey);
  &.warning {
    box-shadow: inset 0.25rem 0 0 0 var(--error) !important;
  }
}

h1 {
  color: var(--bf500);
  font-size: 2rem;
}

h2 {
  color: var(--bf500);
  font-size: 2rem;
}

.align--center {
  text-align: center;
  margin: auto;
}

.bg-white {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 10px;
  background: var(--background-default-grey);
}

.fr-btn.delete-btn {
  background-color: var(--error);
  --color-hover: rgba(246, 0, 0, 0.5);
  --color-active: rgba(255, 91, 91, 0.5);
}

.grp {
  display: block;
  position: relative;
}

.grp-btn {
  border-left: 1px solid var(--background-default-grey);
  position: relative;
}

.grp-modal {
  position: absolute;
  border-radius: 5px;
  right: 0;
  left: auto;
  width: max-content;
  z-index: 2;
  padding: 1rem;
  width: 330px;

  @media all and (max-width: 768px) {
    max-width: 300px;
  }

  &:before {
    top: -16px;
    right: 9px;
    left: auto;
    border: 8px solid transparent;
    border-bottom: 8px solid var(--color-border-overlay);
    position: absolute;
    display: inline-block;
    content: "";
  }
}

.copy-btn {
  max-width: 100%;
  > button {
    width: 100%;
    text-align: justify;
    border-radius: 0.25rem;
    padding: 1rem;
    font-size: 1rem;
    box-shadow: 0 0.5px 4px 0 #cecece;
    border: 1px solid transparent;

    -webkit-transition: all 0.5s linear;
    -moz-transition: all 0.5s linear;
    -o-transition: all 0.5s linear;
    transition: all 0.5s linear;

    &:hover {
      box-shadow: none;
      border: 1px solid var(--primary);
      box-shadow: 0 0.5px 4px 0 transparent;
      background-image: none;
    }

    &.copied {
      color: var(--primary);
      background-color: var(--background-action-low-blue-france);
      border: 1px solid var(--primary);
      box-shadow: 0 0.5px 4px 0 transparent;
      -webkit-transition: all 0.5s linear;
      -moz-transition: all 0.5s linear;
      -o-transition: all 0.5s linear;
      transition: all 0.5s linear;
    }
  }
}

p {
  word-break: break-word;
}

.edit-btn {
  position: absolute;
  right: 0;
  top: 0;

  box-shadow: none;
}

.description:first-letter {
  text-transform: uppercase;
}

.material-icons.md-adapt {
  font-size: 48px;
}

.header-title {
  display: flex;
  justify-content: center;
  align-items: center;
}

hr {
  border: 0;
  margin-left: 20%;
  margin-right: 20%;
  border-top: 1px solid var(--g400);
}

.fr-tile__body {
  overflow: auto;
}

.cleana {
  &:after {
    content: none;
  }
  &:focus {
    outline-style: auto;
    outline-width: 2px;
    outline-offset: 4px;
    outline-color: #0a76f6;
  }
}

.alert-container {
  display: flex;
  flex-direction: row-reverse;
}

.red-alert {
  background-color: var(--error);
  color: white;
  border-radius: 2px;
  margin-right: 0;
  margin-left: auto;
  padding: 0.5rem;
}

.name-email-tile {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dflex {
  display: flex;
  align-items: center;
}

.mobile-margin {
  @media all and (max-width: 768px) {
    margin-bottom: 1rem;
  }
}

.btn-container {
  margin-left: auto;

  @media all and (max-width: 600px) {
    width: 100%;
  }
}

.main-copy-btn {
  height: 2.5rem;
  @media all and (max-width: 600px) {
    flex: 1;
  }
}

.share-file-description {
  max-width: fit-content;
}
</style>

