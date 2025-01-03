import { baseFilterSchema } from "../../../libs/BaseFilterSchema";
import Joi from "joi";

export const inventoryReportFilterSchema = baseFilterSchema.keys({
    warehouseMan1: Joi.number(),
    fromDate: Joi.date(),
    toDate: Joi.date(),
    lk_Id: Joi.number(),
});

