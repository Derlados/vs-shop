import { axiosNVInstance } from "..";
import { ISettlement } from "../../types/novaposhta/ISettlement";
import { IWarehouse } from "../../types/novaposhta/IWarehouse";
import { Service } from "../service";

interface NVResData {
    success: boolean;
    data: any[];
}

enum WarehouseType {
    POSTAL = "841339c7-591a-42e2-8233-7a0a00f0ed6f",
    CARGO = "9a68df70-0267-42a8-bb5c-37f427e36ee4"
}

class NovaposhtaService extends Service {
    private readonly API_KEY;

    constructor(apiUrl: string) {
        super(apiUrl);
        this.API_KEY = process.env.REACT_APP_NOVAPOSHTA_API_KEY;
    }

    async getSettlements(searchString: string): Promise<ISettlement[]> {
        const body = this.getSettlementsBody(searchString);
        const { data } = await axiosNVInstance.post<NVResData>('', body);
        return this.parseSettlements(data.data);
    }

    async getWarehouses(settlementRef: string): Promise<IWarehouse[]> {
        const postalBody = this.getWarehousesBody(settlementRef, WarehouseType.POSTAL);
        const cargoBody = this.getWarehousesBody(settlementRef, WarehouseType.CARGO);

        const postalWarehouses = axiosNVInstance.post<NVResData>('', postalBody);
        const cargoWarehouses = axiosNVInstance.post<NVResData>('', cargoBody);

        const warehouses = [...(await postalWarehouses).data.data, ...(await cargoWarehouses).data.data];
        return warehouses.map((w) => {
            return {
                siteKey: w.SiteKey,
                region: w.RegionCity,
                postcode: w.PostalCodeUA,
                address: w.Description
            }
        });
    }

    private getSettlementsBody(searchString: string) {
        return {
            apiKey: this.API_KEY,
            modelName: "Address",
            calledMethod: "getCities",
            methodProperties: {
                FindByString: searchString
            }
        }
    }

    private getWarehousesBody(settlementRef: string, warehouseType: WarehouseType) {
        return {
            apiKey: this.API_KEY,
            modelName: "Address",
            calledMethod: "getWarehouses",
            methodProperties: {
                CityRef: settlementRef,
                TypeOfWarehouseRef: warehouseType,
                Language: "UA"
            }
        }
    }

    private parseSettlements(data: any[]): ISettlement[] {
        const settlements: ISettlement[] = data.map((d) => {
            console.log(d);
            return {
                ref: d.Ref,
                name: d.Description,
                area: d.AreaDescription,
                settlementType: d.SettlementTypeDescription,
            }
        })
        return settlements;
    }
}

export default new NovaposhtaService('');