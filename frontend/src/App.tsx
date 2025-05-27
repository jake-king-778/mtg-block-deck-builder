import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import type StandardBlocks from "./types/StandardBlock";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import SetSelectionModal from "./components/SetSelectionModal";
import getUrl from "./utils/url";

interface MtgCard {
  id: number;
  name: string;
  manaCost: string;
  power: string;
  toughness: string;
  strength: string;
  text: string;
}

function App() {
  const [chosenBlock, setChosenBlock] = useState<StandardBlocks>();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [selectedCards, setSelectedCards] = useState<Array<MtgCard>>([]);
  const [cardSelection, setCardSelection] = useState<Array<MtgCard>>([]);
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

  const handleCardSelect = (card: MtgCard) => {
    if (!selectedCards.find((c: MtgCard) => c.id === card.id)) {
      setSelectedCards(selectedCards.concat(card));
    }
  };
  const changeBlock = (chosenBlock: StandardBlocks) => {
    setChosenBlock(chosenBlock);
    setShowModal(false);
  };

  return (
    <>
      {showModal && <SetSelectionModal onSetSelect={changeBlock} />}
      <div style={{ height: "100vh", overflow: "hidden" }}>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#fff",
            zIndex: 1000,
            borderBottom: "1px solid #ccc",
            padding: "10px 20px",
          }}
        >
          <Form.Control
            type="text"
            placeholder="Search cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            height: "calc(100vh - 60px)",
            marginTop: "60px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "220px",
              backgroundColor: "#f8f9fa",
              borderRight: "1px solid #ddd",
              padding: "1rem",
              position: "sticky",
              top: "60px",
              height: "calc(100vh - 60px)",
              overflowY: "auto",
              flexShrink: 0,
            }}
          >
            <h5>Filters</h5>
            <Form.Check label="Option 1" />
            <Form.Check label="Option 2" />
            <Form.Check label="Option 3" />
            <br />
            <Button onClick={() => setShowModal(true)}>Change Set</Button>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 0,
              overflowY: "auto",
              padding: "1rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              alignContent: "flex-start",
            }}
          >
            {cardSelection
              .filter((card) =>
                card.name.toLowerCase().includes(search.toLowerCase()),
              )
              .map((card) => (
                <Card key={card.id} style={{ width: "18rem" }}>
                  <Card.Body>
                    <Card.Title>{card.name}</Card.Title>
                    <Card.Text>{card.text}</Card.Text>
                    <Button onClick={() => handleCardSelect(card)}>
                      Select
                    </Button>
                  </Card.Body>
                </Card>
              ))}
          </div>

          {/* Right sticky sidebar */}
          <div
            style={{
              width: "220px",
              backgroundColor: "#f8f9fa",
              borderLeft: "1px solid #ddd",
              padding: "1rem",
              position: "sticky",
              top: "60px",
              height: "calc(100vh - 60px)",
              overflowY: "auto",
              flexShrink: 0,
            }}
          >
            <h5>Selected Cards</h5>
            <ListGroup>
              {selectedCards.map((card) => (
                <ListGroup.Item key={card.id}>{card.name}</ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
