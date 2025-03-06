import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

const useGetImages = () => {
  const query = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const response = await client.api.images.$get();
      if (!response.ok) {
        console.log("response is not okay");
        throw new Error("Failed to fetch images");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};

export default useGetImages;
