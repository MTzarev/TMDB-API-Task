import React, { useState, useEffect } from "react";
import './styles.css';
import MovieCard from "./components/MovieCard";
import FileUpload from "./components/FileUpload";
import Footer from "./components/Footer";


const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [movieData, setMovieData] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isSaveMode, setIsSaveMode] = useState(false);
  const [manualSearchQuery, setManualSearchQuery] = useState("");
  const [manualSearchResults, setManualSearchResults] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [isHeaderAnimated, setIsHeaderAnimated] = useState(false); // State for header animation
  const [isContentVisible, setIsContentVisible] = useState(false); // State for content visibility

  
  useEffect(() => {
    setIsHeaderAnimated(true);

    
    const timeout = setTimeout(() => {
      setIsContentVisible(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const handleCheckboxChange = (title) => {
    setSelectedMovies((prev) => {
      const newSelectedMovies = prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title];

      if (newSelectedMovies.length > 0) {
        setIsSaveMode(false);
      }
      return newSelectedMovies;
    });
  };

  const fetchMovieData = async () => {
    if (selectedMovies.length === 0) {
      alert("Please select at least one movie to search.");
      return;
    }

    setSearching(true);
    const results = [];
    setMovieData([]); 

 

    for (const title of selectedMovies) {
      const encodedTitle = encodeURIComponent(title);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=5db32cb5f04f06c8d0f922274cb0af2e&query=${encodedTitle}&language=${selectedLanguage}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }

        const data = await response.json();
        const movie = data.results[0]; 

        if (movie) {
          const movieDetailsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=5db32cb5f04f06c8d0f922274cb0af2e&append_to_response=credits,videos&language=${selectedLanguage}`
          );

          const movieDetailsData = await movieDetailsResponse.json();

          const director =
            movieDetailsData.credits?.crew?.find((member) => member.job === "Director")?.name ||
            "Not available";

          const actors =
            movieDetailsData.credits?.cast?.slice(0, 5).map((actor) => actor.name).join(", ") || "Not available";

          const trailer = movieDetailsData.videos?.results?.find((video) => video.type === "Trailer");
          const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "Not available";

          const movieInfo = {
            tmdbId: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster: movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
              : null,
            rating: movie.vote_average,
            releaseDate: movie.release_date,
            genres: movieDetailsData.genres.map((genre) => genre.name) || [],
            director: director,
            duration: movieDetailsData.runtime || "N/A",
            trailer: trailerUrl,
            actors: actors,
          };

          results.push(movieInfo);
        }
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    }

    setMovieData(results);
    setSearching(false);
    setIsSaveMode(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData),
      });

      if (response.ok) {
        alert("Movies saved successfully");
      } else {
        alert("Error saving movies");
      }
    } catch (error) {
      console.error("Error sending data:", error);
      alert("There was an error saving the movies.");
    }
  };

  const removeMovie = (title) => {
    setMovieData((prev) => {
      const updatedMovieData = prev.filter((movie) => movie.title !== title);
      if (updatedMovieData.length === 0) {
        setIsSaveMode(false);
      }
      return updatedMovieData;
    });

    setSelectedMovies((prev) => {
      const newSelectedMovies = prev.filter((movie) => movie !== title);
      if (newSelectedMovies.length === 0) {
        setIsSaveMode(false);
      }
      return newSelectedMovies;
    });
  };

  const handleManualSearch = async () => {
    const encodedTitle = encodeURIComponent(manualSearchQuery);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=5db32cb5f04f06c8d0f922274cb0af2e&query=${encodedTitle}&language=${selectedLanguage}`
      );
      const data = await response.json();
      setManualSearchResults(data.results);
    } catch (error) {
      console.error("Error fetching manual search data:", error);
    }
  };

  const handleAddMovie = async (movie) => {
    try {
      const movieDetailsResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=5db32cb5f04f06c8d0f922274cb0af2e&append_to_response=credits,videos&language=${selectedLanguage}`
      );
      const movieDetailsData = await movieDetailsResponse.json();

      const movieInfo = {
        tmdbId: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        rating: movie.vote_average,
        releaseDate: movie.release_date,
        genres: movieDetailsData.genres.map((genre) => genre.name) || [],
        director:
          movieDetailsData.credits?.crew?.find((member) => member.job === "Director")?.name ||
          "Not available",
        duration: movieDetailsData.runtime || "N/A",
        trailer: movieDetailsData.videos?.results?.find((video) => video.type === "Trailer")
          ? `https://www.youtube.com/watch?v=${movieDetailsData.videos.results[0].key}`
          : "Not available",
        actors:
          movieDetailsData.credits?.cast?.slice(0, 5).map((actor) => actor.name).join(", ") || "Not available",
      };
      
      setMovieData((prev) => [...prev, movieInfo]);
      setManualSearchQuery("");
      setManualSearchResults([]);
      setIsSaveMode(true);
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const handleEditMovie = (editedMovie) => {
    setMovieData((prev) =>
      prev.map((movie) =>
        movie.tmdbId === editedMovie.tmdbId ? editedMovie : movie
      )
    );
  };

  const moveMovieUp = (index) => {
    if (index > 0) {
      const newMovieData = [...movieData];
      const temp = newMovieData[index - 1];
      newMovieData[index - 1] = newMovieData[index];
      newMovieData[index] = temp;
      setMovieData(newMovieData);
    }
  };

  const moveMovieDown = (index) => {
    if (index < movieData.length - 1) {
      const newMovieData = [...movieData];
      const temp = newMovieData[index + 1];
      newMovieData[index + 1] = newMovieData[index];
      newMovieData[index] = temp;
      setMovieData(newMovieData);
    }
  };

  const translations = {
    en: {
      search: "Search",
      save: "Save",
      searching: "Searching..."
    },
    es: {
      search: "Buscar",
      save: "Guardar",
      searching: "Buscando..."
    },
    fr: {
      search: "Rechercher",
      save: "Sauvegarder",
      searching: "Recherche...",
    },
  };

  const buttonText = isSaveMode
    ? translations[selectedLanguage].save
    : searching
    ? translations[selectedLanguage].searching
    : translations[selectedLanguage].search;

  const allGenres = [...new Set(movieData.flatMap((movie) => movie.genres))];
  const filteredMovies = selectedGenre
    ? movieData.filter((movie) => movie.genres.includes(selectedGenre))
    : movieData;

  return (
    <div>
      
      <h1
        className={isHeaderAnimated ? "header-animate" : ""}
        style={{ fontSize: isHeaderAnimated ? "4rem" : "1rem", transition: "font-size 3s" }}
      >
        Your Movie List
      </h1>

    Search special movie
      {isContentVisible && (
        <>
          <FileUpload setMovies={setMovies} setSelectedMovies={setSelectedMovies} />
          
          <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>

          <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
            <option value="">All Genres</option>
            {allGenres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={manualSearchQuery}
            onChange={(e) => setManualSearchQuery(e.target.value)}
            onKeyUp={handleManualSearch}
            placeholder="Search special movie..."
          />
          {manualSearchQuery && manualSearchResults.length > 0 && (
            <ul >
              {manualSearchResults.map((movie) => (
                <li key={movie.id} onClick={() => handleAddMovie(movie)}>
                  <span>{movie.title}</span>
                </li>
              ))}
            </ul>
          )}

          <div>
            {movies.map((movie, index) => (
              <div key={index}>
                <input 
                  type="checkbox" 
                  checked={selectedMovies.includes(movie)}
                  onChange={() => handleCheckboxChange(movie)}
                />
                {movie}
              </div>
            ))}
          </div>
          <button onClick={fetchMovieData} disabled={searching}>
            {buttonText}
          </button>

          <div>
            {filteredMovies.map((movie, index) => (
              <MovieCard
                key={index}
                movie={movie}
                removeMovie={removeMovie}
                onEdit={handleEditMovie}
                onMoveUp={() => moveMovieUp(index)}
                onMoveDown={() => moveMovieDown(index)}
                isFirst={index === 0}
                isLast={index === filteredMovies.length - 1}
              />
            ))}
          </div>
        </>
      )}
  <Footer/>
    </div>
  );
};

export default App;