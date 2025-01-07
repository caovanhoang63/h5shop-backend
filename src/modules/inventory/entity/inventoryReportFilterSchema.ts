import { baseFilterSchema } from "../../../libs/BaseFilterSchema";
import Joi from "joi";

export const inventoryReportFilterSchema = baseFilterSchema.keys({
    warehouseMan1: Joi.number(),
    lk_Id: Joi.number(),
});

