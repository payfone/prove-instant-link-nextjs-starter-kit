
export type ProveInstantLinkResponse = {
    Response: InstantLinkResponse;
}

export type InstantLinkResponse = {
    LinkClicked: boolean;
    PhoneNumber: string;
    // For more information see Prove Documentation
}
