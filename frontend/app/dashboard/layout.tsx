import Header from "./components/Header";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <>
            <Header logo={null} brandName={null} />
            {children}
        </>
    );
}
