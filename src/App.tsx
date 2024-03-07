/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Nav from './components/common/nav/Nav';
import NavHamburger from './components/common/nav/NavHamburger/NavHamburger.tsx';
import Home from './pages/Home/Home';
import Footer from './components/common/footer/Footer.tsx';
import SocialMedia from './components/common/SocialMedia/SocialMedia.tsx';
import Twitch from './pages/Twitch/Twitch.tsx';
import RenderMarkdown from './pages/RenderMarkdown/RenderMarkdown.tsx';
import ScrollToTop from './components/ScrollToTop/ScrollToTop.tsx';
import Politique from './pages/Politique/Politique.tsx';
import Sidebar from './components/common/Sidebar/Sidebar.tsx';
import './App.scss';
import GamePage from './pages/GamePage/GamePage';

const { Content } = Layout;

const App: React.FC = () => {

  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.matchMedia('(min-width: 800px)').matches);
    };

    handleResize(); // Call it initially
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Layout className="app-layout">
      <SocialMedia />
      {!isWideScreen && <NavHamburger />}
      <Layout>
        {isWideScreen && <Nav />}
        <Layout>
          <Layout.Sider width={200}>
            <Sidebar />
          </Layout.Sider>
          <Layout className="content-layout">
            <Content style={{ padding: '0 24px', minHeight: 280 }}>
              <ScrollToTop />
              <div className="container">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/wiki/:page" element={<RenderMarkdown/>} />
                  <Route
                    path="/extention_twitch/politique_de_confidentialite"
                    element={<Politique />}
                  />
                  <Route path="/extention_twitch" element={<Twitch />} />
                  <Route path="/games/:gameId/chapters" element={<GamePage />} />
                </Routes>
                <Footer />
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
