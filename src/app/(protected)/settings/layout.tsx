import Navigation from "./_components/Navigation";

export default function SettingsLayout({children}: Readonly<{children: React.ReactNode}>) {
    return(
        <div className="flex w-full">
            <div className="w-[300px]"></div>
            <Navigation/>
            <div className="flex flex-1 justify-center">
                {children}
            </div>
            <div className="w-[300px]"></div>
        </div>
    );
}