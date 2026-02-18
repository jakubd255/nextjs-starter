import DeleteUserSection from "@/components/admin/users/delete-user-section";
import EmailSection from "@/components/admin/users/email-section";
import ProfileSection from "@/components/admin/users/profile-section";
import RoleSection from "@/components/admin/users/role-section";
import SecuritySection from "@/components/admin/users/security-section";
import { getUserById } from "@/db/queries/users";
import { validateRequest } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { forbidden, notFound } from "next/navigation";

interface AdminUserEditPageProps {
    params: Promise<{id: string}>;
}

export default async function AdminUserEditPage({params}: AdminUserEditPageProps) {
    const {id} = await params;

    const user = await getUserById(id);
    if(!user) {
        notFound();
    }

    const session = await validateRequest();
    const permissions = {
        access: hasPermission(session.user, "admin:access"),
        profile: hasPermission(session.user, "user:update:profile"),
        tokenResend: hasPermission(session.user, "token:resend"),
        security: hasPermission(session.user, "user:update:security"),
        role: hasPermission(session.user, "user:update:role"),
        delete: hasPermission(session.user, "user:delete")
    }

    if(!permissions.access || !session.user) {
        forbidden();
    }

    return(
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-4xl font-bold">
                Update user
            </h1>
            <div className="flex flex-col gap-6">
                {permissions.profile ? (
                    <ProfileSection user={user}/>
                ) : null}
                {permissions.tokenResend ? (
                    <EmailSection user={user}/>
                ) : null}
                {permissions.security ? (
                    <SecuritySection user={user}/>
                ) : null}
                {permissions.role ? (
                    <RoleSection user={user}/>
                ) : null}
                {permissions.delete ? (                    
                    <DeleteUserSection user={user} disabled={session.user.id === user.id}/>
                ) : null}
            </div>
        </div>
    );
}