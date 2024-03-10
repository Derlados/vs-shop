import { makeAutoObservable } from "mobx";

class UiStore {
  isOpenSidebarCart: boolean

  constructor() {
    makeAutoObservable(this);
    this.isOpenSidebarCart = false;
  }

  openSidebarCart() {
    this.isOpenSidebarCart = true;
  }

  closeSidebarCart() {
    this.isOpenSidebarCart = false;
  }

}

export default new UiStore();
