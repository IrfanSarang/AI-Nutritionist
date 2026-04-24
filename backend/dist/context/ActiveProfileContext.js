"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useActiveProfile = exports.ActiveProfileProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const url_1 = __importDefault(require("../config/url"));
const ActiveProfileContext = (0, react_1.createContext)(undefined);
const ActiveProfileProvider = ({ children, }) => {
    const [activeProfileId, setActiveProfileId] = (0, react_1.useState)(null);
    const [activeProfileName, setActiveProfileName] = (0, react_1.useState)(null);
    // Whenever profileId changes, fetch name from backend
    (0, react_1.useEffect)(() => {
        const fetchProfileName = async () => {
            if (!activeProfileId) {
                setActiveProfileName(null);
                return;
            }
            try {
                // Assuming backend endpoint returns profile details by ID
                const res = await fetch(`${url_1.default}/api/users/${activeProfileId}/fetchName`);
                const data = await res.json();
                if (res.ok && data.name) {
                    setActiveProfileName(data.name);
                }
                else {
                    setActiveProfileName('Guest');
                }
            }
            catch (err) {
                console.error('Failed to fetch profile name:', err);
                setActiveProfileName(null);
            }
        };
        fetchProfileName();
    }, [activeProfileId]);
    return ((0, jsx_runtime_1.jsx)(ActiveProfileContext.Provider, { value: { activeProfileId, activeProfileName, setActiveProfileId }, children: children }));
};
exports.ActiveProfileProvider = ActiveProfileProvider;
const useActiveProfile = () => {
    const context = (0, react_1.useContext)(ActiveProfileContext);
    if (!context) {
        throw new Error('useActiveProfile must be used within an ActiveProfileProvider');
    }
    return context;
};
exports.useActiveProfile = useActiveProfile;
//# sourceMappingURL=ActiveProfileContext.js.map