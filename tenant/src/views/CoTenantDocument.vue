<template>
  <ProfileContainer :step="getStep()">
    <div v-if="getSubStep() === 0">
      <CoTenantName
        :coTenantId="getTenantId()"
        @on-next="goNext()"
        @on-back="goBack()"
      />
    </div>

    <div v-if="getSubStep() === 1">
      <CoTenantIdentification
        :coTenantId="getTenantId()"
      ></CoTenantIdentification>
      <FooterContainer>
        <BackNext :showBack="true" @on-next="goNext()" @on-back="goBack()">
        </BackNext>
      </FooterContainer>
    </div>
    <div v-if="getSubStep() === 2">
      <CoTenantResidency :coTenantId="getTenantId()"></CoTenantResidency>
      <FooterContainer>
        <BackNext :showBack="true" @on-next="goNext()" @on-back="goBack()">
        </BackNext>
      </FooterContainer>
    </div>
    <div v-if="getSubStep() === 3">
      <CoTenantProfessional :coTenantId="getTenantId()"></CoTenantProfessional>
      <FooterContainer>
        <BackNext :showBack="true" @on-next="goNext()" @on-back="goBack()">
        </BackNext>
      </FooterContainer>
    </div>
    <div v-if="getSubStep() === 4">
      <CoTenantFinancialList
        :coTenantId="getTenantId()"
        @on-next="goNext"
        @on-back="goBack"
      ></CoTenantFinancialList>
    </div>
    <div v-if="getSubStep() === 5">
      <CoTenantTax
        :coTenantId="getTenantId()"
        @on-next="goNext"
        @on-back="goBack"
      ></CoTenantTax>
    </div>
  </ProfileContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UploadDocuments from "../components/UploadDocuments.vue";
import ProfileContainer from "../components/ProfileContainer.vue";
import FooterContainer from "../components/footer/FooterContainer.vue";
import BackNext from "../components/footer/BackNext.vue";
import CoTenantIdentification from "../components/documents/cotenant/CoTenantIdentification.vue";
import CoTenantResidency from "../components/documents/cotenant/CoTenantResidency.vue";
import CoTenantName from "../components/documents/cotenant/CoTenantName.vue";
import CoTenantProfessional from "../components/documents/cotenant/CoTenantProfessional.vue";
import CoTenantFinancialList from "../components/documents/cotenant/CoTenantFinancialList.vue";
import CoTenantTax from "../components/documents/cotenant/CoTenantTax.vue";

@Component({
  components: {
    UploadDocuments,
    ProfileContainer,
    FooterContainer,
    BackNext,
    CoTenantIdentification,
    CoTenantResidency,
    CoTenantProfessional,
    CoTenantFinancialList,
    CoTenantTax,
    CoTenantName
  }
})
export default class CoTenantDocument extends Vue {
  mounted() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
  }

  beforeDestroy() {
    window.Beacon("destroy");
  }

  goBack() {
    if (this.getSubStep() > 0) {
      this.$router.push({
        name: "CoTenantDocuments",
        params: {
          substep: Number(this.getSubStep() - 1).toString(),
          tenantId: this.getTenantId()
        }
      });
      return;
    }
    this.$router.push({
      name: "GuarantorChoice"
    });
  }

  goNext() {
    if (this.getSubStep() < 5) {
      this.$router.push({
        name: "CoTenantDocuments",
        params: {
          substep: Number(this.getSubStep() + 1).toString(),
          tenantId: this.getTenantId()
        }
      });
      return;
    } else {
      this.$router.push({
        name: "TenantGuarantors",
        params: {
          tenantId: this.getTenantId().toString(),
          step: "5"
        }
      });
    }
  }

  getTenantId() {
    return this.$route.params.tenantId;
  }
  getStep() {
    return Number(this.$route.params.step) || 0;
  }
  getSubStep() {
    return Number(this.$route.params.substep) || 0;
  }
}
</script>

<style lang="scss" scoped>
h4 {
  margin: 0;
}
</style>

