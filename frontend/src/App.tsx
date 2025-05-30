import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import type StandardBlocks from "./types/StandardBlock";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import SetSelectionModal from "./components/SetSelectionModal";
import getUrl from "./utils/url";
import type MtgCard from "./types/MtgCard";
import MtgCardView from "./components/MtgCardView";
import { Spinner } from "react-bootstrap";

type CardFilter = {
  cardTypes: Set<string>;
  cardColors: Set<string>;
};

function App() {
  // TODO:// boy did I let this file get big
  const [chosenBlock, setChosenBlock] = useState<StandardBlocks>();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [selectedCards, setSelectedCards] = useState<MtgCard[]>([]);
  const [cardSelection, setCardSelection] = useState<MtgCard[]>([]);
  const [filteredCardSelection, setFilteredCardSelection] = useState<MtgCard[]>(
    [],
  );

  //init
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
      setIsLoading(true);
      fetch(
        `${getUrl()}/cards/?set_codes=${chosenBlock.sets.map((s) => s.code).join("&set_codes=")}`,
      ).then((response) => {
        response.json().then((data: MtgCard[]) => {
          setCardSelection(data);
          setFilteredCardSelection(data);
          setIsLoading(false);
        });
      });
    }
  }, [chosenBlock]);

  //filters
  const [cardFilters, setCardFilters] = useState<CardFilter>({
    cardTypes: new Set([
      "creature",
      "sorcery",
      "land",
      "instant",
      "planeswalker",
      "artifact",
      "enchantment",
    ]),
    cardColors: new Set(["G", "W", "B", "R", "U", "EMPTY"]),
  });
  const updateTypeFilter = (target: any) => {
    if (target.checked) {
      cardFilters.cardTypes.add(target.value.toLowerCase());
      setCardFilters(cardFilters);
    } else {
      cardFilters.cardTypes.delete(target.value.toLowerCase());
      setCardFilters(cardFilters);
    }
    handleFilterChange();
  };

  const updateColorFilter = (target: any) => {
    if (target.checked) {
      cardFilters.cardColors.add(target.value);
      setCardFilters(cardFilters);
    } else {
      cardFilters.cardColors.delete(target.value);
      setCardFilters(cardFilters);
    }
    handleFilterChange();
  };

  const handleFilterChange = () => {
    setFilteredCardSelection(
      cardSelection
        .filter((card) => {
          console.log(card.colorIdentity);
          if (card.colorIdentity.length === 0) {
            return cardFilters.cardColors.has("EMPTY");
          }
          for (const color of card.colorIdentity) {
            if (cardFilters.cardColors.has(color)) {
              return true;
            }
          }
          return false;
        })
        .filter((card) => {
          // some of them dont say and we should assume creature
          const cardType = card.type ? card.type : "creature";
          for (const cardType of cardFilters.cardTypes) {
            if (card.type.toLowerCase().includes(cardType.toLowerCase())) {
              return true;
            }
          }
          return false;
        }),
    );
  };

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

        {isLoading && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Spinner animation="border" />
          </div>
        )}
        {!isLoading && (
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
              <h5>Type Filter</h5>
              <Form.Check
                label="Creature"
                value="Creature"
                defaultChecked
                onChange={({ target }) => updateTypeFilter(target)}
              />
              <Form.Check
                label="Sorcery"
                value="Sorcery"
                defaultChecked
                onChange={({ target }) => updateTypeFilter(target)}
              />
              <Form.Check
                label="Land"
                value="Land"
                defaultChecked
                onChange={({ target }) => updateTypeFilter(target)}
              />
              <Form.Check
                label="Instant"
                value="Instant"
                defaultChecked
                onChange={({ target }) => updateTypeFilter(target)}
              />
              <Form.Check
                label="Planeswalker"
                value="Planeswalker"
                defaultChecked
                onChange={({ target }) => updateTypeFilter(target)}
              />
              <Form.Check
                label="Artifact"
                value="Artifact"
                defaultChecked
                onChange={({ target }) => updateTypeFilter(target)}
              />
              <Form.Check
                label="Enchantment"
                value="Enchantment"
                defaultChecked
                onChange={({ target }) => updateTypeFilter(target)}
              />
              <br />
              <h5>Color Filter</h5>
              <Form.Check
                label="Blue"
                value="U"
                defaultChecked
                onChange={({ target }) => updateColorFilter(target)}
              />
              <Form.Check
                label="Green"
                value="G"
                defaultChecked
                onChange={({ target }) => updateColorFilter(target)}
              />
              <Form.Check
                label="Red"
                value="R"
                defaultChecked
                onChange={({ target }) => updateColorFilter(target)}
              />
              <Form.Check
                label="White"
                value="W"
                defaultChecked
                onChange={({ target }) => updateColorFilter(target)}
              />
              <Form.Check
                label="Black"
                value="B"
                defaultChecked
                onChange={({ target }) => updateColorFilter(target)}
              />
              <Form.Check
                label="None"
                value="EMPTY"
                defaultChecked
                onChange={({ target }) => updateColorFilter(target)}
              />
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
              {filteredCardSelection
                .filter((card) =>
                  card.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map((card, index) => (
                  <MtgCardView
                    key={index}
                    card={card}
                    onAddToDeck={(card) => handleCardSelect(card)}
                  />
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
        )}
      </div>
    </>
  );
}

export default App;
