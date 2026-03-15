import { useState } from "react";
import FilterBar from "../../components/Filter-bar";
import Card from "../../components/Card";
import Container from "@/components/container";
import Section from "@/components/section";

export type CardType = "emergency" | "news" | "awareness";

export type CardData = {
  id: number;
  title: string;
  content: string;
  type: CardType;
  image: string;
  isActive: boolean;
  
};

export default function Home() {
  const [category, setCategory] = useState<CardType | "all">("all");

  const cards: CardData[] = [
    {
      id: 1,
      title: "Urgent need for blood type (B+)",
      content:
        "We urgently need B+ blood donors. A patient in critical condition requires immediate transfusion.",
      type: "emergency",
      image: "/assets/emergency.svg",
      isActive: false,
    },
    {
      id: 2,
      title: "Blood Donation Camp - This Weekend",
      content:
        "Join us for a special blood donation camp this Saturday and Sunday at City Community Center from 9 AM to 5 PM. Refreshments will be provided.",
      type: "news",
      image: "/assets/emergency.svg",
      isActive: false,
    },
    {
      id: 3,
      title: "New Mobile App Coming Soon",
      content:
        "We are excited to announce that our mobile application will be launching next month.",
      type: "awareness",
      image: "/assets/emergency.svg",
      isActive: false,
    },
  ];

  const filteredCards =
    category === "all" ? cards : cards.filter((card) => card.type === category);

  return (
  <Container>
    <Section>
          <div className="max-w-7xl mx-auto space-y-6">
      <FilterBar category={category} setCategory={setCategory} />

      <div className="space-y-6">
        {filteredCards.map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </div>
    </div>
    </Section>
  </Container>
  );
}