import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ProveService } from "../(services)/prove.service";
import { docClient } from "../(constants)/dynamo";

export async function POST(request: NextRequest) {
  const { phoneNumber, userId } = await request.json();

  // Get initiated IP of the user to send to the Prove API
  let ip = getUserIP(request);

  const uuid = randomUUID();

  // Instantiate the Prove Service
  const proveService = new ProveService();

  // Call the getAuthUrl method which calls the first Instant Link Prove Endpoint
  const authURLData = await proveService.getAuthUrl(ip, phoneNumber, uuid);

  // Create session record to track mobile web events if necessary
  await createSessionRecord(uuid, userId)

  return NextResponse.json(authURLData);
}

function getUserIP(request: NextRequest): string {
  let ip = request.ip ?? request.headers.get("x-real-ip");
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? "Unknown";
  }

  return ip || "127.0.0.1";
}

async function createSessionRecord(uuid: string, userId: string) {

    const command = new PutCommand({
        TableName: process.env.INSTANT_LINK_SESSION_TRACKING_TABLE_NAME,
        Item: {
            user_id: userId,
            session_uuid: uuid,
            mfa_complete: false
        },
      });
    
      await docClient.send(command);
}
 
