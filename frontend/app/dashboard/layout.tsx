"use client";

import React from "react";
import Header from "./components/Header";
import { useAuthContext } from "@/lib/AuthContext";
import { Provider } from 'react-redux'
import { store } from "@/lib/store";
import Footer from "@/components/layout/Footer";

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
      <Provider store={store}>

        <Header logo={logo} brandName={brandName} />
        {children}
        <Footer />
      </Provider>
    </div>
  );
}
