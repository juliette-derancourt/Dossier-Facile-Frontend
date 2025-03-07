/* eslint-disable @typescript-eslint/camelcase */
import Vue from "vue";
import store from "../store";

export const AnalyticsService = {
  sendEvent(name: string, data: any) {
    if (Vue.$cookies.get("accept-cookie") === "true") {
      if (store.state.user.id !== undefined) {
        data.event_label = store.state.user.id;
      }
      Vue.prototype.$gtag.event(name, data);
    }
    // Matomo already manage consent
    window._paq.push([
      "trackEvent",
      data.event_category,
      name,
      data.event_label
    ]);
  },

  loginSuccess() {
    this.sendEvent("login-success", {
      event_category: "login"
    });
  },

  loginFail() {
    this.sendEvent("login-fail", {
      event_category: "login"
    });
  },

  registerSuccess() {
    this.sendEvent("register-success", {
      event_category: "login"
    });
  },

  registerFail() {
    this.sendEvent("register-fail", {
      event_category: "login"
    });
  },

  unlinkFCSuccess() {
    this.sendEvent("unlink-fc", {
      event_category: "account"
    });
  },

  openHelp(docType: string) {
    this.sendEvent("open_" + docType, {
      event_category: "help"
    });
  },

  editFromMenu(docType: number) {
    this.sendEvent("menu-edit-doc_" + this.getDoctypeByNumber(docType), {
      event_category: "funnel"
    });
  },

  viewFromMenu(docType: string) {
    this.sendEvent("menu-view-doc_" + docType, {
      event_category: "funnel"
    });
  },

  viewFromMain() {
    this.sendEvent("main-view-doc", {
      event_category: "funnel"
    });
  },

  editFromAccount(docType: number) {
    this.sendEvent("account-edit-doc_" + this.getDoctypeByNumber(docType), {
      event_category: "funnel"
    });
  },

  editAccount(editType: string) {
    this.sendEvent("account-edit-" + editType, {
      event_category: "funnel"
    });
  },

  viewFromAccount(docType: string) {
    this.sendEvent("account-view-doc_" + docType, {
      event_category: "funnel"
    });
  },

  editFromMessage(docType: number) {
    this.sendEvent("message-edit-doc_" + this.getDoctypeByNumber(docType), {
      event_category: "funnel",
      event_label: docType
    });
  },

  viewFromMessage(docType: string) {
    this.sendEvent("message-view-doc_" + docType, {
      event_category: "funnel"
    });
  },

  deleteFile(docType: string) {
    this.sendEvent("file-delete_" + docType, {
      event_category: "funnel"
    });
  },

  deleteAccount() {
    this.sendEvent("account-delete", {
      event_category: "account"
    });
  },

  copyLink(full: string) {
    this.sendEvent("copy-link_" + full, {
      event_category: "account"
    });
  },

  confirmName() {
    this.sendEvent("confirm-name", { event_category: "funnel" });
  },

  confirmType() {
    this.sendEvent("confirm-type", { event_category: "funnel" });
  },

  uploadFile(docType: string) {
    this.sendEvent("upload-file_" + docType, {
      event_category: "funnel"
    });
  },

  registerFile(docType: string) {
    this.sendEvent("register-file_" + docType, {
      event_category: "funnel"
    });
  },

  validateFunnel() {
    this.sendEvent("validate-tenant-funnel", { event_category: "funnel" });
  },

  addGuarantor(guarantorType: string) {
    this.sendEvent("add-guarantor_" + guarantorType, {
      event_category: "funnel"
    });
  },

  validateFile() {
    this.sendEvent("validate-file", { event_category: "file" });
  },

  openDGFIP() {
    this.sendEvent("open-dgfip", { event_category: "funnel" });
  },
  openSimulationCAF() {
    this.sendEvent("open-simulation_caf", { event_category: "funnel" });
  },

  getDoctypeByNumber(docType: number) {
    switch (docType) {
      case 1:
        return "identification";
      case 2:
        return "residency";
      case 3:
        return "professional";
      case 4:
        return "financial";
      case 5:
        return "tax";
      default:
        return "";
    }
  }
};
