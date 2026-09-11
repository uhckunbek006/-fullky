"use client";

import Login from "@/src/components/lip/login/Login";
import Register from "@/src/components/lip/login/Register";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  if (mode === "register") {
    return <Register />;
  }

  return <Login />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div />}>
      <LoginPageContent />
    </Suspense>
  );
}
