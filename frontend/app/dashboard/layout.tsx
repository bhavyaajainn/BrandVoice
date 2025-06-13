"use client";

import React from "react";
import Header from "./components/Header";
import { useAuthContext } from "@/lib/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthContext();

  const logo = user?.photoURL || null;

  const brandName =
    user?.displayName || (user?.email ? user.email.split("@")[0] : null);

  return (
    <div>
      <Header logo={logo} brandName={brandName} />
      {children}
    </div>
  );
}
