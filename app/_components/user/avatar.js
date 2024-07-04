/* eslint-disable @next/next/no-img-element */
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";

import { useRouter } from "next/navigation";
import useBlock from "@/app/_hooks/useBlock";

import { app } from "@/app/_utils/firebase";

import Chat from "@/public/Chat";
import block from "@/public/block.svg";
import Copy from "@/public/copy.js";

import Image from "next/image";
import useSet from "@/app/_hooks/useSet";

const db = getFirestore(app);

const UserAvatar = ({ user, userData }) => {
  const router = useRouter();
  const [blockUser] = useBlock(userData ? userData : null);
  const [createChat] = useSet("chats")

  const follow = async () => {
    const docRef = doc(db, "users", userData.uid);
    const userRef = doc(db, "users", user.uid);
    let data;
    if (userData.following.every((id) => id !== user.uid)) {
      data = await getDoc(userRef);
      const following = [...userData.following, user.uid];
      const followers = [...data.data().followers, userData.uid];
      console.log("1");
      updateDoc(docRef, { following });
      updateDoc(userRef, { followers });
    } else {
      data = await getDoc(userRef);
      const following = userData.following.filter((id) => id !== user.uid);
      const followers = data
        .data()
        .following.filter((id) => id !== userData.uid);
      console.log("2");
      updateDoc(docRef, { following });
      updateDoc(userRef, { followers });
    }
  };

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
    <Dropdown>
      <DropdownTrigger>
        <Avatar
          src={user.photoURL}
          className="h-8 w-8 cursor-pointer outline outline-2 outline-offset-2"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Action event" disabledKeys={[""]}>
        <DropdownItem
          key="profile"
          onClick={() => router.push(`/profile/${user.uid}`)}
          startContent={
            <Avatar src={user.photoURL} className="bg-transparent" />
          }
          textValue="Profile"
        >
          {user.username}
          <br />
          <span className="text-xs text-gray-400">Level {user.level || 0}</span>

        </DropdownItem>

        {userData?.uid !== user.uid ? (
          <DropdownItem
            key="follow"
            onClick={userData ? () => follow() : () => router.push("/login")}
            startContent={
              <img
                src={
                  userData?.following.some((id) => id === user.uid)
                    ? "https://cdn-icons-png.flaticon.com/512/3683/3683211.png"
                    : "https://cdn-icons-png.flaticon.com/512/3683/3683218.png"
                }
                alt=""
                className="w-6 invert"
              />
            }
          >
            {userData?.following.some((id) => id === user.uid)
              ? "Unfollow"
              : "follow"}
          </DropdownItem>
        ) : null}

        {userData?.uid !== user.uid && (
          <DropdownItem key="chat" startContent={<Chat className="w-6" />} onClick={() => addChat(user.uid)}>
            Chat
          </DropdownItem>
        )}

        <DropdownItem key="copyUid" startContent={<Copy className="w-6 h-6" />} onClick={() => navigator.clipboard.writeText(user.uid)} >
          Copy UID
        </DropdownItem>

        {userData?.uid !== user.uid && (
          <DropdownItem
            key="block"
            startContent={<Image src={block} width={24} alt="block" />}
            textValue="block"
            color="danger"
            className="text-danger"
            onClick={() => blockUser(user)}
          >
            {userData?.blocks?.some((id) => id === user.uid) ? "Unblock" : "Block"}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserAvatar;
