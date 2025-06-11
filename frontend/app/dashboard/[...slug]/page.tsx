// app/dashboard/[...slug]/page.tsx
import { notFound } from 'next/navigation';

// This file acts as a catch-all for any non-existent dashboard routes
export default function CatchAllPage() {
  // Trigger the not-found page
  notFound();
}