import { useState, useEffect, SetStateAction } from 'react';
import { Input, Menu, Dropdown } from 'antd';
import { Link } from 'react-router-dom';
import { fetchHomeCardData, fetchChaptersForGame } from '../../../services/api_strapi';

const { Search } = Input;

// Définition du type pour les résultats de recherche
interface SearchResult {
  id: number;
  type: 'game' | 'chapter';
  title: string;
  page?: number;
  gameTitle?: string;
}

const SearchBar = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        if (searchQuery.trim() === '') {
          setSearchResults([]);
          return;
        }

        const games = await fetchHomeCardData();
        const chapters = await Promise.all(
          games.map((game: { id: number; }) => fetchChaptersForGame(game.id))
        );

        // Filter and map search results from games and chapters
        const filteredResults: SearchResult[] = games
          .filter((game: { attributes: { title: string; }; }) => game.attributes.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((game: { id: number; attributes: { title: string; }; }) => ({ id: game.id, type: 'game', title: game.attributes.title }));
        
        chapters.forEach((chapterData, index) => {
          const chaptersForGame = chapterData.attributes.chapter.data;
          const gameTitle = games[index].attributes.title;
          chaptersForGame.forEach((chapter: { attributes: { title: string; page: number; }; id: number; }) => {
            if (chapter.attributes.title.toLowerCase().includes(searchQuery.toLowerCase())) {
              filteredResults.push({
                id: chapter.id,
                type: 'chapter',
                title: chapter.attributes.title,
                page: chapter.attributes.page,
                gameTitle: gameTitle
              });
            }
          });
        });

        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleSearch = (value: SetStateAction<string>) => {
    setSearchQuery(value);
  };

  const renderSearchResults = () => {
    return (
      <Menu>
        {searchResults.map((result) => (
          <Menu.Item key={result.id}>
            {result.type === 'game' ? (
              <Link to={`/games/${result.id}/chapters`}>
                Jeu ({result.title})
              </Link>
            ) : result.type === 'chapter' ? (
              <Link to={`/wiki/${result.page}`}>
                {result.title} - {result.gameTitle}
              </Link>
            ) : (
              <span>Autre type de résultat</span>
            )}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <Dropdown overlay={renderSearchResults()} placement="bottomLeft">
      <Search
        placeholder="Rechercher..."
        allowClear
        enterButton
        onSearch={handleSearch}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: 300 }}
      />
    </Dropdown>
  );
};

export default SearchBar;
