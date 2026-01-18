"use client";
import { cards } from "@/src/data/card";
import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <main className="parent">
      {/* Hero section - Replace hardcoded border-theme with border-foreground */}
      <section className="text-center border-2 border-theme sm:min-h-96 min-h-64 flex justify-center items-center border-t-transparent">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-8xl text-purple-600">
            Aliauf
          </h1>
          <p className="italic text-xl sm:2xl md:text-5xl text-green-500">
            All Types Of Services
          </p>
          <p>Here Is the Solution Of Your All Problems</p>
        </div>
      </section>
      {/* services card section */}
      <div className="mt-4">
        <h1 className="text-start pl-7 text-3xl font-semibold mb-2 sm:mb-4 md:mb-6">
          Our Services
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-2 sm:m-4">
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </div>
    </main>
  );
}
