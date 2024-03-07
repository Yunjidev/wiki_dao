import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import './RenderMarkdown.scss';

const corsProxyUrl = import.meta.env.VITE_CORS_PROXY;
const apiUrl = import.meta.env.VITE_CHARMVERSE_API_URL;

const RenderMarkdown: React.FC = () => {
  const { page } = useParams<{ page: string }>();
  const [markdown, setMarkdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(corsProxyUrl + apiUrl + page, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
          },
        });

        if (!response.data || !response.data.content || !response.data.content.markdown) {
          console.error('Missing or invalid markdown in response:', response.data);
          return;
        }

        const pageContent = response.data.content.markdown;
        setMarkdown(pageContent);
      } catch (err) {
        console.error('Erreur lors de la récupération du markdown:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkdown();
  }, [page]);

  return (
    <div>
      {isLoading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {markdown && <ReactMarkdown className="markdown-content" children={markdown} />}
    </div>
  );
};

export default RenderMarkdown;
