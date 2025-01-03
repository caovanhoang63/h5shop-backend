import {SESClient} from "@aws-sdk/client-ses";
import dotenv from "dotenv";
import {SkuWarningStock} from "./modules/catalog/sku/entity/skuWarningStock";
dotenv.config();
const accessKeyId = process.env.AWS_ACCESS_KEY || "";
const secretAccessKey = process.env.AWS_SECRET_KEY || "";
export const SesClient = new SESClient({
    region: "ap-southeast-1",
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
});

export function generateEmailTemplate(products: SkuWarningStock[]): string {
    // Bắt đầu tạo nội dung HTML cho email
    let htmlTemplate = `
        <html>
            <head>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 10px;
                        text-align: left;
                        border: 1px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .low-stock {
                        color: red;
                    }
                </style>
            </head>
            <body>
                <h2>Cảnh báo mức tồn kho thấp</h2>
                <p>Danh sách các sản phẩm có mức tồn kho thấp:</p>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Sản Phẩm</th>
                            <th>SPU Name</th>
                            <th>Tồn Kho</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    // Thêm thông tin từng sản phẩm vào bảng
    products.forEach(product => {
        htmlTemplate += `
            <tr class="${product.stock < 10 ? 'low-stock' : ''}">
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.spuName}</td>
                <td>${product.stock}</td>
            </tr>
        `;
    });

    // Kết thúc HTML
    htmlTemplate += `
                    </tbody>
                </table>
                <p>Xin vui lòng kiểm tra lại và xử lý tình trạng tồn kho.</p>
            </body>
        </html>
    `;

    return htmlTemplate;
}

// export const inputEmailWaningStock = { // SendEmailRequest
//     Source: "h5inventory@h5shop.shop", // required
//     Destination: { // Destination
//         ToAddresses: [ // AddressList
//             "buithaihoang04gl@gmail.com",
//         ],
//         CcAddresses: [],
//         BccAddresses: [],
//     },
//     Message: { // Message
//         Subject: { // Content
//             Data: "Cảnh báo mức tồn kho!", // required
//             Charset: "UTF-8",
//         },
//         Body: { // Body
//             Html: {
//                 Data: "STRING_VALUE", // required
//                 Charset: "STRING_VALUE",
//             },
//         },
//     },
// };