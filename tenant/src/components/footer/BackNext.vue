<template>
  <div>
    <div class="fr-grid-row space-around fr-mb-1w footer-btn">
      <slot name="additionalButton" v-if="isMobile()"></slot>
    </div>
    <div class="fr-grid-row btn-spacing footer-btn">
      <v-gouv-fr-button
        v-if="showBack"
        class="fr-mr-2w px40"
        :secondary="true"
        :btn-type="'button'"
        @click="backAction()"
      >
        <template v-if="isMobile()">
          <span class="color--primary material-icons">keyboard_arrow_left</span>
        </template>
        <span v-if="!isMobile()">{{ $t("backnext.back") }}</span>
      </v-gouv-fr-button>
      <div v-if="!showBack"></div>
      <div class="fr-grid-row flex-1">
        <slot name="additionalButton" v-if="!isMobile()"></slot>
        <v-gouv-fr-button
          class="next-btn"
          :secondary="false"
          :label="nextLabel ? nextLabel : $t('backnext.continue')"
          :btn-type="'submit'"
          :disabled="disabled"
          @click="nextAction()"
        ></v-gouv-fr-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VGouvFrButton from "df-shared/src/Button/v-gouv-fr-button/VGouvFrButton.vue";
import { UtilsService } from "../../services/UtilsService";

@Component({
  components: { VGouvFrButton }
})
export default class BackNext extends Vue {
  @Prop({ default: true }) showBack!: boolean;
  @Prop({ default: false }) disabled?: boolean;
  @Prop() nextLabel?: string;

  isMobile() {
    return UtilsService.isMobile();
  }

  backAction() {
    this.$emit("on-back");
  }

  nextAction() {
    this.$emit("on-next");
  }
}
</script>


<style lang="scss" scoped>
.btn-spacing {
  @media (min-width: 768px) {
    justify-content: space-around;
  }
}

.next-btn {
  @media (min-width: 769px) {
    margin-left: 16px !important;
  }
}

.flex-1 {
  @media (max-width: 768px) {
    max-width: 400px;
    flex: 1;
  }
}

.px40 {
  @media (max-width: 768px) {
    width: 40px !important;
  }
}
</style>

<style lang="scss">
.footer-btn .fr-btn {
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
}

.footer-btn .v-gouv-fr-button {
  @media (max-width: 768px) {
    width: 100%;
  }
}
</style>
