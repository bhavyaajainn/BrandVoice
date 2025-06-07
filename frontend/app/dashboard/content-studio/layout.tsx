'use client';

import Layout from './components/Layout';

export default function ContentStudioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Layout>{children}</Layout>;
} 