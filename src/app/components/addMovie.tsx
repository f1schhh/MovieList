"use client";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useState } from "react";
import { MovieDataProps, MovieOption } from "./movieList";

export default function AddMovie({ movieData, onAction }: MovieDataProps) {
  const [movieStatus, setMovieStatus] = useState<boolean>(false);
  const checkIfMovieExists = (movieName: string) => {
    setMovieStatus(
      movieData?.some(
        (movie: MovieOption) =>
          movie.movie_name.toLowerCase() === movieName.toLowerCase()
      ) ?? false
    );
  };
  const addMovie = async (formData: MovieOption) => {
    try {
      const response = await fetch(`/api/addmovie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie_name: formData.movie_name,
          year: Math.floor(formData.year),
          rating: formData.rating.toFixed(1),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        onAction(errorData.message, true);
        return;
      }
      const results: MovieDataProps = await response.json();
      if (response.ok) {
        onAction(results.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const typedFormData: MovieOption = {
            movie_name: formJson.movie_name as string,
            year: parseInt(formJson.year as string, 10),
            rating: parseFloat(formJson.rating as string),
          };
          addMovie(typedFormData);
          event.currentTarget.reset();
        }}
      >
        <Stack gap={2}>
          <FormControl>
            <InputLabel htmlFor="movie-name">Movie name</InputLabel>
            <OutlinedInput
              id="movie-name"
              name="movie_name"
              label="Movie name"
              onChange={(event) => checkIfMovieExists(event.target.value)}
              required
              endAdornment={
                <InputAdornment position="end">
                  {movieStatus ? (
                    <Stack
                      alignItems="center"
                      direction="row"
                      gap={1}
                    >
                      <ErrorOutlineIcon color="error" />
                      <Typography color="error">
                        Movie already exists
                      </Typography>
                    </Stack>
                  ) : null}
                </InputAdornment>
              }
            />
          </FormControl>
          <TextField
            name="year"
            label="Year"
            variant="outlined"
            type="number"
            required
          />
          <TextField
            name="rating"
            label="Rating"
            variant="outlined"
            type="text"
            required
          />
          <Button
            type="submit"
            variant="outlined"
            disabled={movieStatus}
          >
            Add movie
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
