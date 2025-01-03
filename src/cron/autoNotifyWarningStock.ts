import {CronJob} from "cron";
import {container} from "../container";
import {ISkuService} from "../modules/catalog/sku/service/ISkuService";
import {TYPES} from "../types";

export const cronAutoNotifyWarningStock = CronJob.from({
    cronTime: "0 22 * * *",
    onTick: async () => {
        const skuService = container.get<ISkuService>(TYPES.ISkuService);
        const result = await skuService.findWarningStock();
        if(result.isOk()){
            console.log("Found sku warning stock",result.value)
        }
    },
    start: false,
    timeZone: "Asia/Ho_Chi_Minh",
})