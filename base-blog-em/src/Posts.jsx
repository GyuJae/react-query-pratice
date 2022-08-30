import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError, error } = useQuery(['posts', currentPage], () => fetchPosts(currentPage), {
    staleTime: 20000,
    keepPreviousData: true
  });

  useEffect(() => { 
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(['posts', nextPage], () => fetchPosts(nextPage))
    }
  },[currentPage, queryClient])

  if (isLoading) {
    return <h3>Loading...</h3>
  }
  if (isError) {
    return (
      <>
        <h3>Oops,, Something went wrong..</h3>
        <p>{error.toString()}</p>
      </>
    )
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= 0} onClick={() => setCurrentPage(prev => prev - 1)}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled={currentPage >= maxPostPage} onClick={() => setCurrentPage(prev => prev + 1)}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
