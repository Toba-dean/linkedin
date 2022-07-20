import { useEffect, useState } from "react";

import { Input } from "./Input";
import { Post } from "./Post";

import { useRecoilState } from "recoil";
import { handlePostState, useSSRPostsState } from "../atoms/postAtom";

const Feed = ({ posts }) => {

  const [realtimePosts, setRealtimePosts] = useState([]);
  const [handlePost, setHandlePost] = useRecoilState(handlePostState);
  const [useSSRPosts, setUseSSRPosts] = useRecoilState(useSSRPostsState);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await response.json();
      setRealtimePosts(responseData);
      setHandlePost(false);
      setUseSSRPosts(false);
    };

    fetchPosts();
  }, [handlePost]);

  return (
    <div className="space-y-6 pb-24 max-w-xl">
      <Input />
      {
        // if useSSRPosts === false render the new post else render the post in DB
        !useSSRPosts ? (
          realtimePosts.map(post => (
            <Post key={post.id} post={post} />
          )) 
        ) : (
          posts.map(post => (
            <Post key={post.id} post={post} />
          ))
        )
      }
    </div>
  )
}

export default Feed