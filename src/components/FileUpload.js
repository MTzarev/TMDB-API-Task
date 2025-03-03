import React from 'react';
const FileUpload = ({ setMovies, setSelectedMovies }) => {
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = () => {
          const fileContents = reader.result;
          const movieTitles = fileContents.split("\n").map((line) => line.trim());
  
          setMovies(movieTitles);
          setSelectedMovies(movieTitles); 
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a valid .txt file");
      }
    };
  
    return (
      <div>
        <input type="file" accept=".txt" onChange={handleFileChange} />
      </div>
    );
  };
  
  export default FileUpload;
