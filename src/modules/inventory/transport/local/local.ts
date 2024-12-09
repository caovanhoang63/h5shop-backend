import {Inventory, InventoryItemCreate} from "../../entity/inventory";
import {ResultAsync} from "../../../../libs/resultAsync";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {IAppContext} from "../../../../components/appContext/appContext";
import {InventoryBiz} from "../../biz/biz";
import {InventoryMysqlRepo} from "../../repository/mysql/mysqlInventoryRepo";
import {Nullable} from "../../../../libs/nullable";
import {AppError} from "../../../../libs/errors";

interface IInventoryBiz {
    CreateNewItem: (item: InventoryItemCreate) => ResultAsync<void>;
    ListItems: (condition: ICondition, paging: Paging) => ResultAsync<Inventory[]>;
    UpdateItem: (id: number, item: Partial<Inventory>) => ResultAsync<void>;
    DeleteItem: (id: number) => ResultAsync<void>;
}

export class InventoryLocal {
    private readonly inventoryBiz: IInventoryBiz;

    constructor(private readonly appContext: IAppContext) {
        this.inventoryBiz = new InventoryBiz(new InventoryMysqlRepo(appContext.GetDbConnectionPool()));
    }

    public CreateNewItem = async (item: InventoryItemCreate): Promise<[number, Nullable<AppError>]> => {
        const result = await this.inventoryBiz.CreateNewItem(item);
        if (result.isErr()) {
            return [0, result.error!];
        }
        return [1, null];
    }

    public ListItems = async (condition: ICondition, paging: Paging): Promise<[Inventory[], Nullable<AppError>]> => {
        const result = await this.inventoryBiz.ListItems(condition, paging);
        if (result.isErr()) {
            return [[], result.error!];
        }
        return [result.data!, null];
    }

    public UpdateItem = async (id: number, item: Partial<Inventory>): Promise<[boolean, Nullable<AppError>]> => {
        const result = await this.inventoryBiz.UpdateItem(id, item);
        if (result.isErr()) {
            return [false, result.error!];
        }
        return [true, null];
    }

    public DeleteItem = async (id: number): Promise<[boolean, Nullable<AppError>]> => {
        const result = await this.inventoryBiz.DeleteItem(id);
        if (result.isErr()) {
            return [false, result.error!];
        }
        return [true, null];
    }
}

