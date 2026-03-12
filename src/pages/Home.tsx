import { useState } from "react";
import FilterBar from "../components/FilterBar";
import Card from "../components/Card";

function Home() {

  const [category, setCategory] = useState("all");

  const cards = [
    {
      id: 1,
      title: "Urgent need for blood type (B+)",
      description: "We urgently need B+ blood donors. A patient in critical condition requires immediate transfusion. Please contact us if you can donate.",
      emergencyButton: "Emergency",
      time: "7 hours ago",
      image: "/assets/emergency.png",
      category: "emergency",
    },
    {
      id: 2,
      title: "Blood Donation Camp - This Weekend",
      description: "Join us for a special blood donation camp this Saturday and Sunday at City Community Center.",
      time: "1 day ago",
      emergencyButton: "Emergency",
      image: "/assets/emergency.png",
      category: "news",
    },
    {
      id: 3,
      title: "New Mobile App Coming Soon",
      description: "We are excited to announce that our mobile application will be launching next month.",
      time: "3 days ago",
      emergencyButton: "Emergency",
      image: "/assets/emergency.png",
      category: "awareness",
    },
  ];

  const filteredCards =  category === "all"  ? cards : 
  cards.filter((card) => card.category === category);

  return (
    <div>
      <FilterBar
        category={category}
        setCategory={setCategory}
      />

      <div className="max-w-6xl mx-auto mt-8 space-y-6">

        {filteredCards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            description={card.description}
            emergencyButton={card.emergencyButton}
            category={card.category}
            time={card.time}
            image={card.image}
          />
        ))}

      </div>

    </div>
  );
}

export default Home;