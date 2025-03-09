import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

const useGetImages = () => {
  const query = useQuery({
    queryKey: ["wallpaper"],
    queryFn: async () => {
      const response = await client.api.wallpaper.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch wallpaper");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
export default useGetImages;
