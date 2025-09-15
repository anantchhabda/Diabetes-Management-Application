"use client";
import Script from "next/script";

export default function Page() {

  return (
    <>
      <div id="onboard-host" />
      <Script src="/patient-onboarding.js" strategy="afterInteractive" />
    </>
  );
}
