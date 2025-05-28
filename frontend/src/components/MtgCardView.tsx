import { Button, Card } from "react-bootstrap";
import type MtgCard from "../types/MtgCard";
import React from "react";
import IconRenderer from "../icons/IconRenderer";

type Props = {
  card: MtgCard;
  onAddToDeck: (addToDeck: MtgCard) => void;
};

const ManaTextRenderer = ({ text }: any) => {
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
    parts.push(
      <IconRenderer key={index} index={index} name={symbol.toLowerCase()} />
    );

    index++;
    lastIndex = matchStart + fullMatch.length;
  }

  // Push any remaining text after the last match
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <span>{parts}</span>;
};

export default function MtgCardView({ card, onAddToDeck }: Props) {
  return (
    <Card key={card.id} style={{ width: "18rem", padding: "0" }}>
      <Card.Body>
        <Card.Title>
          {card.name}
          <br />
          {card.manaCost &&
            <span style={{ float: "right" }}>
              {card.manaCost.split("}").map((m, index) => {
                m = m.replace("{", "")
                if (m) {
                  return (<IconRenderer key={index} index={index} name={m.toLowerCase()}/>)
                }
                })}
            </span>
          }
          <br />
        </Card.Title>{card.text &&
          <Card.Text>{card.text.split("\\n").map((line, index) => (<React.Fragment key={index}><ManaTextRenderer text={line} /><br/></React.Fragment>))}</Card.Text>
        }
        {(card.power || card.toughness) &&
          <span style={{ position: "absolute", bottom: "5px", right: "5px" }}><strong>{card.power}/{card.toughness}</strong></span>
        }
        <br />
        <div style={{ position: "absolute", top: 0, right: 0 }}><Button onClick={() => onAddToDeck(card)}>+</Button></div>
      </Card.Body>
    </Card>
  );
}
