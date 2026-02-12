import AdminDashboardCard from "@/components/admin/admin-dashboard-card";
import { countUsersAdmin } from "@/db/queries/users";
import { Users } from "lucide-react";

export default async function AdminPage() {
    const users = await countUsersAdmin({});

    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                Admin dashboard
            </h1>
            <div className="flex flex-wrap gap-x-5 gap-y-2 h-min">
                <AdminDashboardCard href="/admin/users" label={`${users} users`} icon={Users}/>
            </div>
        </div>
    );
}