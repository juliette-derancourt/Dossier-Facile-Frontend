<template>
  <div>
    <div v-if="editFinancialDocument">
      <FinancialDocumentForm></FinancialDocumentForm>
    </div>
    <div v-if="!editFinancialDocument">
      <NakedCard class="fr-p-md-5w fr-mb-3w">
        <div>
          <h1 class="fr-h6">{{ $t("financial-page.title") }}</h1>
          <div>{{ $t("financial-page.subtitle") }}</div>
        </div>
      </NakedCard>
      <div v-for="(f, k) in financialDocuments" :key="k">
        <CardRow
          @edit="selectFinancialDocument(f)"
          @remove="removeFinancial(f)"
          :danger="tenantFinancialDocument(f).documentStatus === 'DECLINED'"
        >
          <template v-slot:tag>
            <div class="fixed-width">
              <ColoredTag
                :text="getDocumentName(f)"
                :status="tenantFinancialDocument(f).documentStatus"
              ></ColoredTag>
            </div>
          </template>
          <template v-slot:text>
            <div
              class="text-bold"
              :class="{ declined: tenantFinancialDocument(f).documentStatus }"
              :title="$t('financial-page.net-monthly')"
              v-show="f.documentType.key !== 'no-income'"
            >
              {{ f.monthlySum }} {{ $t("financial-page.monthly") }}
            </div>
          </template>
          <template v-slot:bottom>
            <AllDeclinedMessages
              class="fr-mb-3w"
              :documentDeniedReasons="documentDeniedReasons(f)"
              :documentStatus="documentStatus(f)"
            ></AllDeclinedMessages>
          </template>
        </CardRow>
      </div>
      <div>
        <button
          @click="addAndSelectFinancial()"
          v-if="!hasNoIncome()"
          class="add-income-btn"
        >
          {{ $t("financial-page.add-income") }}
        </button>
      </div>
      <SimulationCaf class="fr-mt-4w" />
      <ProfileFooter @on-back="goBack" @on-next="goNext"></ProfileFooter>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { mapGetters } from "vuex";
import { FinancialDocument } from "df-shared/src/models/FinancialDocument";
import ListItem from "../../uploads/ListItem.vue";
import { User } from "df-shared/src/models/User";
import { DfDocument } from "df-shared/src/models/DfDocument";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import Modal from "df-shared/src/components/Modal.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import DocumentHelp from "../../helps/DocumentHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import ProfileFooter from "../../footer/ProfileFooter.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import CardRow from "df-shared/src/components/CardRow.vue";
import FinancialDocumentForm from "./FinancialDocumentForm.vue";
import ColoredTag from "df-shared/src/components/ColoredTag.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import SimulationCaf from "../share/SimulationCaf.vue";

@Component({
  components: {
    AllDeclinedMessages,
    ColoredTag,
    DocumentInsert,
    FileUpload,
    ListItem,
    WarningMessage,
    ConfirmModal,
    Modal,
    BigRadio,
    DocumentHelp,
    VGouvFrModal,
    ProfileFooter,
    NakedCard,
    CardRow,
    FinancialDocumentForm,
    SimulationCaf
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
      editFinancialDocument: "editFinancialDocument",
      financialDocuments: "tenantFinancialDocuments"
    })
  }
})
export default class Financial extends Vue {
  user!: User;
  financialDocuments!: FinancialDocument[];

  documents = DocumentTypeConstants.FINANCIAL_DOCS;

  beforeMount() {
    this.initialize();
  }

  documentDeniedReasons(f: FinancialDocument) {
    return this.tenantFinancialDocument(f).documentDeniedReasons;
  }

  documentStatus(f: FinancialDocument) {
    return this.tenantFinancialDocument(f).documentStatus;
  }

  initialize() {
    this.$store.commit("selectDocumentFinancial", undefined);
    if (this.financialDocuments.length === 0) {
      this.addAndSelectFinancial();
    }
  }

  tenantFinancialDocument(f: FinancialDocument) {
    return this.$store.getters.getTenantDocuments?.find((d: DfDocument) => {
      return d.id === f.id;
    });
  }

  async addAndSelectFinancial() {
    await this.$store.commit("createDocumentFinancial");
  }

  removeFinancial(f: DfDocument) {
    const loader = Vue.$loading.show();
    this.$store
      .dispatch("deleteDocument", f.id)
      .then(null, () => {
        Vue.toasted.global.error();
      })
      .finally(() => {
        loader.hide();
        this.initialize();
      });
    this.$store.commit("selectDocumentFinancial", undefined);
  }

  hasNoIncome() {
    return (
      this.financialDocuments.length > 0 &&
      this.financialDocuments.find(f => {
        return f.documentType && f.documentType.key !== "no-income";
      }) === undefined
    );
  }

  goBack() {
    this.$emit("on-back");
  }

  goNext() {
    this.$emit("on-next");
  }

  async selectFinancialDocument(f: FinancialDocument) {
    await this.$store.commit("selectDocumentFinancial", f);
  }

  private getDocumentName(document: FinancialDocument): string {
    return this.$t(`documents.${document.documentType.key}`).toString();
  }
}
</script>

<style scoped lang="scss">
.add-income-btn {
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

.fixed-width {
  width: 180px;
}
</style>

