import {IBaseFilter} from "../../../libs/BaseFilterSchema";

export interface AuditFilter extends IBaseFilter {
    objectType?: string[]
    action?: string[]
}
