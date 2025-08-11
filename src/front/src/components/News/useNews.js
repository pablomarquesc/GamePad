import { useState, useEffect } from "react";
import {
  NEWS_API_KEY,
  BASE_URL,
  PAGE_SIZE,
  MAX_PAGES,
  isGameNews,
} from "./newsUtils";

// Dados mock para quando a API falhar
const MOCK_NEWS = [
  {
    title: "Novidades em Games 2024",
    description: "As principais novidades do mundo dos games para este ano.",
    url: "#",
    urlToImage: "/src/assets/gameplay2.jpg",
    publishedAt: "2024-08-11T10:00:00Z",
    source: { name: "GamePad News" },
  },
  {
    title: "Lançamentos Esperados",
    description: "Os jogos mais esperados para os próximos meses.",
    url: "#",
    urlToImage: "/src/assets/capa1.jpg",
    publishedAt: "2024-08-11T09:00:00Z",
    source: { name: "GamePad News" },
  },
  {
    title: "Análises e Reviews",
    description: "Confira as análises dos jogos mais recentes.",
    url: "#",
    urlToImage: "/src/assets/gamepad1.png",
    publishedAt: "2024-08-11T08:00:00Z",
    source: { name: "GamePad News" },
  },
];

export default function useNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ platform: "", search: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError("");
    setPage(1);

    let query = filters.search ? filters.search : "games";
    if (filters.platform) {
      query += ` ${filters.platform}`;
    }

    fetch(
      `${BASE_URL}?q=${encodeURIComponent(
        query
      )}&language=pt&sortBy=publishedAt&pageSize=${
        PAGE_SIZE * MAX_PAGES
      }&apiKey=${NEWS_API_KEY}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.articles && Array.isArray(data.articles)) {
          let filtered = data.articles.filter(isGameNews);
          filtered = filtered.slice(0, PAGE_SIZE * MAX_PAGES);
          setNews(filtered);
          setTotalPages(Math.ceil(filtered.length / PAGE_SIZE));
        } else {
          // Se não há artigos, usar dados mock
          console.warn("NewsAPI não retornou artigos, usando dados mock");
          setNews(MOCK_NEWS);
          setTotalPages(Math.ceil(MOCK_NEWS.length / PAGE_SIZE));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn(
          "Erro ao carregar notícias da API, usando dados mock:",
          err
        );
        setNews(MOCK_NEWS);
        setTotalPages(Math.ceil(MOCK_NEWS.length / PAGE_SIZE));
        setError(""); // Não mostrar erro para o usuário
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const paginatedNews = Array.isArray(news) ? news.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : [];

  return {
    news: paginatedNews,
    loading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    totalPages,
    PAGE_SIZE,
    MAX_PAGES,
  };
}
