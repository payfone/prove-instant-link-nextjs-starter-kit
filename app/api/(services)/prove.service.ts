import { v4 as uuidv4 } from "uuid";
import { AuthUrlResponse, ProveAuthUrlApiResponse } from "../(models)/InstantLinkStart.model";
import { ProveSendSMSReponse } from "../(models)/SendSms.model";
import { InstantLinkResponse, ProveInstantLinkResponse } from "../(models)/InstantLinkFinish.model";

export class ProveService {

  private apiClientId = "";
  private subClientId = "";
  private mfaClientId = "";
  private sendSMSURL = "";
  private mfaLicenseKey = '';

  constructor() {
    // Prove Parent Key (AID)
    this.apiClientId = process.env.API_CLIENT_ID!;
    // Prove Sub/Child Key (SAID)
    this.subClientId = process.env.API_SUB_CLIENT_ID!;
    // Prove MFA Client Identifier
    this.mfaClientId = process.env.MFA_CLIENT_ID!;
    // Prove MFA Send SMS URL for SMS Delivery
    this.sendSMSURL = process.env.MFA_SEND_SMS_URL!;
    // Prove MFA Auth Key
    this.mfaLicenseKey = process.env.MFA_LICENSE_KEY!;
  }

  public async getAuthUrl(
    sourceIp: string,
    phone: string,
    uuid: string
  ): Promise<AuthUrlResponse> {

    const requestId = `INSTANT-LINK-EXAMPLE-START-${uuidv4()}`;

    try {
      // Add the session UUID to be captured later in the flow to be able
      // to successfully mark our users record as true
      const finalTargetUrl = `${process.env.WEB_APP_URL}/${uuid}`;

      const proveResult: ProveAuthUrlApiResponse = await proveFetch(
        process.env.PROVE_INSTANT_LINK_START_URI!,
        {
          body: JSON.stringify({
            // ID used to uniquely identity requests
            RequestId: requestId,
            // Session ID to uniquely identity a session
            SessionId: uuid,
            ApiClientId: this.apiClientId,
            SubClientId: this.subClientId,
            SourceIp: sourceIp,
            // The URL we ultimately want the user to be directed to at
            // the end of the flow
            FinalTargetUrl: finalTargetUrl,
            MobileNumber: phone,
          }),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          method: "POST",
        }
      );

      return {
        ...proveResult.Response,
      } as AuthUrlResponse;
    } catch (e) {
      console.error("Get Auth URL Failed", e);
      throw e;
    }
  }

  public async getAuthFinish(
    vfp: string
  ): Promise<InstantLinkResponse> {
    const requestId = `INSTANT-LINK-EXAMPLE-FINISH-${uuidv4()}`;

    try {

      const proveResult: ProveInstantLinkResponse = await proveFetch(
        process.env.PROVE_INSTANT_LINK_FINISH_URI!,
        {
          body: JSON.stringify({
            RequestId: requestId,
            ApiClientId: this.apiClientId,
            SubClientId: this.subClientId,
            VerificationFingerprint: vfp
          }),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          method: "POST",
        }
      );

      return {
        ...proveResult.Response,
      } as InstantLinkResponse;
    } catch (e) {
      console.error("Get Instant Link Result Failed", e);
      throw e;
    }
  }

  public async sendSMS(
    phone: string,
    link: string,
  ): Promise<ProveSendSMSReponse> {
    const requestId = uuidv4();
    try {
      const body = 
        {
            clientId: this.mfaClientId,
            app: "SmsDelivery",
            clientContext: requestId,
            license: this.mfaLicenseKey,
            data: {
                phoneNumber: phone,
                namedData: {
                    messageText: `Your verification link is: ${link}.`
                }
            }
        }
      
      const proveResult = await fetch(this.sendSMSURL, {
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
          "Request-Id": requestId,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!proveResult.ok) {
        throw new Error(`HTTP error on Send SMS! status: ${proveResult.status}`);
      }

      return await proveResult.json();
    } catch (e) {
        console.error("Failed when calling Send SMS", e)
      throw e;
    }
  }
 }

async function proveFetch(path: string, params: RequestInit) {
  let data
  try {
      data = await fetch(process.env.PROVE_URL! + path, params)
  } catch (error) {
      console.error(error)
      throw error;
  }

  return await data.json();
}