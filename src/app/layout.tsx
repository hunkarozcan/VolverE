import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Evolution Simulation",
    description: "A simulation of evolution using genetic algorithms",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}
