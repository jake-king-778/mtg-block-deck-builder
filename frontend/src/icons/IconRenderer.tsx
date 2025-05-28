import { iconMap } from "./icons";

type Props = {
  name: string;
  index: number;
};

export default function IconRenderer({ name, index }: Props) {
  // if the first letter is one is is a number and wont be mixed
  const charsToIterate: string[] =
    name.charAt(0) == "1" ? [name] : [...name.toLowerCase()];
  const totalStringSize = charsToIterate.length;
  return (
    <span>
      [
      {charsToIterate.map((char, idx) => {
        const foundIconEntry = iconMap[char] ? iconMap[char] : iconMap[0];
        const IconComponent: any = foundIconEntry.icon;
        const color = foundIconEntry.color ? foundIconEntry.color : "#444";

        if (!IconComponent) return null;
        return (
          <IconComponent
            key={index.toString() + idx.toString()}
            style={{ color }}
            width={16 / totalStringSize}
            height={16}
          />
        );
      })}
      ]
    </span>
  );
}
