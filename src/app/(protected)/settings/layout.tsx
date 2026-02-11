import SettingsNavigation from "@/components/settings/settings-navigation";

export default function SettingsLayout({children}: Readonly<{children: React.ReactNode}>) {
    return(
        <div className="w-full max-w-300 mx-auto flex flex-col md:flex-row gap-10">
            <SettingsNavigation/>
            <div className="flex flex-1 justify-center">
                {children}
            </div>
        </div>
    );
}