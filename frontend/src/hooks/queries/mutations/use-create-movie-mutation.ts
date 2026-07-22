import { createMovie } from "@/api/movies";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateMovieMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createMovie(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}
