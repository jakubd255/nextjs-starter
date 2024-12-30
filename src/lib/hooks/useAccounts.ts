import { Account } from "@prisma/client";
import { useState } from "react";

export default function useAccounts(initialData: Account[]) {
    const [accounts, setAccounts] = useState<Account[]>(initialData);

    const getAccount = (providerName: string) => {
        return accounts.find(a => a.providerName === providerName);
    }

    const deleteAccount = (providerName: string) => {
        setAccounts(accounts => accounts.filter(a => a.providerName !== providerName));
    }

    return {accounts, getAccount, deleteAccount};
}