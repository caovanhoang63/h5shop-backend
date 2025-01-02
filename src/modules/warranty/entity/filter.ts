import {IBaseFilter} from "../../../libs/BaseFilterSchema";

export interface WarrantyFilter extends IBaseFilter {
    lkCustomerPhoneNumber?: string;
}