import {ISkuRepository} from "./ISkuRepository";
import {SkuCreate} from "../entity/skuCreate";
import {okAsync, ResultAsync} from "neverthrow";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {Sku} from "../entity/sku";
import {Err} from "../../../../libs/errors";
import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {ResultSetHeader} from "mysql2";

export class SkuMysqlRepo extends BaseMysqlRepo implements ISkuRepository{
    upsertMany(records: SkuCreate[]): ResultAsync<void, Err> {
        const placeholders = records.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(',');

        const query = `
            INSERT INTO sku (id, spu_id, sku_tier_idx, images, cost_price, price, stock) 
            VALUES ${placeholders}
            ON DUPLICATE KEY UPDATE 
                sku_tier_idx = VALUES(sku_tier_idx),
                images = VALUES(images),
                cost_price = VALUES(cost_price),
                price = VALUES(price),
                stock = VALUES(stock)
            `;

        const params = records.flatMap(c => [
            c.id || null,
            c.spuId,
            JSON.stringify(c.skuTierIdx),
            JSON.stringify(c.images),
            c.costPrice,
            c.price,
            c.stock
        ]);

        return this.executeQuery(query, params).andThen(
            ([r, f]) => {
                return okAsync(undefined);
            }
        );
    }

    list(cond: ICondition, paging: Paging): ResultAsync<Sku[] | null, Err> {
        throw("");
    }
}