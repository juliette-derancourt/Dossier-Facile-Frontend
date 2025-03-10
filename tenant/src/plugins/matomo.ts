import router from "../router";
import VueMatomo from "vue-matomo";
import { VueConstructor } from "vue";

export default {
  install(Vue: VueConstructor) {
    const options = {
      host: process.env.VUE_APP_MATOMO_URL,
      siteId: process.env.VUE_APP_MATOMO_SITE_ID,
      trackerFileName: "matomo",
      router: router,
      domains: "*.dossierfacile.fr",
      cookieDomain: "*.dossierfacile.fr",
      userId: undefined
    };

    Vue.use(VueMatomo, options);
    window._paq.push(["trackPageView"]);
  }
};
