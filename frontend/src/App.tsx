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
import { Modal, Spinner } from "react-bootstrap";

type CardFilter = {
  cardTypes: Set<string>;
  cardColors: Set<string>;
};

type CardCounter = {
  card: MtgCard;
  count: number;
};

function App() {
  // TODO:// boy did I let this file get big
  const [chosenBlock, setChosenBlock] = useState<StandardBlocks>();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [selectedCards, setSelectedCards] = useState<Map<number, CardCounter>>(
    new Map<number, CardCounter>(),
  );
  const [cardSelection, setCardSelection] = useState<MtgCard[]>([]);
  const [filteredCardSelection, setFilteredCardSelection] = useState<MtgCard[]>(
    [],
  );
  const [showClipboadCopyModal, setShowClipboadCopyModal] = useState(false);
  const [clipboardCopyModalText, setClipboardCopyModalText] = useState("");

  //init
  useEffect(() => {
    const storedChosenSet = localStorage.getItem("chosenSet");
    if (storedChosenSet !== null) {
      setChosenBlock(JSON.parse(storedChosenSet));
    } else {
      setShowModal(true);
    }
    const currentSelectedCards = localStorage.getItem("currentSelectedCards");
    if (currentSelectedCards !== null) {
      const selectedCards: Map<number, CardCounter> = new Map(
        JSON.parse(currentSelectedCards),
      );
      setSelectedCards(selectedCards);
      setClipboardCopyModalText(tcgPlayerBulkText(selectedCards));
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
    const newSelectedCards = new Map(selectedCards);

    if (newSelectedCards.has(card.id)) {
      const existing = newSelectedCards.get(card.id)!;
      newSelectedCards.set(card.id, { ...existing, count: existing.count + 1 });
    } else {
      newSelectedCards.set(card.id, { card, count: 1 });
    }
    setSelectedCards(newSelectedCards);
    setClipboardCopyModalText(tcgPlayerBulkText(newSelectedCards));
    console.log(clipboardCopyModalText);
    localStorage.setItem(
      "currentSelectedCards",
      JSON.stringify(Array.from(selectedCards.entries())),
    );
  };
  const removeCard = (id: number) => {
    const newSelectedCards = new Map(selectedCards);

    if (newSelectedCards.has(id) && newSelectedCards.get(id).count > 1) {
      const existing = newSelectedCards.get(id)!;
      newSelectedCards.set(id, { ...existing, count: existing.count - 1 });
    } else {
      newSelectedCards.delete(id);
    }
    setSelectedCards(newSelectedCards);
    setClipboardCopyModalText(tcgPlayerBulkText(newSelectedCards));
    console.log(clipboardCopyModalText);
    localStorage.setItem(
      "currentSelectedCards",
      JSON.stringify(Array.from(selectedCards.entries())),
    );
  };

  const changeBlock = (chosenBlock: StandardBlocks) => {
    setChosenBlock(chosenBlock);
    setShowModal(false);
  };

  const tcgPlayerBulkText = (updatedSelectedCards) => {
    return Array.from(updatedSelectedCards.values())
      .map(
        (cardCount: CardCounter) =>
          `${cardCount.count} ${cardCount.card.name} [${cardCount.card.minPriceSetCode}] ${cardCount.card.minPriceNumber}`,
      )
      .join("\n");
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
                width: "280px",
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
              <h5>
                Selected Cards{" "}
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => setShowClipboadCopyModal(true)}
                >
                  Copy
                </Button>
              </h5>
              <ListGroup>
                {selectedCards &&
                  Array.from(selectedCards.values()).map(
                    (cardCount: CardCounter) => (
                      <ListGroup.Item
                        key={cardCount.card.id}
                        style={{ fontSize: "10pt" }}
                      >
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => removeCard(cardCount.card.id)}
                        >
                          -
                        </Button>
                        &nbsp;{cardCount.count} {cardCount.card.name}
                      </ListGroup.Item>
                    ),
                  )}
              </ListGroup>
            </div>
          </div>
        )}
      </div>
      <Modal
        show={showClipboadCopyModal}
        onHide={() => setShowClipboadCopyModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Dumb Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Apprarently I cant use the clipboard without https so copy this
            instead *sigh*
          </p>
          <pre>{clipboardCopyModalText}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowClipboadCopyModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
