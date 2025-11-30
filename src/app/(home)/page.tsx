// import { DEFAULT_LIMIT } from "@/constants";
// import { HomeView } from "@/modules/home/ui/views/home-view";
// import { HydrateClient, trpc } from "@/trpc/server";

import { HomeView } from "@/modules/home/ui/views/home-view";

export const dynamic = "force-dynamic";

const Page = async () => {
  //   void trpc.categories.getMany.prefetch();
  //   void trpc.videos.getMany.prefetchInfinite({
  //     categoryId,
  //     limit: DEFAULT_LIMIT,
  //   });

  return (
    <>
      {/* <HydrateClient> */}
      <HomeView />
      {/* </HydrateClient> */}
    </>
  );
};

export default Page;
