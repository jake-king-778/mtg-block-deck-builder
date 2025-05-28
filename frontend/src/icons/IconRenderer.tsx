import { iconMap } from "./icons";

type Props = {
  name: string;
  index: number;
};

export default function IconRenderer({ name, index }: Props) {
  const totalStringSize = name.length;
  return (
    <span>
      [
      {[...name.toLowerCase()].map((char, idx) => {
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
