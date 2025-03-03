
import React, { useState } from 'react';

const MovieCard = ({ movie, removeMovie, onEdit, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMovie, setEditedMovie] = useState({ ...movie });

  const handleEdit = () => {
    if (isEditing) {
      onEdit(editedMovie); 
    }
    setIsEditing(!isEditing); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMovie((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="movie-card">
      <h3><b>{movie.title}</b></h3>
      {isEditing ? (
        <>
          <p>
            Title:{" "}
            <input
              type="text"
              name="title"
              value={editedMovie.title}
              onChange={handleChange}
            />
          </p>
          <p>
            Overview:{" "}
            <textarea
              name="overview"
              value={editedMovie.overview}
              onChange={handleChange}
            />
          </p>
          <p>
            Rating:{" "}
            <input
              type="number"
              name="rating"
              value={editedMovie.rating}
              onChange={handleChange}
            />
          </p>
          <p>
            Release Date:{" "}
            <input
              type="text"
              name="releaseDate"
              value={editedMovie.releaseDate}
              onChange={handleChange}
            />
          </p>
          <p>
            Duration:{" "}
            <input
              type="text"
              name="duration"
              value={editedMovie.duration}
              onChange={handleChange}
            />
          </p>
        </>
      ) : (
        <>
          <p>TMDB: {movie.tmdbId}</p>
          <p>Title: {movie.title}</p>
          <p>Overview: {movie.overview}</p>
          <p>Actors: {movie.actors}</p>
          <p>Genres: {movie.genres.join(", ")}</p>
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} />
          ) : (
            <div className="no-poster">
              <p>No poster available</p>
            </div>
          )}
          <p>Release: {movie.releaseDate}</p>
          <p>Rating: {movie.rating}</p>
          <p>Trailer:
            <a href={movie.trailer} target="_blank" rel="noopener noreferrer">
              Watch Trailer
            </a>
          </p>
          <p>Director: {movie.director}</p>
          <p>Duration: {movie.duration} minutes</p>
        </>
      )}

      
      <div style={{ margin: "10px 20px" }}>
        <button 
          onClick={handleEdit} 
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 20px" }}>
       
        {!isFirst && (
          <button onClick={onMoveUp} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <i className="fas fa-arrow-left" style={{ fontSize: "24px", color: "grey" }}></i>
          </button>
        )}

        
        <button onClick={() => removeMovie(movie.title)} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <i className="fas fa-trash-alt" style={{ fontSize: "24px", color: "grey" }}></i>
        </button>

       
        {!isLast && (
          <button onClick={onMoveDown} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <i className="fas fa-arrow-right" style={{ fontSize: "24px", color: "grey" }}></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
