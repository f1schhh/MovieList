"use client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import MovieList, { MovieOption, MovieDataProps } from "./movieList";
export default function EditMovie({ movieData, onAction }: MovieDataProps) {
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [selectedMovieData, setSelectedMovieData] = useState<
    MovieOption | undefined
  >(undefined);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleMovieChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: NonNullable<string | MovieOption> | (string | MovieOption)[] | null
  ) => {
    if (value && typeof value === "object" && "id" in value) {
      setSelectedMovie(value.id || null);
      setSelectedMovieData(
        movieData?.find((movie: MovieOption) => movie.id === value.id)
      );
      return;
    }
    setSelectedMovie(null);
  };

  const updateMovie = async (formData: MovieOption) => {
    if (selectedMovie) {
      try {
        const response = await fetch(`/api/editmovie`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedMovie,
            movie_name: formData.movie_name,
            year: Math.floor(formData.year),
            rating: formData.rating.toFixed(1),
          }),
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
      } catch (error) {
        console.log(error);
      }
    }
    setSelectedMovie(null);
  };

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
    >
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
        disabled={!selectedMovie}
        onClick={handleOpen}
      >
        Edit Movie
      </Button>
      {selectedMovie && (
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const typedFormData: MovieOption = {
                id: selectedMovie,
                movie_name: formJson.movie_name as string,
                year: parseInt(formJson.year as string, 10),
                rating: parseFloat(formJson.rating as string),
              };
              updateMovie(typedFormData);
              handleClose();
            },
          }}
          fullWidth
        >
          <DialogTitle>Edit Movie</DialogTitle>
          <DialogContent>
            <DialogContentText>Edit the movie details</DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="movie_name"
              name="movie_name"
              label="Movie Name"
              type="text"
              fullWidth
              variant="standard"
              value={selectedMovieData?.movie_name}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="year"
              name="year"
              label="Year"
              type="number"
              fullWidth
              variant="standard"
              defaultValue={selectedMovieData?.year}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="rating"
              name="rating"
              label="Rating"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={selectedMovieData?.rating}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
