import {cronAutoNotifyWarningStock} from "./autoNotifyWarningStock";

export const startAutoNotifyWarningStock = () => {
    cronAutoNotifyWarningStock.start();
}