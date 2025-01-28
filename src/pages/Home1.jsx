import React, { useState, useEffect } from "react";

const Home1 = () => {
  const [weather, setWeather] = useState([]);
  const [news, setNews] = useState([]);
  const [anime, setAnime] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=33.6844&longitude=73.0479&current_weather=true&temperature_unit=celsius`
        );
        const data = await response.json();
        setWeather([data.current_weather]);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_NEWSAPI_KEY`
        );
        const data = await response.json();
        setNews(data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    const fetchAnime = async () => {
      try {
        const response = await fetch(
          `https://graphql.anilist.co/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: `
              query {
                Page(page: 1, perPage: 6) {
                  media(type: ANIME, sort: TRENDING_DESC) {
                    id
                    title {
                      romaji
                      english
                    }
                    coverImage {
                      large
                    }
                    genres
                    seasonYear
                  }
                }
              }`,
            }),
          }
        );
        const data = await response.json();
        setAnime(data.data.Page.media);
      } catch (error) {
        console.error("Error fetching AniList data:", error);
      }
    };

    const fetchMatches = async () => {
      try {
        const response = await fetch(
          `https://cricapi.com/api/matches?apikey=YOUR_FREE_API_KEY`
        );
        const data = await response.json();
        setMatches(data.matches);
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    };

    Promise.all([fetchWeather(), fetchNews(), fetchAnime(), fetchMatches()]).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-blue-600">Home 1</h1>

      {/* Weather Section */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-gray-800">Weather Updates (Pakistan)</h2>
        <div className="p-4 border border-gray-200 rounded-lg shadow-md bg-white">
          {weather.length > 0 ? (
            <div>
              <p className="text-lg">
                Temperature: <span className="font-semibold">{weather[0].temperature}°C</span>
              </p>
              <p className="text-sm text-gray-500">Condition: {weather[0].weathercode}</p>
            </div>
          ) : (
            <p>Weather data not available.</p>
          )}
        </div>
      </section>

      {/* News Section */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-gray-800">Global News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.slice(0, 6).map((article, index) => (
            <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  {article.title}
                </a>
              </h3>
              <p className="text-sm text-gray-600">{article.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Anime Section */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-gray-800">Trending Anime</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {anime.slice(0, 6).map((item) => (
            <div key={item.id} className="bg-white p-4 border border-gray-200 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{item.title.romaji}</h3>
              <img src={item.coverImage.large} alt={item.title.romaji} className="w-full h-48 object-cover" />
              <p className="text-sm text-gray-500">{item.seasonYear} - {item.genres.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Matches Section */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-gray-800">Live Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.slice(0, 6).map((match, index) => (
            <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">
                {match.team1} vs {match.team2}
              </h3>
              <p className="text-sm text-gray-500">Status: {match.status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home1;
