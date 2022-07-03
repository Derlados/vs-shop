import { makeAutoObservable } from "mobx";
import novaposhtaService from "../services/novaposhta/novaposhta.service";
import orderService from "../services/order/order.service";
import { IOrder } from "../types/IOrder";
import { ISettlement } from "../types/ISettlement";

// м. Київ, Київська обл.
// м. Дніпро, Дніпропетровська обл.
// м. Харків, Харківська обл.
// м. Запоріжжя, Запорізька обл.
// м. Одеса,  Одеська обл.
// м. Кривий Ріг, Дніпропетровська обл.
// м. Львів, Львівська обл.
// м. Вінниця, Вінницька обл.
// м. Миколаїв, Миколаївська обл.
// м. Полтава, Полтавська обл.

class OrderStore {
    orders: IOrder[];
    settlements: ISettlement[];
    warehouses: string[];
    selectedSettlementRef: string;

    constructor() {
        makeAutoObservable(this);
        this.orders = [];
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

    async getOrders() {
        if (this.orders.length == 0) {
            this.orders = await orderService.getAll();
        }
        return this.orders;
    }
}

export default new OrderStore();