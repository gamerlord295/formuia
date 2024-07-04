import React, { useEffect } from "react";
import UserAvatar from "@/app/_components/user/avatar";
import { useStore } from "@/app/_hooks/useStore";
import useUserData from "@/app/_hooks/useUserData";
import { MyButton } from "@/app/_css/customVariants";
import useBlock from "@/app/_hooks/useBlock";

export default function BlockedUser({ uid }) {
  const [user, fetchUser] = useUserData(false);
  const { userData } = useStore();
  const [block] = useBlock(userData);

  useEffect(() => {
    fetchUser(uid);
  }, [uid]);
  if (!user) return;
  return (
    <div className="flex h-16 pb-6 flex-row items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <UserAvatar userData={userData} user={user} />
        <p>{user.username}</p>
      </div>
      <MyButton color="violet" onClick={() => block(user)}>Unblock</MyButton>
    </div>
  );
}
