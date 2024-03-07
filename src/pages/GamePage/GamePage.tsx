import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchChaptersForGame } from "../../services/api_strapi";
import "./GamePage.scss";

interface Chapter {
  id: number;
  attributes: {
    title: string;
    page: string;
    logo: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();

  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (!gameId) {
      return;
    }
    const fetchChapters = async () => {
      try {
        const gameIdInt = parseInt(gameId);
        if (isNaN(gameIdInt)) {
          console.error("Invalid gameId:", gameId);
          return;
        }

        const chaptersData = await fetchChaptersForGame(gameIdInt);

        if (chaptersData && chaptersData.attributes && chaptersData.attributes.chapter && chaptersData.attributes.chapter.data) {
          setChapters(chaptersData.attributes.chapter.data);
        } else {
          console.error("Chapters data is missing or invalid:", chaptersData);
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, [gameId]);

  return (
    <main id="main__game">
      <section id="cards-container" className="cards-grid">
        {chapters.map(chapter => (
          <Link key={chapter.id} to={`/wiki/${chapter.attributes.page}`}>
            <div className="card">
              <div className="image__wrapper">
                {chapter.attributes.logo &&
                  chapter.attributes.logo.data &&
                  chapter.attributes.logo.data.attributes &&
                  chapter.attributes.logo.data.attributes.url && (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${chapter.attributes.logo.data.attributes.url}`}
                      alt={`Image for ${chapter.attributes.title || "Chapter Title"}`}
                    />
                )}
              </div>
              <div className="card-content">
                <h2>{chapter.attributes.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default GamePage;
