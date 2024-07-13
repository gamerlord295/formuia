"use client"
import { useEffect, useRef, useState } from "react";

import useAuth from "@/app/_hooks/useAuth";
import useSet from "@/app/_hooks/useSet";
import { db } from "@/app/_utils/firebase";

import { MyInput } from "@/app/_css/customVariants";
import Image from "next/image";
import Send from "@/public/send";
import trash from "@/public/trash.svg";
import { doc, getDoc, onSnapshot, where } from "firebase/firestore";
import UserAvatar from "@/app/_components/user/avatar";
import { useRouter } from "next/navigation";
import Loader from "@/app/_components/loader";
import useFetch from "@/app/_hooks/useFetch";
import Link from "next/link";

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
            <div className="flex flex-col gap-2 justify-between items-center bg-zinc-900 py-4 px-8 h-24 cursor-pointer hover:scale-105 hover:bg-zinc-800 transition" >
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

const Page = ({ params }) => {
    const [chats, setFetch] = useFetch("chats", true)
    const [userData, loading] = useAuth(true);
    const [setChatDoc] = useSet("chats");
    const router = useRouter();

    const inputRef = useRef(null);
    const bottomRef = useRef(null);
    const [chat, setChat] = useState();
    const [data, setData] = useState();
    const [user, setUser] = useState();
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (!params.slug) return;

        const fetchChat = async () => {
            const chatRef = doc(db, "chats", params.slug);
            onSnapshot(chatRef, (doc) => {
                if (doc.exists()) {
                    setData(doc.data());
                }
            })
        }

        fetchChat();
    }, [params.slug])

    useEffect(() => {
        if (!data || !userData) return;

        
        const fetchUser = async () => {
            if (user) return;
            
            setFetch(where("uid", "array-contains", userData.uid))
            
            const userRef = doc(db, "users", data.uid.filter(id => id !== userData.uid)[0]);
            const uData = await getDoc(userRef);

            if (uData.exists()) {
                setUser(uData.data());
            }

            inputRef?.current?.focus()
        }

        fetchUser();

        setChat(data.messages);

    }, [data, userData])

    useEffect(() => {
        if (!chat) return

        // window.addEventListener("blur", () => {
        //     setBlur(prev => !prev)
        // })

        // if (lstmsg !== chat.length && blur) new Notification("Formuia", { body: chat[chat.length - 1].message })

        // setLstmsg(chat.length)

        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chat])

    const send = () => {
        if (!inputValue) return;

        const id = self.crypto.randomUUID();

        const msg = { id, message: inputValue, uid: userData.uid, time: Date.now() }

        setChatDoc(params.slug, {
            ...data,
            messages: [...chat, msg],
        });

        setInputValue("");
    }

    const deleteMsg = (id) => {
        setChatDoc(params.slug, { ...data, messages: chat.filter(msg => msg.id !== id) });
    }

    if (!data && loading) return (
        <div className="h-full w-full flex items-center justify-center">
            <Loader />
        </div>);

    return (
        <div className="grid-cols-3 2xl:grid-cols-4 grid w-full h-svh">
            <div className="w-full bg-zinc-900 hidden 2xl:flex flex-col max-h-svh">
                {/* header */}
                <div className="h-16 p-4 flex items-center border-b-1 border-zinc-700 pl-8">
                    <p>Chats</p>
                </div>

                {/* chat list */}
                <div className="flex flex-col overflow-x-hidden overflow-y-auto h-[calc(100%-64px)]">
                {chats?.filter((chat) => chat.messages.length > 0).filter((chat) => !chat.uid.some((id) => userData?.blocks?.includes(id))) .sort((a, b) => b.messages[b.messages.length - 1].time - a.messages[a.messages.length - 1].time).map((chat) => (
                    <Chat key={chat.id} chat={chat} userData={userData}/>
                ))}
                </div>
            </div>
            <div className="flex flex-col h-full justify-between col-span-3 max-h-svh overflow-auto">

                {/* header */}
                <div className="flex flex-row items-center bg-zinc-900 h-16 p-4 border-b-1 gap-4 border-zinc-700">
                    {/* backarrow */}
                    <div className="cursor-pointer" onClick={() => router.push("/chats")}>
                        <p className="text-2xl">&lt;</p>
                    </div>
                    {/* user avatar */}
                    <img className="h-10 w-10 rounded-full object-cover outline outline-1 outline-offset-2 cursor-pointer" onClick={() => router.push(`/profile/${user.uid}`)} src={user?.photoURL} />
                    {/* username */}
                    <p>{user?.username}</p>
                </div>

                {/* chat */}
                <div className="flex flex-col gap-2 overflow-y-auto p-4 mb-2 h-[calc(100svh-136px)]">
                    {/* messages */}
                    {chat?.map((message, index) => (
                        <div key={message.id} className={`flex flex-row gap-2 items-center h-fit  ${message.uid === userData.uid ? "justify-end" : "justify-start"}`}>
                            {/* user image if not current user's message */}
                            {message.uid !== userData.uid && (index === 0 || chat[index - 1]?.uid === userData.uid) &&
                                <img className="h-10 w-10 rounded-full object-cover" src={user?.photoURL} />
                            }
                            {/* if current user message, delete button */}
                            {message.uid === userData.uid && <Image src={trash} onClick={() => deleteMsg(message.id)} alt="" width={20} height={20} className="cursor-pointer" />}
                            {/* message */}
                            <div
                                className={`px-4 py-2 border-zinc-800 border-1 rounded-3xl w-fit max-w-[calc(100vw-140px)] h-fit text-warp break-words  ${message.uid === userData.uid ? `justify-end bg-zinc-950 ${chat[index - 1]?.uid === userData.uid && "rounded-tr-none -mt-1"} ${chat[index + 1]?.uid === userData.uid && "rounded-br-none"}` : `justify-start bg-[var(--primary)] ${index === 0 || chat[index - 1]?.uid !== userData.uid && "ml-12 rounded-tl-none -mt-1"} ${!!chat[index + 1] && chat[index + 1]?.uid !== userData.uid && "rounded-bl-none"}`}`}
                            >
                                {message.message}
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} className="relative -bottom-10 opacity-0"></div>
                </div>

                {/* input */}
                <div className="flex flex-row px-4 py-2 h-16">
                    <MyInput
                        color="violet"
                        variant="bordered"
                        labelPlacement="outside"
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && send()}
                    />
                    <Send onClick={send} className="cursor-pointer hover:stroke-[var(--primary)] w-10 h-10 stroke-white transition" />
                </div>
            </div>
        </div>
    )
};

export default Page;