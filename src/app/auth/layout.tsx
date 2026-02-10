export default function AuthLayout({children}: Readonly<{children: React.ReactNode}>) {
    return(
        <main className="max-w-100 mx-auto px-2 sm:px-4 mt-10">
            {children}
        </main>
    );
}