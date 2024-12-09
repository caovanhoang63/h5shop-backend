import {IAppContext} from "../../../../components/appContext/appContext";
import {InventoryBiz} from "../../biz/biz";
import express from "express";
import {Inventory, InventoryItemCreate} from "../../entity/inventory";
import {AppResponse} from "../../../../libs/response";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {UserCreate} from "../../../user/entity/userVar";
import {SystemRole} from "../../../user/entity/user";


export class InventoryApi {
    private readonly appCtx: IAppContext;
    private readonly inventoryBiz: InventoryBiz;

    constructor(appCtx: IAppContext, biz: InventoryBiz) {
        this.appCtx = appCtx;
        this.inventoryBiz = biz;
    }

    public CreateNewItem: express.Handler = async (req, res, next) => {
        //const data: InventoryItemCreate = req.body;
        const data : InventoryItemCreate= {
            amount: 100, skuId:10,
        };
        const result = await this.inventoryBiz.CreateNewItem(data);
        if (result.isErr()) {
            res.status(result.error!.code).send(AppResponse.ErrorResponse(result.error!));
            return;
        }
        res.send(AppResponse.SimpleResponse(true));
    }

    public ListItems: express.Handler = async (req, res, next) => {
        const condition: ICondition = req.query;
        const paging: Paging = {
            cursor: 0,
            limit: parseInt(req.query.limit as string) || 10,
            page: parseInt(req.query.page as string) || 1,
            total: 0,
            nextCursor: 0
        };

        const result = await this.inventoryBiz.ListItems(condition, paging);
        if (result.isErr()) {
            res.status(result.error!.code).send(AppResponse.ErrorResponse(result.error!));
            return;
        }
        res.send(AppResponse.SimpleResponse(result.data!));
    }

    public UpdateItem: express.Handler = async (req, res, next) => {
        const id = parseInt(req.params.id);
        const data: Partial<Inventory> = req.body;
        const result = await this.inventoryBiz.UpdateItem(id, data);
        if (result.isErr()) {
            res.status(result.error!.code).send(AppResponse.ErrorResponse(result.error!));
            return;
        }
        res.send(AppResponse.SimpleResponse(true));
    }

    public DeleteItem: express.Handler = async (req, res, next) => {
        const id = parseInt(req.params.id);
        const result = await this.inventoryBiz.DeleteItem(id);
        if (result.isErr()) {
            res.status(result.error!.code).send(AppResponse.ErrorResponse(result.error!));
            return;
        }
        res.send(AppResponse.SimpleResponse(true));
    }
}

