import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import GamesMenu from "../../components/GamesMenu/GamesMenu";
import GameSection from "../../components/GameSection/GameSection";
import GameCard from "../../components/Cards/GameCard";
import GameFilters from "../../components/GameFilters/GameFilters";
import { fetchGames, fetchGamesByIds } from "../../service/igdbService";
import { useUser } from "../../context/UserContext";

const pageSize = 48;

const Games = () => {
  useUser();
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
    platform: "",
  });

  const [selectedMenu, setSelectedMenu] = useState("popular");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredByRatingIds, setFilteredByRatingIds] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  // Atualiza searchTerm do input se vier pela URL
  useEffect(() => {
    if (location.pathname.startsWith("/games/search/")) {
      const term =
        params.searchTerm ||
        decodeURIComponent(location.pathname.replace("/games/search/", ""));
      setSearchTerm(term);
    } else {
      setSearchTerm("");
    }
  }, [location.pathname, params.searchTerm]);

  // Busca jogos do backend
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    // Se está filtrando por média de avaliação
    if (filteredByRatingIds && Array.isArray(filteredByRatingIds)) {
      fetchGamesByIds(filteredByRatingIds)
        .then((data) => {
          if (!cancelled) {
            setGames(data);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err.message);
            setGames([]);
            setLoading(false);
          }
        });
      return () => {
        cancelled = true;
      };
    }

    // Se está na rota de busca, só faz search
    if (location.pathname.startsWith("/games/search/")) {
      const term =
        params.searchTerm ||
        decodeURIComponent(location.pathname.replace("/games/search/", ""));
      fetchGames({
        search: term,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      })
        .then((data) => {
          if (!cancelled) {
            setGames(data);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err.message);
            setGames([]);
            setLoading(false);
          }
        });
      return () => {
        cancelled = true;
      };
    }

    // Caso padrão: populares, melhores, novos lançamentos
    const backendFilters = {
      genre: filters.genre,
      year: filters.year,
      platform: filters.platform,
      rating: filters.rating,
      recent: selectedMenu === "new",
      popular: selectedMenu === "popular",
      best: selectedMenu === "best",
      limit: pageSize,
      offset: (page - 1) * pageSize,
    };
    fetchGames(backendFilters)
      .then((data) => {
        if (!cancelled) {
          setGames(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setGames([]);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [
    filters,
    selectedMenu,
    page,
    location.pathname,
    params.searchTerm,
    filteredByRatingIds,
  ]);

  // Sincroniza o menu selecionado na página de games com o valor passado via state pela navbar, garantindo que o botão correto fique ativo.
  useEffect(() => {
    // Se vier do menu da navbar, sincroniza o menu selecionado
    if (location.state && location.state.menu) {
      setSelectedMenu(location.state.menu);
    }
    // Limpa o state para evitar reuso indevido
    window.history.replaceState({}, document.title);
  }, [location.state]);

  // Troca de menu reseta a página
  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
    setPage(1);
    // Se estava em search, volta para /games
    if (location.pathname.startsWith("/games/search/")) {
      navigate("/games");
    }
  };
  // Troca de filtros reseta a página
  const handleFiltersChange = (f) => {
    setFilters(f);
    setPage(1);
  };
  // Paginação
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => p + 1);

  // Título da seção
  let sectionTitle = "";
  if (location.pathname.startsWith("/games/search/")) {
    sectionTitle = `Resultados para "${searchTerm}"`;
  } else if (selectedMenu === "new") {
    sectionTitle = "Novos Lançamentos";
  } else if (selectedMenu === "best") {
    sectionTitle = "Melhores Jogos";
  } else if (selectedMenu === "popular") {
    sectionTitle = "Populares";
  }

  return (
    <div className="min-h-screen bg-zinc-900 py-10 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
        Explore os <span className="text-cyan-500">jogos</span>
      </h1>
      <GamesMenu selected={selectedMenu} onSelect={handleMenuSelect} />
      {!location.pathname.startsWith("/games/search/") && (
        <div className="mb-4">
          <GameFilters
            filters={filters}
            setFilters={handleFiltersChange}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onFilterByRating={setFilteredByRatingIds}
          />
        </div>
      )}
      {loading && (
        <div className="text-white text-center mt-10">Carregando jogos...</div>
      )}
      {error && <div className="text-red-500 text-center mt-10">{error}</div>}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 w-full mt-6">
            {games.map((game) => (
              <div key={game.id} className="flex justify-center">
                <div className="w-full">
                  <GameCard
                    game={game}
                    onClick={() => navigate(`/games/${game.id}`)}
                    showOverlay={true}
                    showButton={true}
                    buttonText="Ver reviews"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button
              className="px-4 py-2 cursor-pointer rounded bg-cyan-700 text-white font-bold disabled:opacity-50"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span className="text-white mt-2 font-semibold">Página {page}</span>
            <button
              className="px-4 py-2 cursor-pointer rounded bg-cyan-700 text-white font-bold disabled:opacity-50"
              onClick={handleNextPage}
              disabled={games.length < pageSize}
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Games;
