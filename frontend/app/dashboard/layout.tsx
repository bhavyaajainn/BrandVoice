'use client';

import React from 'react';
import Header from "./components/Header";
import { useAuthContext } from '@/lib/AuthContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthContext();
  
  // Extract first letter of email for avatar fallback if no brand name is set
  const avatarFallback = user?.email ? user.email.charAt(0).toUpperCase() : "B";
  
  // Use photoURL as logo if available
  const logo = user?.photoURL || null;
  
  // Use displayName as brand name if available
  const brandName = user?.displayName || (user?.email ? user.email.split('@')[0] : null);

  return (
    <div>
      <Header logo={logo} brandName={brandName} />
      {children}
    </div>
  );
}