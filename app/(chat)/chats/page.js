"use client"
import useAuth from "@/app/_hooks/useAuth";
import useFetch from "@/app/_hooks/useFetch";

import Loader from "@/app/_components/loader";
import { where } from "firebase/firestore";
import { useEffect } from "react";
import Link from "next/link";
import NavBar from "@/app/_components/main/navbar/navbar";

const Chat = ({ chat, userData }) => {
    const [user, setFetch] = useFetch("users");

    useEffect(() => {
        if (!chat) return;

        const Uid = chat.uid.filter((id) => id !== userData.uid)[0];
        setFetch(where("uid", "==", Uid))

    }, [chat])

    if (!user) return;
    return (
        <Link href={`/chats/${chat.id}`} key={chat.id}>
            <div className="flex flex-col gap-2 justify-between items-center bg-zinc-900 py-2 px-4 rounded-lg h-24 cursor-pointer hover:shadow-[var(--primary)] shadow-custom transition" >
                <div className="flex flex-row gap-4 items-center w-full">
                    {/* user info */}
                    <img alt="user" className="h-10 w-10 rounded-full object-cover" src={user.photoURL} />
                    <h1 className="w-full">{user.username}</h1>
                </div>
                <div className="flex flex-row gap-2 font-light text-zinc-400 items-center justify-between w-full">
                    <p className="w-[calc(100%-168px)] truncate">{chat.messages[chat.messages.length - 1].message}</p>
                    <p className="w-full text-end">{new Date(chat.messages[chat.messages.length - 1].time).toLocaleString()}</p>
                </div>
            </div>
        </Link>
    )
}

const Page = () => {
    const [userData, loading] = useAuth(true);
    const [chats, setFetch] = useFetch("chats", true)

    useEffect(() => {
        if (!userData) return;

        setFetch(where("uid", "array-contains", userData.uid))
    }, [userData])


    if (loading) return <Loader />

    return (
        <>
            <NavBar />
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 m-auto max-w-6xl w-full grow justify-start px-8">
                <h1 className="text-xl">Chats</h1>
                    {chats?.length > 0&&
                        chats?.filter((chat) => chat.messages.length > 0).filter((chat) => !chat.uid.some((id) => userData?.blocks?.includes(id))) .sort((a, b) => b.messages[b.messages.length - 1].time - a.messages[a.messages.length - 1].time).map((chat) => (
                            <Chat key={chat.id} chat={chat} userData={userData} />
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Page