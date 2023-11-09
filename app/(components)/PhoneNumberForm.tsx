"use client";

interface PhoneNumberFormProps {
  phoneNumber: string;
  setPhoneNumber: Function;
  setStep: Function;
  userId: string;
}

const PhoneNumberForm = ({
  phoneNumber,
  setPhoneNumber,
  setStep,
  userId,
}: PhoneNumberFormProps) => {
  const handleFormSubmission = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const httpRes = await fetch("/api/instant-link-start", {
      method: "POST",
      body: JSON.stringify({
        phoneNumber,
        userId,
      }),
    });

    try {
      const response = await httpRes.json();
      if (response) {
        sendSMS(response.AuthenticationUrl)
      } else {
        // Display an error for the user and/or log the issue
      }
    } catch (e) {
      console.error(e);
    }
  };

  async function sendSMS(authURL: string) {
    const httpRes = await fetch("/api/send-sms", {
      method: "POST",
      body: JSON.stringify({
        phoneNumber,
        authURL,
      }),
    });

    try {
      const response = await httpRes.json();
      if (response.success) {
        // Move on to Polling Process as the SMS has been delivered
        setStep(2);
      } else {
        // Display an error for the user and/or log the issue
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="container h-full items-center m-auto grid grid-cols-1 w-full">
      <div className="w-[80%] mx-auto flex flex-col items-center">
        <div className="bg-white border border-black-400 h-[400px] w-[400px] p-4">
          <form
            onSubmit={handleFormSubmission}
            className="w-full m-auto h-full flex flex-col justify-center"
            autoComplete="off"
          >
            <label className="text-sm font-thin" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              placeholder={"+18002009219"}
              value={phoneNumber}
              autoComplete="off"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`w-full p-4 rounded border focus:outline-none focus:border-[#814DFA]`}
            />

            <button
              type="submit"
              className="text-white focus:outline-none rounded mt-4 p-3 sm:h-8 md:h-12 lg:h-14 bg-black hover:bg-gray-800"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhoneNumberForm;
