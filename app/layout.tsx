import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "VivoEdu - English Quiz",
    description: "Test your English knowledge with our interactive quiz",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
