"use client";

import { doc, getDoc, getFirestore, updateDoc } from "@firebase/firestore";

import { Avatar } from "@nextui-org/react";
import { app } from "@/app/_utils/firebase";
import { useEffect, useState } from "react";
import useAuth from "@/app/_hooks/useAuth";
import Link from "next/link";

import { MyButton } from "@/app/_css/customVariants";

const db = getFirestore(app);

function Follower({ data }) {
  const [follower, setFollower] = useState();
  const [userData, loading] = useAuth(false);

  const getData = async () => {
    const docRef = doc(db, "users", data);
    const userData = await getDoc(docRef);
    setFollower(userData.data());
  };

  const toggleFollow = async () => {
    const docRef = doc(db, "users", userData.uid);
    const userRef = doc(db, "users", follower.uid);
    let userFollowers;
    if (userData.following.every((id) => id !== data)) {
      userFollowers = await getDoc(userRef);
      const following = [...userData.following, data];
      const followers = [...userFollowers.data().followers, userData.uid];

      await updateDoc(docRef, { following });
      await updateDoc(userRef, { followers });
    } else {
      userFollowers = await getDoc(userRef);
      const following = userData.following.filter((id) => id !== data);
      const followers = userFollowers.data().followers.filter((id) => id !== userData.uid);

      await updateDoc(docRef, { following });
      await updateDoc(userRef, { followers });
    }
  };

  useEffect(() => {
    getData();
  }, [data]);

  if (!follower) return;

  return (
    <div className="flex flex-wrap items-center justify-between border-b-1 border-zinc-600 p-4">
      <Link href={`/profile/${data}`} className="flex items-center gap-2">
        <Avatar src={follower.photoURL} className="outline outline-2 outline-offset-2" />
        <p>{follower.username}</p>
      </Link>
      {userData?.uid !== data && (
        <MyButton onClick={() => toggleFollow()} className={`w-full max-w-[100px] ${userData?.following?.every((id) => id !== data) ? "" : "bg-zinc-800 border-zinc-800 shadow-zing-900 hover:text-white"}`}>
          {userData?.following?.every((id) => id !== data)
            ? "Follow"
            : "Unfollow"}
        </MyButton>
      )}
    </div>
  );
}

export default Follower;
