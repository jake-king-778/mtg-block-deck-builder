import { useEffect, useState } from "react";
import getUrl from "../utils/url";
import type StandardBlocks from "../types/StandardBlock";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import type MtgSet from "../types/StandardBlock";

type Props = {
  onSetSelect: (selectedSet: MtgSet) => void;
};

export default function SetSelectionModal({ onSetSelect }: Props) {
  const [availableSets, setAvailableSets] = useState<Array<StandardBlocks>>();
  useEffect(() => {
    fetch(`${getUrl()}/sets/standardBlocks`).then((response) => {
      response.json().then((data) => setAvailableSets(data));
    });
  }, []);
  const handleClose = (chosenSet: MtgSet) => {
    localStorage.setItem("chosenSet", JSON.stringify(chosenSet));
    onSetSelect(chosenSet);
  };

  return (
    <Modal show={true} fullscreen>
      <Modal.Header>
        <Modal.Title>Block Set Selection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel interval={null}>
          {availableSets &&
            availableSets.map((availableSet) => {
              return (
                <Carousel.Item key={availableSet.lastStandardDate.toString()}>
                  <h3>
                    Set Last Standard date:{" "}
                    {availableSet.lastStandardDate.toString().slice(0, 10)}
                  </h3>
                  <ul>
                    {availableSet.sets.map((set) => (
                      <li
                        key={
                          availableSet.lastStandardDate.toString() + set.code
                        }
                      >
                        {set.name} ({set.code}) -{" "}
                        {set.releaseDate.toString().slice(0, 10)}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="primary"
                    onClick={() => handleClose(availableSet)}
                  >
                    Select Block
                  </Button>
                </Carousel.Item>
              );
            })}
        </Carousel>
      </Modal.Body>
    </Modal>
  );
}
