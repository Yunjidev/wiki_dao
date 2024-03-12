/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { IoLogoGameControllerA } from "react-icons/io";
import './Sidebar.scss';
import { useState, useEffect } from 'react';
import { fetchHomeCardData, fetchChaptersForGame } from '../../../services/api_strapi';

const { SubMenu } = Menu;

const Sidebar = () => {
  const [games, setGames] = useState<any[]>([]);
  const [isChaptersFetched, setIsChaptersFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesData = await fetchHomeCardData();
        setGames(gamesData);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        if (!isChaptersFetched && games.length > 0) {
          const updatedGames = await Promise.all(
            games.map(async (game) => {
              const chapters = await fetchChaptersForGame(game.id);
              const updatedGame = { ...game, chapters: chapters ?? [] };
              return updatedGame;
            })
          );
          setGames(updatedGames);
          setIsChaptersFetched(true);
        }
      } catch (error) {
        console.error("Error fetching chapters data:", error);
      }
    };
  
    fetchChapters();
  }, [games, isChaptersFetched]);

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-content">
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="welcome" disabled className="menu-title">
            Accueil Wiki ChronoDAO.
          </Menu.Item>
          <Menu.Item key="accueil" icon={<FaHome />}>
            <Link to={'./'}>Wiki ChronoDAO.</Link>
          </Menu.Item>
          <Menu.Item key="jeux" disabled className="menu-title">
            Jeux
          </Menu.Item>
          {games.map((game) => (
            <SubMenu key={game.id} icon={<IoLogoGameControllerA />} title={game.attributes.title}>
              {game.chapters && game.chapters.attributes.chapter.data.length > 0 ? (
                game.chapters.attributes.chapter.data.map((chapter: any) => (
                  <Menu.Item key={chapter.id}>
                    <Tooltip title={chapter.attributes.title} placement="right">
                      <Link to={`/wiki/${chapter.attributes.page}`}>
                        {chapter.attributes.title}
                      </Link>
                    </Tooltip>
                  </Menu.Item>
                ))
              ) : (
                <Menu.Item>
                  Pas de chapitres disponibles pour ce jeu pour le moment.
                </Menu.Item>
              )}
            </SubMenu>
          ))}
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;
