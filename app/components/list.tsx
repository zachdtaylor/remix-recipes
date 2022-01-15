type ListCardProps = {
  title: string;
};
export function ListCard({ title }: ListCardProps) {
  return <div className="p-4 shadow-md">{title}</div>;
}
