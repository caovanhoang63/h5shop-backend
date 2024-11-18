// import {injectable} from "inversify";
// import {IAuditRepository} from "./IAuditRepository";
// import {ResultAsync} from "neverthrow";
// import {Paging} from "../../../libs/paging";
// import {Audit} from "../entity/audit";
// import {prisma} from "../../../components/prisma";
// import {createDatabaseError, Err} from "../../../libs/errors";
// import e from "cors";
//
// @injectable()
// export class AuditPrmRepo implements IAuditRepository {
//     create(u: Audit): ResultAsync<void, Err> {
//         return ResultAsync.fromPromise(
//             prisma.auditLog.create({data: u}).then(r => {
//             }),
//             e => createDatabaseError(e)
//         );
//     }
//     list(condition: any, paging: Paging): ResultAsync<Audit[], Err> {
//         return ResultAsync.fromPromise(
//             prisma.auditLog.count({where: condition}).then(r => {
//                 paging.total = r
//             }),
//             r => createDatabaseError(e)
//         ).andThen(
//             r => ResultAsync.fromPromise(
//                 prisma.auditLog.findMany({
//                     where: condition,
//                     cursor: paging.cursor ? {id: paging.cursor} : undefined,
//                     take: paging.limit,
//                     skip: paging.cursor ? undefined : (paging.page - 1) * paging.limit
//                 }).then(r => r),
//                 e => createDatabaseError(e)
//             )
//         )
//     }
//
//
//
// }