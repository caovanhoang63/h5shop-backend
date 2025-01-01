import {IBaseFilter} from "../../../libs/BaseFilterSchema";

export interface CustomerFilter extends IBaseFilter {
    lkPhoneNumber?: string;
}