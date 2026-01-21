import { ConvertCard } from "@/src/data/convertCard";
import Calcard from "@/components/ui/Calcard";

export default function Converters() {
  return (
    <>
      <div className="px-4 my-5 lg:min-h-screen">
        <h1 className="text-center text-3xl font-semibold mb-8">Converters</h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {ConvertCard.map((card) => (
            <Calcard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </>
  );
}
