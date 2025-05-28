import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import SetSelectionModal from "./components/SetSelectionModal";
import getUrl from "./utils/url";
import MtgCardView from "./components/MtgCardView";
function App() {
  const [chosenBlock, setChosenBlock] = useState();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);
  const [cardSelection, setCardSelection] = useState([]);
  useEffect(() => {
    const storedChosenSet = localStorage.getItem("chosenSet");
    if (storedChosenSet !== null) {
      setChosenBlock(JSON.parse(storedChosenSet));
    } else {
      setShowModal(true);
    }
  }, []);
  useEffect(() => {
    if (chosenBlock) {
      fetch(
        `${getUrl()}/cards/?set_codes=${chosenBlock.sets.map((s) => s.code).join("&set_codes=")}`,
      ).then((response) => {
        response.json().then((data) => setCardSelection(data));
      });
    }
  }, [chosenBlock]);
  const handleCardSelect = (card) => {
    if (!selectedCards.find((c) => c.id === card.id)) {
      setSelectedCards(selectedCards.concat(card));
    }
  };
  const changeBlock = (chosenBlock) => {
    setChosenBlock(chosenBlock);
    setShowModal(false);
  };
  return _jsxs(_Fragment, {
    children: [
      showModal && _jsx(SetSelectionModal, { onSetSelect: changeBlock }),
      _jsxs("div", {
        style: { height: "100vh", overflow: "hidden" },
        children: [
          _jsx("div", {
            style: {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              backgroundColor: "#fff",
              zIndex: 1000,
              borderBottom: "1px solid #ccc",
              padding: "10px 20px",
            },
            children: _jsx(Form.Control, {
              type: "text",
              placeholder: "Search cards...",
              value: search,
              onChange: (e) => setSearch(e.target.value),
            }),
          }),
          _jsxs("div", {
            style: {
              display: "flex",
              height: "calc(100vh - 60px)",
              marginTop: "60px",
              overflow: "hidden",
            },
            children: [
              _jsxs("div", {
                style: {
                  width: "220px",
                  backgroundColor: "#f8f9fa",
                  borderRight: "1px solid #ddd",
                  padding: "1rem",
                  position: "sticky",
                  top: "60px",
                  height: "calc(100vh - 60px)",
                  overflowY: "auto",
                  flexShrink: 0,
                },
                children: [
                  _jsx("h5", { children: "Type Filter" }),
                  _jsx(Form.Check, { label: "Option 1" }),
                  _jsx(Form.Check, { label: "Option 2" }),
                  _jsx(Form.Check, { label: "Option 3" }),
                  _jsx("br", {}),
                  _jsx(Button, {
                    onClick: () => setShowModal(true),
                    children: "Change Set",
                  }),
                ],
              }),
              _jsx("div", {
                style: {
                  flex: 1,
                  minWidth: 0,
                  overflowY: "auto",
                  padding: "1rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  alignContent: "flex-start",
                },
                children: cardSelection
                  .filter((card) =>
                    card.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((card, index) =>
                    _jsx(
                      MtgCardView,
                      {
                        card: card,
                        onAddToDeck: (card) => handleCardSelect(card),
                      },
                      index,
                    ),
                  ),
              }),
              _jsxs("div", {
                style: {
                  width: "220px",
                  backgroundColor: "#f8f9fa",
                  borderLeft: "1px solid #ddd",
                  padding: "1rem",
                  position: "sticky",
                  top: "60px",
                  height: "calc(100vh - 60px)",
                  overflowY: "auto",
                  flexShrink: 0,
                },
                children: [
                  _jsx("h5", { children: "Selected Cards" }),
                  _jsx(ListGroup, {
                    children: selectedCards.map((card) =>
                      _jsx(ListGroup.Item, { children: card.name }, card.id),
                    ),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
export default App;
