export default function AuthLayout({children}: Readonly<{children: React.ReactNode}>) {
    return(
        <>
            <main className="flex flex-col items-center px-2 sm:px-4 mt-10">
                {children}
            </main>
        </>
    );
}