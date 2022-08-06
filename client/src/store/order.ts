import { computed, makeAutoObservable } from "mobx";
import novaposhtaService from "../services/novaposhta/novaposhta.service";
import orderService from "../services/order/order.service";
import { IOrder, IPayment, OrderStatus } from "../types/IOrder";
import { ISettlement } from "../types/ISettlement";

export enum OrderSorts {
    NONE = 'none',
    DATE_ASC = 'date-asc',
    DATE_DESC = 'date-desc',
    PRICE_ASC = 'price-asc',
    PRICE_DESC = 'price-desc',
    STATUS_ASC = 'status-asc',
    STATUS_DESC = 'status-desc'
}

class OrderStore {
    apiError: string;
    orders: IOrder[];
    maxOrders: number;
    maxPages: number;

    allPayments: IPayment[];

    settlements: ISettlement[];
    warehouses: string[];
    selectedSettlementRef: string;

    selectedSort: OrderSorts;
    selectedPage: number;
    searchString: string;
    startDate: Date;
    endDate: Date;

    selectedAll: boolean;
    selectedOrderIds: Set<number>;

    isLoading: boolean;

    constructor() {
        makeAutoObservable(this);
        this.apiError = '';
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

        this.selectedSort = OrderSorts.NONE;
        this.selectedPage = 1;
        this.searchString = '';
        this.startDate = new Date("2022-01-01");
        this.endDate = new Date();

        this.selectedAll = false;
        this.selectedOrderIds = new Set<number>();
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

    async fetchOrders() {
        const pageOrders = await orderService.getOrders(this.selectedPage, this.startDate, this.endDate, this.selectedSort, this.searchString);
        this.orders = pageOrders.elements;
        this.selectedPage = pageOrders.currentPage;
        this.maxPages = pageOrders.maxPages;
        this.maxOrders = pageOrders.maxElements;

        this.selectedOrderIds.clear();
    }

    async placeOrder(order: IOrder): Promise<boolean> {
        try {
            await orderService.createOrder(order);
            return true;
        } catch (e) {
            this.apiError = orderService.getError();
            return false;
        }
    }

    toggleSelectAll() {
        this.selectedAll = !this.selectedAll;
        if (this.selectedAll) {
            this.orders.forEach(o => this.selectedOrderIds.add(o.id));
        } else {
            this.selectedOrderIds.clear();
        }
    }

    toggleSelectOrder(orderId: number) {
        if (!this.selectedOrderIds.has(orderId)) {
            this.selectedOrderIds.add(orderId);
        } else {
            this.selectedOrderIds.delete(orderId);
        }
        this.selectedAll = this.selectedOrderIds.size === this.orders.length;
    }

    async setSearchString(searchString: string) {
        this.searchString = searchString;
    }

    async setDateInterval(startDate: Date, endDate: Date) {
        if (startDate > endDate) {
            return;
        }

        this.startDate = startDate;
        this.endDate = endDate;
    }

    async nextPage() {
        if (this.selectedPage == this.maxPages) {
            return;
        }
        ++this.selectedPage;
    }

    async backPage() {
        if (this.selectedPage == 1) {
            return;
        }
        --this.selectedPage;
    }

    async deleteSelectedOrders() {
        if (this.selectedOrderIds.size == 0) {
            return;
        }

        const selectedOrderIds = Array.from(this.selectedOrderIds);
        try {
            await orderService.deleteSelectedOrders(selectedOrderIds);
            this.orders = this.orders.filter(o => !selectedOrderIds.includes(o.id));
            this.selectedOrderIds.clear();

            this.fetchOrders();
        } catch (e) {
            console.log(orderService.getError());
        }
    }

    async changeStatus(orderId: number, newStatus: OrderStatus) {
        const order = this.orders.find(o => o.id == orderId);
        if (order) {
            const updatedStatus = await orderService.changeOrderStatus(orderId, newStatus);
            order.status = updatedStatus;
        }
    }
}

export default new OrderStore();