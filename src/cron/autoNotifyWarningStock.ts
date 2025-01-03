import {CronJob} from "cron";
import {container} from "../container";
import {ISkuService} from "../modules/catalog/sku/service/ISkuService";
import {TYPES} from "../types";
import {generateEmailTemplate, SesClient} from "../sesClient";
import {SendEmailCommand} from "@aws-sdk/client-ses";

export const cronAutoNotifyWarningStock = CronJob.from({
    cronTime: "*/30 * * * * *",
    onTick: async () => {
        const skuService = container.get<ISkuService>(TYPES.ISkuService);
        const result = await skuService.findWarningStock();
        if(result.isErr())
            return;
        if(!result.value)
            return;

        console.log("auto mail warning stock");

        if(result.value.length > 0){
            const sesClient = SesClient

            const emailTemplate = generateEmailTemplate(result.value);

            const inputEmailWaningStock = {
                Source: "h5inventory@h5shop.shop",
                Destination: {
                    ToAddresses: ["buithaihoang04gl@gmail.com"],
                    CcAddresses: [],
                    BccAddresses: [],
                },
                Message: {
                    Subject: {
                        Data: "Cảnh báo mức tồn kho!",
                        Charset: "UTF-8",
                    },
                    Body: {
                        Html: {
                            Data: emailTemplate,
                            Charset: "UTF-8",
                        },
                    },
                },
            };

            const sendEmailCommand = new SendEmailCommand(inputEmailWaningStock)
            try {
                const data = await sesClient.send(sendEmailCommand);
                console.log("Email sent successfully:", data);
            } catch (error) {
                console.error("Error sending email:", error);
            }
        }
    },
    start: false,
    timeZone: "Asia/Ho_Chi_Minh",
})