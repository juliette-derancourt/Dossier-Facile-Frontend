<template>
  <div id="app">
    <Cookies
      :hidden="cookieHidden"
      @accept="acceptCookies"
      @deny="denyCookies"
    />
    <SkipLinks></SkipLinks>
    <MyHeader
      @on-login-tenant="onLoginTenant"
      @on-create-owner="onCreateOwner"
      :lang="getLang()"
    >
      <Menu />
    </MyHeader>
    <div id="content">
      <Announcement></Announcement>
      <main class="page" role="main">
        <router-view />
      </main>
    </div>
    <TheFooter />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import MyHeader from "df-shared/src/Header/Header.vue";
import TheFooter from "df-shared/src/Footer/Footer.vue";
import Modal from "df-shared/src/components/Modal.vue";
import Announcement from "df-shared/src/components/Announcement.vue";
import SkipLinks from "df-shared/src/components/SkipLinks.vue";
import Cookies from "df-shared/src/Footer/Cookies.vue";
import Menu from "./components/Menu.vue";
import i18n from "./i18n";
import VueGtag from "vue-gtag";
import router from "./router";

@Component({
  components: {
    Modal,
    Announcement,
    MyHeader,
    Menu,
    TheFooter,
    Cookies,
    SkipLinks
  }
})
export default class App extends Vue {
  cookieHidden = this.$cookies.isKey("accept-cookie");

  MAIN_URL = `//${process.env.VUE_APP_MAIN_URL}`;
  TENANT_URL = `//${process.env.VUE_APP_TENANT_URL}`;
  OWNER_URL = `//${process.env.VUE_APP_OWNER_URL}`;

  mounted() {
    window.Beacon("init", "e9f4da7d-11be-4b40-9514-ac7ce3e68f67");
  }

  beforeDestroy() {
    window.Beacon("destroy");
  }

  onCreateOwner() {
    window.location.href = this.OWNER_URL;
  }

  onLoginTenant() {
    window.location.replace(`${this.TENANT_URL}/login`);
  }

  acceptCookies() {
    const aYearFromNow = new Date();
    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
    this.$cookies.set(
      "accept-cookie",
      true,
      aYearFromNow,
      "",
      this.MAIN_URL.endsWith("dossierfacile.fr")
        ? "dossierfacile.fr"
        : "localhost"
    );

    Vue.use(
      VueGtag,
      {
        config: {
          id: "UA-50823626-2",
          params: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            send_page_view: true
          },
          linker: {
            domains: [
              "dossierfacile.fr",
              "www.dossierfacile.fr",
              "locataire.dossierfacile.fr",
              "proprietaire.dossierfacile.fr",
              "sso.dossierfacile.fr"
            ]
          }
        }
      },
      router
    );
    Vue.prototype.inspectlet();
    Vue.prototype.iphub();
    this.cookieHidden = true;
  }

  denyCookies() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    this.$cookies.set(
      "accept-cookie",
      false,
      d.toUTCString(),
      "",
      this.MAIN_URL.endsWith("dossierfacile.fr")
        ? "dossierfacile.fr"
        : "localhost"
    );
    this.cookieHidden = true;
  }

  getLang() {
    return i18n.locale;
  }
}
</script>

<style lang="scss">
@import "df-shared/src/scss/_main.scss";

// style hack to handle both themeforest and gouvfr design system
.bullets {
  li {
    &::marker {
      content: none;
    }
  }
}
.tabs-content,
.tabs,
.flickity-page-dots {
  li {
    &:before {
      content: none;
    }
  }
}
</style>

