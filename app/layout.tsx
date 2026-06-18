import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <header className="bg-gray-900 text-white p-4">
          <h1 className="text-2xl font-bold">
            Raumbuchungssystem
          </h1>
          <nav className="mt-2 flex gap-4">
            <Link href="/">Start</Link>
            <Link href="/rooms">Räume</Link>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
