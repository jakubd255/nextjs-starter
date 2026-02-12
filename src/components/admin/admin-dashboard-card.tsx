import { LucideProps } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface AdminDashboardCardProps {
    label: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    href: string;
}

export default function AdminDashboardCard(props: AdminDashboardCardProps) {
    return(
        <Link href={props.href}>
            <div className="p-3 flex flex-col gap-2 items-center rounded-lg border">
                <props.icon size={100}/>
                <span>
                    {props.label}
                </span>
            </div>
        </Link>
    );
}