// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning> 
      <body className="bg-[#F5F2ED] text-[#4A3728] selection:bg-[#D2B48C] selection:text-white">
        {children}
      </body>
    </html>
  );
}