import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import React from "react";
import { Box } from "@mui/material";

export interface MovieOption {
  id?: number;
  movie_name: string;
  year: number;
  rating: number;
}
export type MovieDataProps = {
  movieData: Array<MovieOption>;
  onAction: (message?: string, error?: boolean) => void;
  message?: string;
};

interface MovieListProps
  extends AutocompleteProps<MovieOption, boolean, boolean, boolean> {
  options: MovieOption[];
}

const MovieList = (props: MovieListProps) => {
  const { value, options, onChange, ...rest } = props;

  return (
    <Autocomplete
      {...rest}
      disablePortal
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.movie_name
      }
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            key={key}
            component="li"
            {...optionProps}
          >
            {option.movie_name} ({option.year})
          </Box>
        );
      }}
      onChange={onChange}
      value={value}
    />
  );
};

export default MovieList;
