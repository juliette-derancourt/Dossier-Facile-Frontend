<template>
  <div class="partners">
    <h2 class="fr-pt-4w fr-pb-2w">{{ $t("partnerssection.partners-services-section") }}</h2>
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-md-6 fr-col-12">
        <div class="fr-tile bg-purple fr-p-3w cleana">
          <div class="service-box-btn">
            <a
              class="fr-btn fr-mt-1w fr-ml-2w cleana"
              href="https://www.anil.org/lanil-et-les-adil/votre-adil/"
              rel="noreferrer"
              target="_blank"
              :title="$t('partnerssection.go-to-anil')"
            >
              {{ $t("partnerssection.anil-btn") }}
            </a>
          </div>
          <div class="service-box-content">
            <img
              alt="logo anil"
              class="fr-pl-2w fr-pb-2w"
              src="../../assets/anil.png"
            />
            <div>
              <h3 class="fr-h5">{{ $t("partnerssection.anil-title") }}</h3>
            </div>
            <div class="fr-m-0 fr-py-2w">{{ $t("partnerssection.anil-text") }}</div>
          </div>
        </div>
      </div>
      <div class="fr-col-md-6 fr-col-12">
        <div class="fr-tile bg-purple fr-p-3w cleana">
          <div class="service-box-btn">
            <a
              class="fr-btn fr-mt-1w fr-ml-2w cleana"
              href="https://www.mesdroitssociaux.gouv.fr/votre-simulateur/accueil"
              rel="noreferrer"
              target="_blank"
              :title="$t('partnerssection.go-to-mds')"
            >
              {{ $t("partnerssection.mds-btn") }}
            </a>
          </div>
          <div class=" service-box-content">
            <img
              alt="logo mes droits sociaux"
              class="fr-pl-2w fr-pb-2w"
              src="../../assets/mes-droits-sociaux.png"
            />

            <div>
              <h3 class="fr-h5">{{ $t("partnerssection.mds-title") }}</h3>
            </div>
            <div class="fr-m-0 fr-py-2w">{{ $t("partnerssection.mds-text") }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class GuarantorsSection extends Vue {}
</script>

<style lang="scss" scoped>
h2 {
  color: var(--bf500);
  font-size: 2rem;
}

.partners .bg-white {
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.bg-purple {
  margin: 0px;
  background-color: #e5e5f4;
}

.cleana {
  box-shadow: 0 0 0 0;
  &:after {
    content: none;
  }
}

.service-box-content {
  display: block;
  img {
    float: right;
    max-width: 11rem;
    max-height: 8rem;
  }
}
.service-box-btn {
  text-align: right;
}
</style>

