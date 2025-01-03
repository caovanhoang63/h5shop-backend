import {ok, okAsync, ResultAsync} from "neverthrow";
import {BaseMysqlRepo} from "../../../components/mysql/BaseMysqlRepo";
import {Revenue} from "../entity/revenue";
import {IReportRepo} from "./IReportRepo";
import {RowDataPacket} from "mysql2";
import {injectable} from "inversify";
import {SkuOrder} from "../entity/skuOrder";
import {Sale} from "../entity/sale";
import {SqlHelper} from "../../../libs/sqlHelper";
import {SkuStock} from "../entity/skuStock";

@injectable()
export class ReportMysqlRepo extends BaseMysqlRepo implements IReportRepo {
    totalOrder(startDate: Date, endDate: Date): ResultAsync<number, Error> {
        const query = `
            SELECT count(*) as count
            FROM \`order\`
            WHERE \`order\`.status = 2
              AND DATE(created_at) >= DATE(?)
              AND DATE(created_at) <= DATE(?)
        `
        return this.executeQuery(query,[startDate,endDate]).andThen(
            ([r,f]) => {
                const firstRow = (r as any)[0];
                if (!firstRow) {
                    return okAsync(0);
                }
                return okAsync(firstRow.count);
            }
        )

    }
    revenue(startDate: Date, endDate: Date): ResultAsync<Revenue[], Error> {
        const query = `
            SELECT DATE(created_at) as date,
                   SUM(final_amount) as revenue,
                   COUNT(DISTINCT id) as totalOrder
            FROM \`order\`
            WHERE \`order\`.status = 2
              AND DATE(created_at) >= DATE(?)
              AND DATE(created_at) <= DATE(?)
            GROUP BY DATE(created_at);
        `

        return this.executeQuery(query,[startDate,endDate]).andThen(
            ([r,f]) => {
                const rows = r as RowDataPacket[]
                console.log(rows)
                return ok(rows.map(row => {
                    return row as Revenue
                }))
            }
        )
    }

    sale(startDate: Date, endDate: Date): ResultAsync<Sale[], Error> {
        const query = `
            SELECT o.*,
                   c.phone_number                         as customer_phone_number,
                   CONCAT(u.first_name, ' ', u.last_name) as seller_name
            FROM \`order\` o
                     LEFT JOIN user u on o.seller_id = u.id
                     LEFT JOIN customer c on o.customer_id = c.id
            WHERE o.status = 2
              AND DATE(o.created_at) >= DATE(?)
              AND DATE(o.created_at) <= DATE(?)
        `
        return this.executeQuery(query,[startDate,endDate]).andThen(
            ([r,f]) => {
                const rows = r as RowDataPacket[]
                return okAsync(rows.map(row => SqlHelper.toCamelCase(row)))
            }
        )
    }

    inventory(gtStock : number,ltStock: number) : ResultAsync<SkuStock[], Error> {
        const query = `
            SELECT
                sk.id,
                sp.name,
                sk.stock,
                sk.sku_tier_idx as idx,
                sk.status,
                JSON_ARRAYAGG(
                        JSON_OBJECT(
                                'name', attr.name,
                                'value', attr.value
                        )
                ) AS attributes
            FROM sku sk
                     JOIN spu sp ON  sp.id = sk.spu_id
                     LEFT JOIN sku_attr AS attr ON sk.spu_id = attr.spu_id
            WHERE sk.stock >= ? AND sk.stock <= ?
            GROUP BY sk.id , sp.id, sk.stock ORDER BY sk.stock;
        `
        console.log(gtStock,ltStock)
        return this.executeQuery(query,[gtStock,ltStock]).andThen(
            ([r,f]) => {
                const rows = r as RowDataPacket[]

                return ok(rows.map(row => {
                    let name = ""
                    row.attributes?.forEach( (r : {name : string,value : any[]}, i : number) => {
                        name += r.value?.[row.idx?.[i]] ?  ' ' +  r.name + ' ' + r.value?.[row.idx?.[i]] : ''
                    })
                    return {
                        id: row.id,
                        name : row.name + name,
                        stock: row.stock,
                        status: row.status
                    } as SkuStock
                }))
            }
        )
    }

    skuOrder(startDate: Date, endDate: Date,limit : number, order: string): ResultAsync<SkuOrder[], Error> {
        const query = `
            WITH sku_amounts AS (SELECT sk.id          as sku_id,
                                        SUM(oi.amount) as amount,
                                        sk.spu_id      as spu_id,
                                        SUM(oi.amount * oi.unit_price) as revenue 
                            
                                 FROM order_item oi
                                          JOIN \`order\` as o ON o.id = oi.order_id
                                          JOIN \`sku\` as sk ON sk.id = oi.sku_id
                                 WHERE o.status = 2
                                   AND DATE(o.created_at) >= DATE(?)
                                   AND DATE(o.created_at) <= DATE(?)
                                 GROUP BY sku_id
                                 ORDER BY ? 
                                 LIMIT ?
                                 )
            SELECT sa.sku_id as id,
                   sa.amount as amount,
                   sp.name as name,
                   sa.revenue as revenue,
                   sk.sku_tier_idx as idx,
                   JSON_ARRAYAGG(JSON_OBJECT(
                            'name',attr.name,
                           'value',attr.value)
                   ) AS attributes
            FROM sku_amounts AS sa
                     JOIN sku AS sk ON sa.sku_id = sk.id
                     JOIN spu AS sp ON sp.id = sa.spu_id
                     LEFT JOIN sku_attr AS attr ON sk.spu_id = attr.spu_id
            GROUP BY sa.sku_id, sk.spu_id, sa.amount
            ORDER BY sa.amount DESC;
        `
        return this.executeQuery(query,[startDate,endDate,order,limit]).andThen(
            ([r,f]) => {
                const rows = r as RowDataPacket[]

                return ok(rows.map(row => {
                    let name = ""
                    row.attributes?.forEach( (r : {name : string,value : any[]}, i : number) => {
                        name += r.value?.[row.idx?.[i]] ?  ' ' +  r.name + ' ' + r.value?.[row.idx?.[i]] : ''
                    })
                    return {
                        id: row.id,
                        name : row.name + name,
                        amount : parseInt(row.amount),
                        revenue : parseFloat(row.revenue),
                    } as SkuOrder
                }))
            }
        )
    }
}