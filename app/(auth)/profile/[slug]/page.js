/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Loader from "@/app/_components/loader";
import useUserData from "@/app/_hooks/useUserData";
import useAuth from "@/app/_hooks/useAuth";
import { useEffect } from "react";
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  where,
  orderBy,
  getDocs,
  query,
  collection,
} from "firebase/firestore";
import Link from "next/link";

import Post from "@/app/_components/post/post";
import { MyButton } from "@/app/_css/customVariants";

import { Progress, Tooltip } from "@nextui-org/react";
import { app } from "@/app/_utils/firebase";
import { useRouter } from "next/navigation";

import useFetch from "@/app/_hooks/useFetch";
import useLevel from "@/app/_hooks/useLevel";
import useSet from "@/app/_hooks/useSet";

const db = getFirestore(app);

const Page = ({ params }) => {
  const [createChat] = useSet("chats")
  const [userData, loading] = useAuth(false);
  const [data, fetchData] = useUserData(false);
  const [postsData, setFetch] = useFetch("posts", true);
  const router = useRouter();
  const [updateXp] = useLevel(data);

  const toggleFollow = async () => {
    const docRef = doc(db, "users", userData.uid);
    const userRef = doc(db, "users", params.slug);
    let data;
    if (userData.following.every((id) => id !== params.slug)) {
      data = await getDoc(userRef);
      const following = [...userData.following, params.slug];
      const followers = [...data.data().followers, userData.uid];
      updateDoc(docRef, { following });
      updateDoc(userRef, { followers });
    } else {
      data = await getDoc(userRef);
      const following = userData.following.filter((id) => id !== params.slug);
      const followers = data
        .data()
        .followers.filter((id) => id !== userData.uid);
      updateDoc(docRef, { following });
      updateDoc(userRef, { followers });
    }
  };

  useEffect(() => {
    const fetch = async () => {
      if(!params?.slug) return

      await fetchData(params.slug);
      await setFetch(
        orderBy("CreatedAt", "desc"),
        where("uid", "==", params.slug),
      );
      if (data) {
        updateXp(0);
      }
    };
    if (params.slug) {
      fetch();
      params.slug === userData?.uid ? router.replace("/profile") : null;
    }
  }, [params.slug, userData]);
  if (!params.slug || loading) return <Loader />;

  if (!data || data?.blocks?.some((uid) => uid === userData?.uid))
    return (
      <>
        <p>User not found</p>
        <Link href="/">
          <button className="purple-btn">Go back home</button>
        </Link>
      </>
    );

  const addChat = async (uid) => {

    if(!userData) {
      router.push(`/login`)
      return null
    }

    const chatRef = query(collection(db, "chats"), where("uid", "array-contains", userData.uid))
    const chat = await getDocs(chatRef)

    let docId;
    chat.forEach((chat) => { if (chat.data().uid.includes(uid)) docId = chat.id })

    if (docId) {
      router.push(`/chats/${docId}`)
    }
    else {
      const id = self.crypto.randomUUID();

      createChat(id, {
        id,
        uid: [userData.uid, uid],
        messages: [],
      })
      router.push(`/chats/${id}`)
    }
  }


  return (
    <div className="flex max-w-6xl flex-col items-center gap-4 pb-4">
      <h1 className="text-2xl">Profile</h1>
      <img
        className="h-32 w-32 rounded-full border-zinc-600 object-cover"
        src={data.photoURL}
        alt=""
      />
      <p>{data.username}</p>
      <div className="flex gap-4 w-full max-w-xl">
        <MyButton
          className={`purple-btn w-1/2 ${userData?.following?.every((id) => id !== params.slug) ? "" : "bg-zinc-800 border-zinc-800 shadow-zing-900 hover:text-white"}`}
          onClick={
            userData ? () => toggleFollow() : () => router.push("/login")
          }
        >
          {userData?.following.every((follower) => follower !== params.slug) ||
            !userData
            ? "Follow"
            : "Unfollow"}
        </MyButton>
        <MyButton
          onClick={() => addChat(params.slug)}
          className="w-1/2"
        >
          Chat
        </MyButton>
      </div>
      {data?.description && (
        <div className="flex w-full flex-col gap-2">
          <label className="text-lg">Description</label>
          <p className="text-sm text-neutral-300">{data?.description}</p>
        </div>
      )}
      <Tooltip
        content={`Current xp ${data.xp} / ${data.requiredXp}`}
        placement="bottom"
      >
        <Progress
          label={`Level: ${data.level}`}
          color="secondary"
          value={(data.xp / data.requiredXp) * 100}
        />
      </Tooltip>
      <div className="flex w-full justify-center gap-4 border-b border-zinc-500 py-4">
        <Link
          href={`./${params.slug}/followers`}
          className="underline-offset-3 underline"
        >
          Followers {data.followers.length}
        </Link>
        <Link
          href={`./${params.slug}/following`}
          className="underline-offset-3 underline"
        >
          Following {data.following.length}
        </Link>
      </div>
      <div className="w-full">
        <h1 className="font-mono text-2xl">Latest Activities</h1>
        <div className="mt-4 flex flex-col gap-4"></div>
        <Post data={postsData} userData={userData} />
      </div>
    </div>
  );
};

export default Page;
