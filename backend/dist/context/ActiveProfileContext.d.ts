import React, { ReactNode } from 'react';
type ActiveProfileContextType = {
    activeProfileId: string | null;
    activeProfileName: string | null;
    setActiveProfileId: (id: string | null) => void;
};
export declare const ActiveProfileProvider: React.FC<{
    children: ReactNode;
}>;
export declare const useActiveProfile: () => ActiveProfileContextType;
export {};
//# sourceMappingURL=ActiveProfileContext.d.ts.map