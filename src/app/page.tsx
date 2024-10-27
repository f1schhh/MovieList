"use client";
import { Alert, Box, Typography } from "@mui/material";
import DeleteMovie from "./components/deleteMovie";
import EditMovie from "./components/editMovie";
import { useEffect, useState } from "react";
import AddMovie from "./components/addMovie";
async function getMovies() {
  const response = await fetch("/api/movies");
  const results = await response.json();
  return results;
}
export default function Home() {
  const [movies, setMovies] = useState([]);
  const [responseMsg, setResponseMsg] = useState<string | null>("");
  const [error, setError] = useState(false);
  const fetchData = async (message?: string, error?: boolean) => {
    const data = await getMovies();
    setMovies(data);
    setResponseMsg(message || null);
    setError(error || false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h3">Movie List Actions</Typography>{" "}
      {responseMsg && (
        <Alert
          severity={error ? "error" : "success"}
          variant="outlined"
          sx={{ width: "100%" }}
          onClose={() => {
            setResponseMsg(null);
          }}
        >
          {responseMsg}
        </Alert>
      )}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5">Delete a movie 🗑️</Typography>
          <DeleteMovie
            movieData={movies}
            onAction={fetchData}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5">Edit a movie 📝</Typography>
          <EditMovie
            movieData={movies}
            onAction={fetchData}
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5">Add a movie ✨</Typography>
        <AddMovie
          movieData={movies}
          onAction={fetchData}
        />
      </Box>
    </Box>
  );
}
