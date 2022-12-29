import Menu from './Menu';
import PageBooks from './pages/PageBooks';
import PageChat from './pages/PageChat';
import PageLogin from './pages/PageLogin';
import PageProfile from './pages/PageProfile';
import PageSell from './pages/PageSell';
import './css/Style.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
    <Menu />
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<PageBooks />} />
        <Route path="/chat" element={<PageChat />} />
        <Route path="/profile" element={<PageProfile />} />
        <Route path="/sell" element={<PageSell />} />
        <Route path="/login" element={<PageLogin />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
