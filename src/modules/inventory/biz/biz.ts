import { InventoryItemCreate, Inventory } from "../entity/inventory";
import { ResultAsync } from "../../../libs/resultAsync";
import { ICondition } from "../../../libs/condition";
import { Paging } from "../../../libs/paging";

interface IInventoryRepository {
    Create: (item: InventoryItemCreate) => ResultAsync<void>;
    FindByCondition: (condition: ICondition, paging: Paging) => ResultAsync<Inventory[]>;
    Update: (id: number, item: Partial<Inventory>) => ResultAsync<void>;
    Delete: (id: number) => ResultAsync<void>;
}

export class InventoryBiz {
    constructor(private readonly inventoryRepository: IInventoryRepository) {}

    public CreateNewItem = (item: InventoryItemCreate): ResultAsync<void> => {
        return this.inventoryRepository.Create(item);
    }

    public ListItems = (condition: ICondition, paging: Paging): ResultAsync<Inventory[]> => {
        return this.inventoryRepository.FindByCondition(condition, paging);
    }

    public UpdateItem = (id: number, item: Partial<Inventory>): ResultAsync<void> => {
        return this.inventoryRepository.Update(id, item);
    }

    public DeleteItem = (id: number): ResultAsync<void> => {
        return this.inventoryRepository.Delete(id);
    }
}

