/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import Post from "@/app/_components/post/post";
import PostForm from "@/app/_components/post/postForm";
import Loader from "@/app/_components/loader";
import { useEffect, useState } from "react";
import useAuth from "@/app/_hooks/useAuth";
import { useRouter } from "next/navigation";
import useFetch from "../_hooks/useFetch";
import { orderBy } from "firebase/firestore";

const Page = () => {
  const [data, fetchPosts] = useFetch("posts")
  const [posts, setPosts] = useState([]);
  const [userData, loading] = useAuth(false);
  const router = useRouter();

  useEffect(() => {
    const firstTime = localStorage.getItem("firstTime");

    if (!firstTime) {
      localStorage.setItem("firstTime", true);
      router.push("/landing");
    }
  }, []);

  useEffect(() => {
    fetchPosts(orderBy("CreatedAt", "desc"))
  }, [userData]);

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return;

    let postsData = data.filter((post) => !userData?.blocks?.includes(post.uid))
    setPosts(postsData?.filter((post) => !userData?.blocked?.includes(post.uid)))
  }, [data])

  if (loading || !data) {
    return <Loader />;
  }

  return (
    <>
      {userData ? (
        <PostForm />
      ) : (
        <div className="m-10 flex flex-col items-center">
          <h1>Login to share a post</h1>
          <Link href="../login">
            <div className="mt-4 w-20 rounded-lg border border-violet-600 bg-violet-600 p-2 text-center transition hover:bg-transparent">
              Login
            </div>
          </Link>
        </div>
      )}
      <div>
        <h1 className="pb-2 text-2xl">Feed</h1>
        {posts && <Post data={posts} userData={userData} />}
      </div>
    </>
  );
};

export default Page;
