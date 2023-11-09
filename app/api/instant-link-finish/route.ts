import { NextRequest, NextResponse } from "next/server";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ProveService } from "../(services)/prove.service";
import { docClient } from "../(constants)/dynamo";
import { ScanCommand } from "@aws-sdk/client-dynamodb";

export async function POST(request: NextRequest) {
  const { id, vfp } = await request.json();

  const proveService = new ProveService();
  const authFinishData = await proveService.getAuthFinish(vfp);

  // Error handling on the data status code for SMS
  if (authFinishData.LinkClicked) {
    const command = new ScanCommand({
      TableName: process.env.INSTANT_LINK_SESSION_TRACKING_TABLE_NAME,
      FilterExpression: "session_uuid = :session_uuid",
      ExpressionAttributeValues: { ":session_uuid": { S: id } },
    });

    const user = await docClient.send(command);

    if (!user.Items) {
      return NextResponse.json({ error: "User does not exist" });
    }

    const updateCommand = new UpdateCommand({
      TableName: process.env.INSTANT_LINK_SESSION_TRACKING_TABLE_NAME,
      Key: {
        user_id: user.Items[0].user_id.S,
        session_uuid: id
      },
      UpdateExpression: "set mfa_complete = :mfa_complete",
      ExpressionAttributeValues: {
        ":mfa_complete": true,
      },
      ReturnValues: "ALL_NEW",
    });
    await docClient.send(updateCommand);

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Link not clicked" });
}
