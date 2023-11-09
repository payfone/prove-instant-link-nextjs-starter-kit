import { NextRequest, NextResponse } from "next/server";
import { docClient } from "../(constants)/dynamo";
import { ScanCommand } from "@aws-sdk/client-dynamodb";

export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  const command = new ScanCommand({
    TableName: process.env.INSTANT_LINK_SESSION_TRACKING_TABLE_NAME,
    FilterExpression: "user_id = :user_id",
    ExpressionAttributeValues: { ":user_id": { S: userId } },
  });

  const user = await docClient.send(command);

  // mfa_complete being the field marked as true once the user click flow
  // has been carried out
  return NextResponse.json({ verified: user!.Items![0].mfa_complete.BOOL });
}
