/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchHomeCardData } from "../../services/api_strapi";
import "./Home.scss";


interface HomeCard {
  attributes: any;
  id: number;
  slug: string;
  logo: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
}

export default function Home() {
  const [homeCards, setHomeCards] = useState<HomeCard[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeCardData = await fetchHomeCardData();
        setHomeCards(homeCardData.map((card: any) => card));
      } catch (error) {
        console.error("Error fetching home card data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main id="main__home">
      <section id="cards-container" className="cards-grid">
      {homeCards.map((card) => (
  <Link key={card.id} to={`/games/${card.id}/chapters`}>
    <div className="card">
      <div className="image__wrapper">
        {card.attributes.logo &&
          card.attributes.logo.data &&
          card.attributes.logo.data.attributes &&
          card.attributes.logo.data.attributes.url && (
            <img
                src={`${import.meta.env.VITE_API_URL}${card.attributes.logo.data.attributes.url}`}
                alt={`Image for ${card.attributes.slug || "Card Title"}`}
              />
          )}
      </div>
      <div className="card-content"></div>
    </div>
  </Link>
))}
      </section>
    </main>
  );
}