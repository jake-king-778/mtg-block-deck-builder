import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { iconMap } from "./icons";
export default function IconRenderer({ name, index }) {
    const totalStringSize = name.length;
    return (_jsxs("span", { children: ["[", [...name.toLowerCase()].map((char, idx) => {
                const foundIconEntry = iconMap[char] ? iconMap[char] : iconMap[0];
                const IconComponent = foundIconEntry.icon;
                const color = foundIconEntry.color ? foundIconEntry.color : "#444";
                if (!IconComponent)
                    return null;
                return (_jsx(IconComponent, { style: { color }, width: 16 / totalStringSize, height: 16 }, index.toString() + idx.toString()));
            }), "]"] }));
}
