"use client";

import dynamic from "next/dynamic";

const BasesMap = dynamic(() => import("./basesMap/BasesMap"), { ssr: false });

export default function BasesMapWrapper() {
  return <BasesMap />;
}
