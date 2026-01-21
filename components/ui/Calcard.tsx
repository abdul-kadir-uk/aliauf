import Image from "next/image";
import Link from "next/link";
import { calcard } from "@/src/types/calcard";

interface cardprops {
  card: calcard;
}

const Calcard = ({ card }: cardprops) => {
  return (
    <Link href={card.href} className="group">
      <div className="flex flex-col items-center p-4 rounded-xl border shadow-sm hover:shadow-md transition-all hover:scale-105 h-60">
        {/* Image container with fixed size */}
        <div className="relative w-full h-40">
          <Image
            src={card.img}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="eager"
            className="object-contain rounded-md"
          />
        </div>

        {/* Title */}
        <h2 className="text-center mt-4 font-medium">{card.title}</h2>
      </div>
    </Link>
  );
};

export default Calcard;
