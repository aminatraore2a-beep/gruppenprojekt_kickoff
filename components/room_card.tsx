type RoomCardProps = {
  name: string;
  capacity: number;
};

export function RoomCard({ name, capacity }: RoomCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Kapazität: {capacity}</p>
    </div>
  );
}