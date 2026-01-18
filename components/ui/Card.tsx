import Link from "next/link";
import Image from "next/image";
import { card as cardtype } from "@/src/types/card";

interface CardProps {
  card: cardtype;
}

const Card = ({ card }: CardProps) => {
  return (
    <>
      <div>
        <Link href={card.href} target="_blank" className="block">
          <div
            className="relative min-h-60 border-theme border-2 cursor-pointer
                   shadow-md hover:shadow-2xl transition-all hover:scale-105
                   overflow-hidden rounded-lg"
          >
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover"
            ></Image>

            <div className="absolute inset-0 bg-black/50 ">
              <div className="relative z-10 flex flex-col h-full items-center justify-center">
                <h2 className="font-bold text-xl text-white ">{card.title}</h2>
                <p className="text-white font-semibold  px-2 ">{card.desc}</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Card;
