import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Card } from "react-bootstrap";
import React from "react";
import IconRenderer from "../icons/IconRenderer";
const ManaTextRenderer = ({ text }) => {
    const parts = [];
    let index = 0;
    // This regex matches anything inside curly braces, like {1}, {B}, {T}
    const regex = /\{(.*?)\}/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
        const [fullMatch, symbol] = match;
        const matchStart = match.index;
        // Push text before this match
        if (matchStart > lastIndex) {
            parts.push(text.slice(lastIndex, matchStart));
        }
        // Push the IconRenderer component
        parts.push(_jsx(IconRenderer, { index: index, name: symbol.toLowerCase() }, index));
        index++;
        lastIndex = matchStart + fullMatch.length;
    }
    // Push any remaining text after the last match
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }
    return _jsx("span", { children: parts });
};
export default function MtgCardView({ card, onAddToDeck }) {
    return (_jsx(Card, { style: { width: "18rem", padding: "0" }, children: _jsxs(Card.Body, { children: [_jsxs(Card.Title, { children: [card.name, _jsx("br", {}), card.manaCost && (_jsx("span", { style: { float: "right" }, children: card.manaCost.split("}").map((m, index) => {
                                m = m.replace("{", "").replace("/", "");
                                if (m) {
                                    return (_jsx(IconRenderer, { index: index, name: m.toLowerCase() }, index));
                                }
                            }) })), _jsx("br", {})] }), card.text && (_jsxs(Card.Text, { children: [_jsx("strong", { children: card.type }), _jsx("br", {}), card.text.split("\\n").map((line, index) => (_jsxs(React.Fragment, { children: [_jsx(ManaTextRenderer, { text: line }), _jsx("br", {})] }, index)))] })), (card.power || card.toughness) && (_jsx("span", { style: { position: "absolute", bottom: "5px", right: "5px" }, children: _jsxs("strong", { children: [card.power, "/", card.toughness] }) })), _jsx("br", {}), _jsx("div", { style: { position: "absolute", top: 0, right: 0 }, children: _jsx(Button, { onClick: () => onAddToDeck(card), children: "+" }) })] }) }, card.id));
}
