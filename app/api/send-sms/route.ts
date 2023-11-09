import { NextRequest, NextResponse } from "next/server";
import { ProveService } from "../(services)/prove.service";

export async function POST(request: NextRequest) {
  const { phoneNumber, authURL } = await request.json();

  // Instantiate the Prove Service
  const proveService = new ProveService();

  try {
    // Send the SMS and immediately return and OK to
    // the browser app to start the wait process
    await proveService.sendSMS(phoneNumber, authURL);

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false });
  }
}
