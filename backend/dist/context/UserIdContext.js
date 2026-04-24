"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUser = exports.UserProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// UserContext.tsx
const react_1 = require("react");
const UserContext = (0, react_1.createContext)(undefined);
const UserProvider = ({ children, }) => {
    const [userId, setUserId] = (0, react_1.useState)('');
    return ((0, jsx_runtime_1.jsx)(UserContext.Provider, { value: { userId, setUserId }, children: children }));
};
exports.UserProvider = UserProvider;
const useUser = () => {
    const context = (0, react_1.useContext)(UserContext);
    if (!context)
        throw new Error('useUser must be used inside UserProvider');
    return context;
};
exports.useUser = useUser;
//# sourceMappingURL=UserIdContext.js.map