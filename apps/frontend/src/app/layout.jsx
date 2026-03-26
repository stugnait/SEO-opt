import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "IT Blog",
    description: "Modern IT blog",
};

export default function RootLayout({ children }) {
    return (
        <html lang="uk">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
        >
        {/* HEADER ДОДАЛИ */}
        <Header />

        {children}
        </body>
        </html>
    );
}