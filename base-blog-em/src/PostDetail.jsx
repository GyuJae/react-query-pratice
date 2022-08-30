import { useMutation, useQuery } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const {data, isLoading, isError, error} = useQuery(['comments', post.id], () => fetchComments(post.id));

  const deleteMutate = useMutation(() => deletePost(post.id));
  const updateMutate = useMutation(() => updatePost(post.id)); 

  if (isLoading) return <h3>Loading...</h3>;
  if (isError) {
    return (
      <>
        <h3>Oops, Something went wrong...</h3>
        <p>{error.toString()}</p>
      </>
    )
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button type='button' onClick={() => {
        if (deleteMutate.isLoading) return;
        deleteMutate.mutate();
      }}>Delete</button>

      {deleteMutate.isLoading && <p style={{color: 'purple'}}>Loading...</p>}
      {deleteMutate.isSuccess && <p style={{color: 'green'}}>Success!!!</p>}
      {deleteMutate.isError && <p style={{ color: 'red' }}>Error Occure: { deleteMutate.error.isString()}</p>}
      
      <button type='button' onClick={() => {
        if (updateMutate.isLoading) return;
        updateMutate.mutate();
      }}>Update title</button>

      {updateMutate.isLoading && <p style={{color: 'purple'}}>Loading...</p>}
      {updateMutate.isSuccess && <p style={{color: 'green'}}>Success!!!</p>}
      {updateMutate.isError && <p style={{ color: 'red' }}>Error Occure: { updateMutate.error.isString()}</p>}

      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
