<template>
  <div>
    <div>
      <NakedCard class="fr-p-md-5w">
        <h1 class="fr-h6">
          {{ $t("identification-page.select-label") }}
        </h1>

        <TroubleshootingModal>
          <DocumentHelp></DocumentHelp>
          <DocumentInsert
            :allow-list="identificationDocument.acceptedProofs"
            :block-list="identificationDocument.refusedProofs"
            v-if="identificationDocument.key"
          ></DocumentInsert>
        </TroubleshootingModal>

        <div class="fr-mt-3w">
          <fieldset class="fr-fieldset">
            <div class="fr-fieldset__content">
              <div class="fr-grid-row">
                <div v-for="d in documents" :key="d.key" class="full-width-xs">
                  <BigRadio
                    :val="d"
                    v-model="identificationDocument"
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
      </NakedCard>
    </div>
    <NakedCard
      class="fr-p-md-5w fr-mt-3w"
      v-if="identificationDocument.key || identificationFiles().length > 0"
    >
      <div class="fr-mb-3w">
        <p
          v-html="$t(`explanation-text.tenant.${identificationDocument.key}`)"
        ></p>
      </div>
      <AllDeclinedMessages
        class="fr-mb-3w"
        :documentDeniedReasons="documentDeniedReasons"
        :documentStatus="documentStatus"
      ></AllDeclinedMessages>
      <div
        v-if="identificationFiles().length > 0"
        class="fr-col-md-12 fr-mb-3w"
      >
        <ListItem
          v-for="(file, k) in identificationFiles()"
          :key="k"
          :file="file"
          @remove="remove(file)"
        />
      </div>
      <div class="fr-mb-3w">
        <FileUpload
          :current-status="fileUploadStatus"
          :page="4"
          @add-files="addFiles"
          @reset-files="resetFiles"
        ></FileUpload>
      </div>
    </NakedCard>
    <ConfirmModal
      v-if="isDocDeleteVisible"
      @valid="validSelect()"
      @cancel="undoSelect()"
    >
      <span>{{ $t("identification-page.will-delete-files") }}</span>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import DocumentInsert from "../share/DocumentInsert.vue";
import FileUpload from "../../uploads/FileUpload.vue";
import { DocumentType } from "df-shared/src/models/Document";
import { UploadStatus } from "df-shared/src/models/UploadStatus";
import ListItem from "../../uploads/ListItem.vue";
import { User } from "df-shared/src/models/User";
import { DfFile } from "df-shared/src/models/DfFile";
import { DfDocument } from "df-shared/src/models/DfDocument";
import { ValidationProvider } from "vee-validate";
import { RegisterService } from "../../../services/RegisterService";
import WarningMessage from "df-shared/src/components/WarningMessage.vue";
import { DocumentTypeConstants } from "../share/DocumentTypeConstants";
import ConfirmModal from "df-shared/src/components/ConfirmModal.vue";
import DfButton from "df-shared/src/Button/Button.vue";
import BigRadio from "df-shared/src/Button/BigRadio.vue";
import DocumentHelp from "../../helps/DocumentHelp.vue";
import VGouvFrModal from "df-shared/src/GouvFr/v-gouv-fr-modal/VGouvFrModal.vue";
import { AnalyticsService } from "../../../services/AnalyticsService";
import NakedCard from "df-shared/src/components/NakedCard.vue";
import AllDeclinedMessages from "../share/AllDeclinedMessages.vue";
import { DocumentDeniedReasons } from "df-shared/src/models/DocumentDeniedReasons";
import { cloneDeep } from "lodash";
import TroubleshootingModal from "@/components/helps/TroubleshootingModal.vue";

@Component({
  components: {
    DocumentInsert,
    FileUpload,
    ListItem,
    AllDeclinedMessages,
    ValidationProvider,
    WarningMessage,
    ConfirmModal,
    DfButton,
    BigRadio,
    DocumentHelp,
    VGouvFrModal,
    NakedCard,
    TroubleshootingModal
  },
  computed: {
    ...mapGetters({
      user: "userToEdit",
      tenantIdentificationDocument: "getTenantIdentificationDocument"
    })
  }
})
export default class Identification extends Vue {
  documents = DocumentTypeConstants.IDENTIFICATION_DOCS;

  user!: User;
  tenantIdentificationDocument!: DfDocument;

  documentDeniedReasons = new DocumentDeniedReasons();
  fileUploadStatus = UploadStatus.STATUS_INITIAL;
  files: DfFile[] = [];
  identificationDocument = new DocumentType();
  isDocDeleteVisible = false;

  getLocalStorageKey() {
    return "identification_" + this.user.email;
  }

  get documentStatus() {
    return this.tenantIdentificationDocument?.documentStatus;
  }

  beforeMount() {
    if (this.user.documents !== null) {
      if (this.tenantIdentificationDocument !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return (
            d.value === this.tenantIdentificationDocument?.documentSubCategory
          );
        });
        if (localDoc !== undefined) {
          this.identificationDocument = localDoc;
          localStorage.setItem(
            this.getLocalStorageKey(),
            this.identificationDocument.key || ""
          );
        }
        if (this.tenantIdentificationDocument?.documentDeniedReasons) {
          this.documentDeniedReasons = cloneDeep(
            this.tenantIdentificationDocument.documentDeniedReasons
          );
        }
      } else {
        const key = localStorage.getItem(this.getLocalStorageKey());
        if (key) {
          const localDoc = this.documents.find((d: DocumentType) => {
            return d.key === key;
          });
          if (localDoc !== undefined) {
            this.identificationDocument = localDoc;
          }
        }
      }
    }
  }

  onSelectChange() {
    localStorage.setItem(
      this.getLocalStorageKey(),
      this.identificationDocument.key
    );
    if (this.user.documents !== null) {
      const doc = this.tenantIdentificationDocument;
      if (doc !== undefined) {
        this.isDocDeleteVisible =
          (doc?.files?.length || 0) > 0 &&
          doc?.documentSubCategory !== this.identificationDocument.value;
      }
    }
    return false;
  }

  undoSelect() {
    if (this.user.documents !== null) {
      const doc = this.tenantIdentificationDocument;
      if (doc !== undefined) {
        const localDoc = this.documents.find((d: DocumentType) => {
          return d.value === doc?.documentSubCategory;
        });
        if (localDoc !== undefined) {
          this.identificationDocument = localDoc;
        }
      }
    }
    this.isDocDeleteVisible = false;
  }

  async validSelect() {
    this.isDocDeleteVisible = false;
    if (this.user.documents !== null) {
      const doc = this.tenantIdentificationDocument;
      if (doc?.files !== undefined) {
        for (const f of doc.files) {
          if (f.id) {
            await this.remove(f, true);
          }
        }
      }
    }
  }

  addFiles(fileList: File[]) {
    AnalyticsService.uploadFile("identification");
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
    AnalyticsService.registerFile("identification");
    const fieldName = "documents";
    const formData = new FormData();
    const newFiles = this.files.filter(f => {
      return !f.id;
    });
    if (!newFiles.length) return;

    if (
      this.identificationDocument.maxFileCount &&
      this.identificationFiles().length >
        this.identificationDocument.maxFileCount
    ) {
      Vue.toasted.global.max_file({
        message: this.$i18n.t("identification.max-file", [
          this.identificationFiles().length,
          this.identificationDocument.maxFileCount
        ])
      });
      return;
    }

    Array.from(Array(newFiles.length).keys()).map(x => {
      const f: File = newFiles[x].file || new File([], "");
      formData.append(`${fieldName}[${x}]`, f, newFiles[x].name);
    });

    formData.append(
      "typeDocumentIdentification",
      this.identificationDocument.value
    );

    this.fileUploadStatus = UploadStatus.STATUS_SAVING;
    // TODO : remove loader when upload status is well handled (be carefull with multiple save at the same time)
    const loader = this.$loading.show();
    this.$store
      .dispatch("saveTenantIdentification", formData)
      .then(() => {
        this.fileUploadStatus = UploadStatus.STATUS_INITIAL;
        this.files = [];
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

  identificationFiles() {
    const newFiles = this.files.map(f => {
      return {
        documentSubCategory: this.identificationDocument.value,
        id: f.name,
        name: f.name,
        file: f.file,
        size: f.file?.size
      };
    });
    const existingFiles =
      this.$store.getters.getTenantDocuments?.find((d: DfDocument) => {
        return d.documentCategory === "IDENTIFICATION";
      })?.files || [];
    return [...newFiles, ...existingFiles];
  }

  async remove(file: DfFile, silent = false) {
    AnalyticsService.deleteFile("identification");
    if (file.path && file.id) {
      await RegisterService.deleteFile(file.id, silent);
    } else {
      const firstIndex = this.files.findIndex(f => {
        return f.name === file.name && f.file === file.file && !f.id;
      });
      this.files.splice(firstIndex, 1);
    }
  }
}
</script>

<style scoped lang="scss">
table {
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid #ececec;
}
</style>

