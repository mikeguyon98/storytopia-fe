import React from "react";
import Page from "../components/utils/Page";
import { ExploreTile } from "../components/explore/ExploreTile";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { SplashButton } from "../components/buttons/SplashButton";
import { useAuth } from "../AuthProvider";

// const BASE_URL = "http://127.0.0.1:8000"
const BASE_URL = "https://storytopia-fastapi-kgdwevjo6a-ue.a.run.app"

const fetchExploreData = async ({ pageParam = 1, pageSize = 9 }) => {
  const response = await axios.get(
    `${BASE_URL}/stories/explore`,
    {
      params: {
        page: pageParam,
        page_size: pageSize,
      },
    }
  );
  console.log(response);
  return response.data;
};

const Explore = () => {
  const { currentUser } = useAuth();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["explore"],
    queryFn: fetchExploreData,
    getNextPageParam: (lastPage, allPages) => {
      // Here, determine if there's another page to fetch
      // Assuming that if lastPage has data, there's another page
      return lastPage.length ? allPages.length + 1 : undefined;
    },
  });

  //   console.log(data)

  return (
    <Page>
      <div className="text-xl font-bold py-8">Explore</div>
      <div className="flex flex-row flex-wrap gap-4">
        {status === "loading" ? (
          <p>Loading...</p>
        ) : status === "error" ? (
          <p>Error: {error.message}</p>
        ) : (
          <>
            {data?.pages.map((page, pageIndex) => (
              <React.Fragment key={pageIndex}>
                {page.map((story) => (
                  <ExploreTile
                    key={story.id}
                    image={story.story_images[0]}
                    title={story.title}
                    description={story.description}
                    userId={currentUser.reloadUserInfo.localId}
                    likes={story.likes}
                    saves={story.saves}
                    postId={story.id}
                  />
                ))}
              </React.Fragment>
            ))}
            <div className="flex justify-center w-full pb-8">
              <SplashButton
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                  ? "Load More"
                  : "Nothing more to load"}
              </SplashButton>
            </div>
          </>
        )}
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </Page>
  );
};

export default Explore;
