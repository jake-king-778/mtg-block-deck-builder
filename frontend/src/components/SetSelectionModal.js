import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import getUrl from "../utils/url";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
export default function SetSelectionModal({ onSetSelect }) {
    const [availableSets, setAvailableSets] = useState();
    useEffect(() => {
        fetch(`${getUrl()}/sets/standardBlocks`).then((response) => {
            response.json().then((data) => setAvailableSets(data));
        });
    }, []);
    const handleClose = (chosenSet) => {
        localStorage.setItem("chosenSet", JSON.stringify(chosenSet));
        onSetSelect(chosenSet);
    };
    return (_jsxs(Modal, { show: true, fullscreen: true, children: [_jsx(Modal.Header, { children: _jsx(Modal.Title, { children: "Block Set Selection" }) }), _jsx(Modal.Body, { children: _jsx(Carousel, { interval: null, children: availableSets &&
                        availableSets.map((availableSet) => {
                            return (_jsxs(Carousel.Item, { children: [_jsxs("h3", { children: ["Set Last Standard date:", " ", availableSet.lastStandardDate.toString().slice(0, 10)] }), _jsx("ul", { children: availableSet.sets.map((set) => (_jsxs("li", { children: [set.name, " (", set.code, ") -", " ", set.releaseDate.toString().slice(0, 10)] }, availableSet.lastStandardDate.toString() + set.code))) }), _jsx(Button, { variant: "primary", onClick: () => handleClose(availableSet), children: "Select Block" })] }, availableSet.lastStandardDate.toString()));
                        }) }) })] }));
}
