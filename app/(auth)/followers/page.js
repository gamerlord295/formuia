"use client";

import useAuth from "@/app/_hooks/useAuth";
import Follower from "@/app/_components/user/follower";

function Page() {
  const [userData, loading] = useAuth(true);

  return (
    <>
      <h1 className="text-2xl">Followers</h1>
      <ul>
        {userData?.followers.map((follower) => (
          <Follower key={follower} data={follower} />
        ))}
      </ul>
    </>
  );
}

export default Page;
