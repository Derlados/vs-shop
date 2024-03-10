import { makeAutoObservable } from "mobx";
import novaposhtaService from "../../services/novaposhta/novaposhta.service";
import { ISettlement } from "../../types/ISettlement";

class SettlementStore {
  settlements: ISettlement[];
  warehouses: string[];
  selectedSettlementRef: string;

  constructor() {
    makeAutoObservable(this);
    this.settlements = [
      { ref: "8d5a980d-391c-11dd-90d9-001a92567626", name: "Київ", region: '', area: "Київська обл.", settlementType: "місто" },
      { ref: "db5c88f0-391c-11dd-90d9-001a92567626", name: "Дніпро", region: '', area: "Дніпропетровська обл.", settlementType: "місто" },
      { ref: "db5c88e0-391c-11dd-90d9-001a92567626", name: "Харків", region: '', area: "Харківська обл.", settlementType: "місто" },
      { ref: "db5c88c6-391c-11dd-90d9-001a92567626", name: "Запоріжжя", region: '', area: "Запорізька обл.", settlementType: "місто" },
      { ref: "db5c88d0-391c-11dd-90d9-001a92567626", name: "Одеса", region: '', area: "Одеська обл.", settlementType: "місто" },
      { ref: "db5c890d-391c-11dd-90d9-001a92567626", name: "Кривий Ріг", region: '', area: "Дніпропетровська обл.", settlementType: "місто" },
      { ref: "db5c88f5-391c-11dd-90d9-001a92567626", name: "Львів", region: '', area: "Львівська обл.", settlementType: "місто" },
      { ref: "db5c88de-391c-11dd-90d9-001a92567626", name: "Вінниця", region: '', area: "Вінницька обл.", settlementType: "місто" },
      { ref: "db5c888c-391c-11dd-90d9-001a92567626", name: "Миколаїв", region: '', area: "Миколаївська обл.", settlementType: "місто" },
      { ref: "db5c8892-391c-11dd-90d9-001a92567626", name: "Полтава", region: '', area: "Полтавська обл.", settlementType: "місто" }
    ];
    this.warehouses = [];
  }

  async findSettlements(searchString: string) {
    if (!searchString) {
      this.settlements = [];
      return;
    }

    this.settlements = await novaposhtaService.getSettlements(searchString);
  }

  async selectSettlement(settlementRef: string) {
    if (settlementRef !== this.selectedSettlementRef) {
      this.selectedSettlementRef = settlementRef;
      this.warehouses = await novaposhtaService.getWarehouses(settlementRef);
    }
  }
}

export default new SettlementStore();