"use client";
import Loader from "@/app/_components/loader";
import Follower from "@/app/_components/user/follower";
import useAuth from "@/app/_hooks/useAuth";
import useUserData from "@/app/_hooks/useUserData";
import { useEffect } from "react";

const Page = ({ params }) => {
  const [userData, loading] = useAuth(false);
  const [data, fetchData] = useUserData(false);

  useEffect(() => {
    const fetch = async () => {
      await fetchData(params.slug);
      console.log(data);
    };
    if (params.slug) {
      fetch();
    }
  }, [params.slug]);
  if (!params.slug || loading) return <Loader />;

  return (
    <>
      <h1>Followers</h1>
      <ul>
        {data?.followers.map((follower) => (
          <Follower key={follower} data={follower} />
        ))}
      </ul>
    </>
  );
};

export default Page;
