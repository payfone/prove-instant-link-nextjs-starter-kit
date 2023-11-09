"use client";

import { useState } from "react";
import PhoneNumberForm from "./PhoneNumberForm";
import { v4 as uuid } from 'uuid';
import AwaitUserClickScreen from "./AwaitUserClickScreen";

const userId = uuid();

export default function InstantLinkProcessOrchestrator() {
  const [step, setStep] = useState<number>(1);

  const [phoneNumber, setPhoneNumber] = useState<string>('');

  return (
    <>
      {step === 1 && (
        <PhoneNumberForm
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          setStep={setStep}
          userId={userId}
        />
      )}
    {step === 2 && (
        <AwaitUserClickScreen
          userId={userId}
        />
      )}
    </>
  );
}
