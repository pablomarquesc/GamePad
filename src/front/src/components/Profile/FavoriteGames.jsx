import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { fetchGamesByIds } from "../../service/igdbService";
import { useNavigate } from "react-router-dom";

// Permite receber o usuário como prop
export default function FavoriteGames({ user: userProp }) {
  const { user: userContext } = useUser();
  const user = userProp || userContext;
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // IDs dos jogos favoritos
  let favoriteIds = [];
  if (user && user.favoriteGames) {
    if (Array.isArray(user.favoriteGames)) {
      // Pode ser array de objetos {id, name} ou array de IDs
      if (
        typeof user.favoriteGames[0] === "object" &&
        user.favoriteGames[0] !== null
      ) {
        favoriteIds = user.favoriteGames.map((g) => g.id).filter(Boolean);
      } else {
        favoriteIds = user.favoriteGames.filter(Boolean);
      }
    } else if (typeof user.favoriteGames === "string") {
      try {
        const arr = JSON.parse(user.favoriteGames);
        if (Array.isArray(arr)) {
          if (typeof arr[0] === "object" && arr[0] !== null) {
            favoriteIds = arr.map((g) => g.id).filter(Boolean);
          } else {
            favoriteIds = arr.filter(Boolean);
          }
        }
      } catch {
        favoriteIds = [];
      }
    }
  }

  useEffect(() => {
    async function fetchFavoriteGames() {
      if (!favoriteIds.length) {
        setGames([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const results = await fetchGamesByIds(favoriteIds);
        setGames(results.filter(Boolean));
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Erro ao buscar jogos favoritos.");
      } finally {
        setLoading(false);
      }
    }
    fetchFavoriteGames();
    // eslint-disable-next-line
  }, [user && user.favoriteGames]);

  console.log("Jogos favoritos:", games);

  return (
    <div className="mb-8">
      <h3 className="text-xs font-semibold text-cyan-200 mb-1 tracking-widest uppercase">
        Jogos Favoritos
      </h3>
      <hr className="mb-4 border-zinc-700" />
      {loading ? (
        <div className="text-zinc-400">Carregando jogos favoritos...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : !games.length ? (
        <div className="text-zinc-500">Nenhum jogo favorito cadastrado.</div>
      ) : (
        <div className="grid grid-cols-5 xs:grid-cols-5 sm:grid-cols-5 md:grid-cols-5 gap-2 sm:gap-2 md:gap-2">
          {games.map((game, i) => (
            <div
              key={game.id || i}
              className="aspect-[3/4] w-full bg-zinc-800 rounded-xl overflow-hidden flex flex-col items-center justify-between shadow-lg cursor-pointer hover:scale-105 transition"
              onClick={() => navigate(`/games/${game.id}`)}
              style={{ minWidth: 0 }}
            >
              <img
                src={
                  game.cover && game.cover.url
                    ? (() => {
                        const url = game.cover.url.replace(
                          /t_thumb|t_cover_small/g,
                          "t_cover_big"
                        );
                        return url.startsWith("http") ? url : `https:${url}`;
                      })()
                    : "https://via.placeholder.com/90x120?text=No+Image"
                }
                alt={game.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
