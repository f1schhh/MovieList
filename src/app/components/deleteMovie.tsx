"use client";
import { Box, Button, TextField } from "@mui/material";
import MovieList, { MovieOption, MovieDataProps } from "./movieList";
import { useState } from "react";

export default function DeleteMovie({ movieData, onAction }: MovieDataProps) {
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);

  const handleMovieChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: NonNullable<string | MovieOption> | (string | MovieOption)[] | null
  ) => {
    if (value && typeof value === "object" && "id" in value) {
      setSelectedMovie(value.id || null);
    } else {
      setSelectedMovie(null);
    }
  };

  const deleteMovie = async () => {
    if (selectedMovie) {
      const response = await fetch(`/api/deletemovie`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedMovie }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        onAction(errorData.message, true);
        setSelectedMovie(null);
        return;
      }
      const results: MovieDataProps = await response.json();
      if (response.ok) {
        onAction(results.message);
      }
      setSelectedMovie(null);
    }
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <MovieList
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        onChange={handleMovieChange}
        options={movieData}
        value={
          movieData.find((movie: MovieOption) => movie.id === selectedMovie) ||
          null
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Movie"
          />
        )}
      />
      <Button
        variant="outlined"
        color="error"
        disabled={!selectedMovie}
        onClick={deleteMovie}
      >
        Delete movie
      </Button>
    </Box>
  );
}
