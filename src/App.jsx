import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { Route, Routes } from "react-router-dom";
import Genre from "./pages/Genre.jsx";
import Home from "./pages/Home.jsx";
import Series from "./pages/Series.jsx";
import Movies from "./pages/Movies.jsx";
import Anime from "./pages/Anime.jsx";
import MediaDetail from "./pages/MediaDetail.jsx";
import AnimeDetail from "./pages/AnimeDetail.jsx";

export default function App() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-aurora/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-ember/25 blur-3xl" />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/series" element={<Series />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/anime" element={<Anime />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="/movie/:id" element={<MediaDetail type="movie" />} />
          <Route path="/series/:id" element={<MediaDetail type="series" />} />
          <Route path="/genre/:id" element={<Genre />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}
