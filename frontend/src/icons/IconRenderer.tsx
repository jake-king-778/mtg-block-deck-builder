import { iconMap } from './icons';


type Props = {
    name: string;
    index: number;
}

export default function IconRenderer({ name, index}: Props) {
  const foundIconEntry = iconMap[name.toLowerCase()]? iconMap[name.toLowerCase()] : iconMap[0]
  const IconComponent: any = foundIconEntry.icon;
  const color = foundIconEntry.color? foundIconEntry.color : "#444";

  if (!IconComponent) return null;

  return (
    <IconComponent
      key={index}
      style={{ color }}
      width={15}
      height={15}
    />
  );
}