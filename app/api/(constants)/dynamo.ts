import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

function createDynamoDBClient() {
    return new DynamoDBClient({
        region: process.env.REGION!,
        credentials: {
            accessKeyId: process.env.ACCESS_KEY!,
            secretAccessKey: process.env.SECRET_KEY!,
            sessionToken: process.env.SESSION_TOKEN!
        }
    });
}

function getDocClient() {
    return DynamoDBDocumentClient.from(createDynamoDBClient());
}


export const docClient = getDocClient();