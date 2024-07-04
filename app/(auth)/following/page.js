"use client";

import useAuth from "@/app/_hooks/useAuth";
import Follower from "../../_components/user/follower";

function Page() {
  const [userData, loading] = useAuth(true);

  return (
    <>
      <h1>Following</h1>
      <ul>
        {userData?.following.map((follower) => (
          <Follower key={follower} data={follower} />
        ))}
      </ul>
    </>
  );
}

export default Page;
