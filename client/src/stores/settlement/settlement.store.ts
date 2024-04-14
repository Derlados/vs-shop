import { makeAutoObservable, runInAction } from "mobx";
import novaposhtaService from "../../services/novaposhta/novaposhta.service";
import { ISettlement } from "../../types/novaposhta/ISettlement";
import { IWarehouse } from "../../types/novaposhta/IWarehouse";

class SettlementStore {
  settlements: ISettlement[];
  warehouses: IWarehouse[];
  selectedSettlementRef: string;

  constructor() {
    makeAutoObservable(this);
    this.settlements = [
      { ref: "8d5a980d-391c-11dd-90d9-001a92567626", name: "Київ", area: "Київська обл.", settlementType: "місто" },
      { ref: "db5c88f0-391c-11dd-90d9-001a92567626", name: "Дніпро", area: "Дніпропетровська обл.", settlementType: "місто" },
      { ref: "db5c88e0-391c-11dd-90d9-001a92567626", name: "Харків", area: "Харківська обл.", settlementType: "місто" },
      { ref: "db5c88c6-391c-11dd-90d9-001a92567626", name: "Запоріжжя", area: "Запорізька обл.", settlementType: "місто" },
      { ref: "db5c88d0-391c-11dd-90d9-001a92567626", name: "Одеса", area: "Одеська обл.", settlementType: "місто" },
      { ref: "db5c890d-391c-11dd-90d9-001a92567626", name: "Кривий Ріг", area: "Дніпропетровська обл.", settlementType: "місто" },
      { ref: "db5c88f5-391c-11dd-90d9-001a92567626", name: "Львів", area: "Львівська обл.", settlementType: "місто" },
      { ref: "db5c88de-391c-11dd-90d9-001a92567626", name: "Вінниця", area: "Вінницька обл.", settlementType: "місто" },
      { ref: "db5c888c-391c-11dd-90d9-001a92567626", name: "Миколаїв", area: "Миколаївська обл.", settlementType: "місто" },
      { ref: "db5c8892-391c-11dd-90d9-001a92567626", name: "Полтава", area: "Полтавська обл.", settlementType: "місто" }
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
    if (settlementRef === this.selectedSettlementRef) return;

    const warehouses = await novaposhtaService.getWarehouses(settlementRef);
    runInAction(() => {
      this.selectedSettlementRef = settlementRef;
      this.warehouses = warehouses;
    });
  }
}

export default new SettlementStore();