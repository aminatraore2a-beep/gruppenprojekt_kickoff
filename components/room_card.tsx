type RoomCardProps = {
  name: string;
  capacity: number;
  description: string | null;
};

export function RoomCard({ name, capacity, description }: RoomCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Kapazität: {capacity}</p>
      <p>Beschreibung: {description}</p>
    </div>
  );
}