/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { orderBy, where } from "firebase/firestore";
import { useEffect } from "react";

import Link from "next/link";
import Loader from "@/app/_components/loader";
import Post from "@/app/_components/post/post";
import useAuth from "@/app/_hooks/useAuth";
import useFetch from "@/app/_hooks/useFetch";
import { Progress, Spacer, Tooltip } from "@nextui-org/react";

const Page = () => {
  const [data, setFetch] = useFetch("posts");
  const [userData, loading] = useAuth(true);

  useEffect(() => {
    if (userData) {
      setFetch(orderBy("CreatedAt", "desc"), where("uid", "==", userData.uid));
    }
  }, [userData]);

  if (loading || !userData) {
    return <Loader />;
  }

  return (
    <div className="flex max-w-6xl flex-col gap-4 pb-4">
      <h1 className="text-2xl">Profile</h1>
      <div className="flex flex-col items-center gap-4 border-b border-zinc-500 pb-4">
        <label className="relative h-fit w-fit rounded-full">
          <img
            className="h-32 w-32 rounded-full object-cover"
            alt=""
            src={userData.photoURL}
          />
        </label>
        <div className="flex items-center justify-center gap-1">
          <p>{userData.username}</p>
        </div>
        {/* user Description */}
        {userData?.description && (
          <div className="flex w-full flex-col gap-2">
            <label className="text-lg">Description</label>
            <p className="text-sm text-neutral-300">{userData?.description}</p>
          </div>
        )}
        <Tooltip
          content={`Current XP : ${userData.xp ? userData.xp + " / " + userData.requiredXp : 0
            }`}
          placement="bottom"
        >
          <Progress
            label={`Level: ${userData.level ? userData.level : 0}`}
            color="secondary"
            value={userData.xp ? (userData.xp / userData.requiredXp) * 100 : 0}
          />
        </Tooltip>
        <div className="flex flex-col gap-2 w-full items-start justify-center">
          <label className="text-lg">Streak</label>
          <div className="text-sm text-neutral-300">
            <p>Current streak: {userData?.streak?.at(-1)?.streak}</p>
            <p>Heighest streak: {Math.max.apply(Math, userData?.streak?.map(x => x.streak))}</p>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <Link href="/followers" className="underline-offset-3 underline">
            Followers {userData.followers.length}
          </Link>
          <Link href="/following" className="underline-offset-3 underline">
            Following {userData.following.length}
          </Link>
        </div>
      </div>
      <div>
        <h1 className="text-2xl">My Activities</h1>
        <div className="mt-4 flex flex-col gap-4"></div>
        <Post data={data} userData={userData} />
      </div>
    </div>
  );
};

export default Page;
