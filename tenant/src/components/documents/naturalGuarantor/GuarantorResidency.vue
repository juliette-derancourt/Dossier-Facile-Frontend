<template>
  <div>
    <NakedCard class="fr-p-md-5w">
      <div>
        <h1 class="fr-h6">
          {{ $t("guarantorresidency.select-label") }}
        </h1>

        <TroubleshootingModal>
          <GuarantorChoiceHelp></GuarantorChoiceHelp>
          <DocumentInsert
            :allow-list="residencyDocument.acceptedProofs"
            :block-list="residencyDocument.refusedProofs"
            v-if="residencyDocument.key"
          ></DocumentInsert>
        </TroubleshootingModal>

        <div class="fr-mt-3w">
          <fieldset class="fr-fieldset">
            <div class="fr-fieldset__content">
              <div class="fr-grid-row">
                <div v-for="d in documents" :key="d.key" class="full-width-xs">
                  <BigRadio
                    :val="d"
                    v-model="residencyDocument"
                    @input="onSelectChange()"
                  >
                    <div class="fr-grid-col spa">
                      <span>{{ $t(d.key) }}</span>
                    </div>
                  </BigRadio>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </NakedCard>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("guarantorresidency.will-delete-files") }}</span>
    </ConfirmModal>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="residencyDocument.key || residencyFiles().length > 0"
    >
      <div class="fr-mb-3w">
        <p
          v-html="
            $t(`explanation-text.${guarantorKey()}.${residencyDocument.key}`)
          "
        ></p>
      </div>
      <AllDeclinedMessages
        class="fr-mb-3w"
        :documentDeniedReasons="documentDeniedReasons"
        :documentStatus="documentStatus"
      ></AllDeclinedMessages>
      <div v-if="residencyFiles().length > 0" class="fr-col-12 fr-mb-3w">
        <ListItem
          v-for="(file, k) in residencyFiles()"
          :key="k"
          :file="file"
          @remove="remove(file)"
        />
      </div>
      <div class="fr-mb-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
    </NakedCard>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapState } from "vuex";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { RegisterService } from "../../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import { Guarantor } from "df-shared/src/models/Guarantor";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import GuarantorChoiceHelp from "../../helps/GuarantorChoiceHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";

@Component({
  components: {
    AllDeclinedMessages,
    DocumentInsert,
    FileUpload,
    ListItem,
    WarningMessage,
    ConfirmModal,
    BigRadio,
    GuarantorChoiceHelp,
    VGouvFrModal,
    NakedCard,
    TroubleshootingModal
  },
  computed: {
    ...mapState({
      selectedGuarantor: "selectedGuarantor"
    })
  }
})
export default class GuarantorResidency extends Vue {
  @Prop() tenantId?: string;

  selectedGuarantor!: Guarantor;
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  uploadProgress: {
    [key: string]: { state: string; percentage: number };
  } = {};
  residencyDocument = new DocumentType();
  documentDeniedReasons = new DocumentDeniedReasons();

  documents = DocumentTypeConstants.GUARANTOR_RESIDENCY_DOCS;
  isDocDeleteVisible = false;

  @Watch("selectedGuarantor")
  onGuarantorChange() {
    this.updateGuarantorData();
  }

  mounted() {
    this.updateGuarantorData();
  }

  get documentStatus() {
    return this.guarantorResidencyDocument()?.documentStatus;
  }

  guarantorResidencyDocument() {
    return this.$store.getters.getGuarantorResidencyDocument;
  }

  updateGuarantorData() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.documentSubCategory;
        });
        if (localDoc !== undefined) {
          this.residencyDocument = localDoc;
        }
      }
      if (this.guarantorResidencyDocument()?.documentDeniedReasons) {
        this.documentDeniedReasons = cloneDeep(
          this.guarantorResidencyDocument()?.documentDeniedReasons
        );
      }
    }
  }

  onSelectChange() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      });
      if (doc !== undefined) {
        this.isDocDeleteVisible =
          (doc.files?.length || 0) > 0 &&
          doc.documentSubCategory !== this.residencyDocument.value;
      }
    }
    return false;
  }

  undoSelect() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      });
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc.documentSubCategory;
        });
        if (localDoc !== undefined) {
          this.residencyDocument = localDoc;
        }
      }
    }
    this.isDocDeleteVisible = false;
  }

  async validSelect() {
    this.isDocDeleteVisible = false;
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      });
      if (doc?.files !== undefined) {
        for (const f of doc.files) {
          if (f.id) {
            await this.remove(f, true);
          }
        }
      }
    }
  }

  isNewDocument() {
    if (this.selectedGuarantor.documents !== null) {
      const doc = this.selectedGuarantor.documents?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      });
      if (doc !== undefined) {
        if (
          (doc.documentSubCategory === "GUEST" &&
            this.residencyDocument.value === "GUEST_PARENTS") ||
          (doc.documentSubCategory === "GUEST_PARENTS" &&
            this.residencyDocument.value === "GUEST")
        ) {
          return false;
        }
        return doc.documentSubCategory !== this.residencyDocument.value;
      }
    }
    return false;
  }

  addFiles(fileList: File[]) {
    const nf = Array.from(fileList).map(f => {
      return { name: f.name, file: f, size: f.size };
    });
    this.files = [...this.files, ...nf];
    this.save();
  }
  resetFiles() {
    this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
  }
  save() {
    this.uploadProgress = {};
    const fieldName = "documents";
    const formData = new FormData();
    const newFiles = this.files.filter(f => {
      return !f.id;
    });
    if (!newFiles.length) return;

    if (
      this.residencyDocument.maxFileCount &&
      this.residencyFiles().length > this.residencyDocument.maxFileCount
    ) {
      Vue.toasted.global.max_file({
        message: this.$i18n.t("guarantorresidency.max-file", [
          this.residencyFiles().length,
          this.residencyDocument.maxFileCount
        ])
      });
      return;
    }

    Array.from(Array(newFiles.length).keys()).map(x => {
      const f: File = newFiles[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
    });

    formData.append("typeDocumentResidency", this.residencyDocument.value);

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    if (this.$store.getters.guarantor.id) {
      formData.append("guarantorId", this.$store.getters.guarantor.id);
    }
    if (this.tenantId) {
      formData.append("tenantId", this.tenantId);
    }
    const loader = this.$loading.show();
    this.$store
      .dispatch("saveGuarantorResidency", formData)
      .then(() => {
        this.files = [];
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        Vue.toasted.global.save_success();
      })
      .catch(err => {
        this.fileUploadStatus = UploadStatus.STATUS_FAILED;
        if (err.response.data.message.includes("NumberOfPages")) {
          Vue.toasted.global.save_failed_num_pages();
        } else {
          Vue.toasted.global.save_failed();
        }
      })
      .finally(() => {
        loader.hide();
      });
  }

  residencyFiles() {
    const newFiles = this.files.map(f => {
      return {
        documentSubCategory: this.residencyDocument.value,
        id: f.name,
        name: f.name,
        size: f.size
      };
    });
    const existingFiles =
      this.$store.getters.getGuarantorDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "RESIDENCY";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  async remove(file: DfFile, silent = false) {
    if (file.id) {
      await RegisterService.deleteFile(file.id, silent);
    } else {
      const firstIndex = this.files.findIndex(f => {
        return f.name === file.name && f.file === file.file && !f.id;
      });
      this.files.splice(firstIndex, 1);
    }
  }

  guarantorKey() {
    if (this.tenantId != null) {
      return "cotenant-guarantor";
    }
    return "guarantor";
  }
}
</script>

<style scoped lang="scss"></style>

