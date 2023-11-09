"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AwaitUserClickScreenProps {
  userId: string
}

const AwaitUserClickScreen = ({userId}: AwaitUserClickScreenProps) => {
  const router = useRouter();

  useEffect(() => {
    // Start checking for updates immediately on render
    startPolling();
  }, []);

  async function startPolling() {
    const elapsedTime = Date.now() - Date.now();

    // Stop polling after 5 minutes
    if (elapsedTime > 300000) {
      return;
    }

      const httpRes = await fetch("/api/click-status", {
        method: "POST",
        body: JSON.stringify({
          userId,
        }),
      });

      try {
        const response = await httpRes.json()

        if (response.verified) {
          // Boom! Verified. The user clicked the link and their record has been updated
          router.push(`/home`);
        } else {
          setTimeout(startPolling, 5000);
        }
      } catch (error) {
        // Provide Error Handling
      }
  }


  return (
    <div className="container h-full items-center m-auto grid grid-cols-1 w-full">
      <div className="w-[80%] mx-auto flex flex-col items-center">
        <div className="bg-white border border-black-400 h-[400px] w-[400px] p-4">
          <div className="container px-5 py-24 mx-auto">
              <div className="text-center">
                <h3
                  className={`font-semibold text-black`}
                >
                  Please check your phone
                </h3>
              </div>
              <div className="text-base font-normal text-black text-center mb-8 mt-[16px]">
                We sent a text message to your phone. Click on the link in the
                message to complete your registration.
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}


export default AwaitUserClickScreen;
