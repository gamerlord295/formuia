/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import Post from "@/app/_components/post/post";
import {
  collection,
  doc,
  documentId,
  onSnapshot,
  updateDoc,
  where,
} from "firebase/firestore";

import useFetch from "@/app/_hooks/useFetch";
import useAuth from "@/app/_hooks/useAuth";
import useLevel from "../../_hooks/useLevel";

import { MyInput, MyButton } from "@/app/_css/customVariants";
import Loader from "@/app/_components/loader";
import Comment from "@/app/_components/post/comment";

import { db } from "@/app/_utils/firebase";
import { Link } from "@nextui-org/react";


const Page = ({ params }) => {
  const [data, setFetch] = useFetch("posts");
  const [userData, loading] = useAuth(false);
  const [user, setUser] = useState(null);
  const [updateXp] = useLevel(user);

  const [activeComment, setActiveComment] = useState(null);

  const { slug } = params;

  useEffect(() => {
    if (!params.slug) return null;

    setFetch(where(documentId(), "==", params.slug));
  }, [params]);

  useEffect(() => {
    if (data) {
      fetchUser(data.uid);
    }
  }, [data]);

  const fetchUser = (uid) => {
    const docRef = doc(collection(db, "users"), uid);

    onSnapshot(docRef, (item) => {
      setUser(item.data());
    });
  };

  const handleComment = async (e) => {
    const postRef = doc(db, "posts", slug);
    e.preventDefault();
    const commentText = e.target.input.value;

    let comment;
    let comments;

    if (userData && commentText && !activeComment) {
      comments = data.comments
      comment = {
        comment: commentText,
        id: self.crypto.randomUUID(),
        userUid: userData.uid,
      };
    }
    else if (userData && commentText && activeComment) {

      comment = data.comments.filter(comment => comment.id === activeComment.id)[0]
      comments = data.comments.filter(comment => comment.id !== activeComment.id)

      if (comment?.replys) {
        comment = { ...comment, replys: [...comment.replys, { comment: commentText, id: self.crypto.randomUUID(), userUid: userData.uid, replyTo: activeComment.replyTo }] }
      } else {
        comment = {...comment, replys: [{ comment: commentText, id: self.crypto.randomUUID(), userUid: userData.uid, replyTo: activeComment.replyTo }]}
      }

    }

    comments.push(comment)

    e.target.input.value = "";
    setActiveComment(null);
    await updateDoc(postRef, { comments });
    
    if (user?.uid !== userData?.uid) {
      updateXp(10);
    }
  };



  if (loading) return <Loader />;

  if (!data || userData?.blocked?.includes(data.uid))
    return (
      <>
        <p>Post not found</p>
        <Link className="purple-btn text-white" href="/">
          Go back home
        </Link>
      </>
    )

  return (
    <>
      {/* Post Component */}
      <Post data={[data]} userData={userData} />

      {/* Comments Section */}
      <div className="relative mt-2 flex h-full flex-col rounded-2xl rounded-t-none border-2 border-t-transparent p-4">
        <div className="flex h-full flex-col gap-0">
          {data?.comments?.map((comment) => (

            // {/* comment */}
            <Comment data={comment} comments={data.comments} slug={slug} parentId={comment.id} parentData={comment} setActiveComment={setActiveComment} key={comment.id} />
          ))}
        </div>

        {/* Comment input */}

        {activeComment?.comment &&
          <div className="flex flex-row items-center justify-between px-4 py-2 rounded-full bg-zinc-900">
            <p className="text-[14px]">replying to <span className="font-bold">{activeComment?.comment}</span></p>
            <p className="cursor-pointer underline text-rose-800" onClick={() => setActiveComment(null)} >cancel</p>
          </div>
        }
        <form className="mt-4 flex flex-row gap-4" onSubmit={(e) => handleComment(e)}>
          <MyInput
            name="input"
            placeholder="Add a comment"
            color="violet"
            variant="bordered"
            labelPlacement="outside"
            className="w-full"
          />
          <MyButton type="submit" color="violet">
            Submit
          </MyButton>
        </form>
      </div>
    </>
  );
};

export default Page;