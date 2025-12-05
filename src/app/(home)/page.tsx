import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";
import { HomeView } from "@/modules/home/ui/views/home-view";

export const dynamic = "force-dynamic";

const Page = async () => {
  void trpc.todos.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <>
      <HydrateClient>
        <HomeView />
      </HydrateClient>
    </>
  );
};

export default Page;
