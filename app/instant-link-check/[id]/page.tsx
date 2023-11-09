"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Verifier = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [pageStatus, setStatus] = useState("Checking");

  const id = params?.id;
  const vfp = searchParams?.get("vfp");

  useEffect(() => {
    authFinish()
  }, []);

  async function authFinish() {
    const httpRes = await fetch("/api/instant-link-finish", {
        method: "POST",
        body: JSON.stringify({
          id: id,
          vfp: vfp,
        }),
      })
  
      try {
        const response = await httpRes.json();
        if (response.success) {
            setStatus("Verified");
        } else {
            setStatus("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error(error)
        setStatus("Something went wrong. Please try again.");
      }
  }

  return (
    <div className="container h-full items-center m-auto grid grid-cols-1 w-full">
      <div className="w-[80%] mx-auto flex flex-col items-center">
        <div className="bg-white border border-black-400 p-4">
          <div className="container px-5 py-24 mx-auto">
            <div className="text-center">
              {pageStatus === "Checking" && <div className="text-black">Checking...</div>}
              {pageStatus === "Verified" && <div className="text-black">Verified!</div>}
              {
                // Error
                pageStatus !== "Verified" && pageStatus !== "Checking" && (
                  <div className="text-black">An error has occurred please try again.</div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Verifier;
