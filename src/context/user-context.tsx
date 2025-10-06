
"use client"

import * as React from "react";
import { users } from "@/lib/data";
import type { User } from "@/lib/types";

type UserContextType = {
    user: User;
    setUserRole: (role: 'Admin' | 'Gerente' | 'Cajero') => void;
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User>(users.find(u => u.role === 'Admin')!);

    const setUserRole = (role: 'Admin' | 'Gerente' | 'Cajero') => {
        const newUser = users.find(u => u.role === role);
        if (newUser) {
            setUser(newUser);
        }
    };
    
    return (
        <UserContext.Provider value={{ user, setUserRole }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = React.useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
