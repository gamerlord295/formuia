/* eslint-disable @next/next/no-img-element */
"use client";

import {
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

import Heart from "@/public/Heart";
import NextImage from "next/image";
import Link from "next/link";
import UserAvatar from "../user/avatar";
import comment from "@/public/comment.svg";
import dots from "@/public/3dots.svg";
import useSet from "@/app/_hooks/useSet";
import { useRouter } from "next/navigation";
import useLevel from "../../_hooks/useLevel";
import { Modal, ModalContent, useDisclosure, Image, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, ModalBody, ModalHeader, Skeleton } from "@nextui-org/react";

const db = getFirestore();

const Img = ({ item, index, className, title, parentKey, setIsLoaded }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <div className="w-full relative shrink-0" id={parentKey + index}>
        <Image
          onLoad={() => index === 0 && setIsLoaded(true)}
          classNames={{ wrapper: "min-w-full h-full" }}
          key={item}
          radius="md"
          className={`relative w-full h-auto snap-center max-h-[60vh] object-cover cursor-pointer ${className}`}
          src={item}
          alt=""
          loading="lazy"
          disableSkeleton="false"
          onClick={onOpen}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        className="w-auto h-fit"
        size="5xl"
        placement="center"
        aria-label="image"
      >
        <ModalContent>
          <ModalHeader className="text-medium">
            {title}
          </ModalHeader>
          <ModalBody className="w-full h-full p-0">
            <Image
              src={item}
              alt=""
              width="100%"
              className="h-full w-auto max-h-[85vh] object-contain"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const ImgGroup = ({ data, title, parentKey }) => {

  const [id, setId] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full">
      <Skeleton className="w-full h-full rounded-md" isLoaded={isLoaded}>
        <div className="w-full flex flex-row overflow-y-hidden no-scroll scroll-smooth snap-mandatory snap-x relative items-center">
          {data?.map((src, index) =>
            <Img
              setIsLoaded={setIsLoaded}
              parentKey={parentKey}
              index={index}
              item={src}
              key={src}
              title={title}
            />)}
        </div>
      </Skeleton>
      {data?.length > 1 && isLoaded &&
        <>
          <button onClick={() => {
            document.getElementById(id === 0 ? `${parentKey}${data.length - 1}` : parentKey + (id - 1))?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
            setId(id === 0 ? data.length - 1 : id - 1)
          }}
            className="absolute left-0 top-1/2 z-20 bg-[var(--primary)] w-6 h-6 rounded-full shadow-none hover:shadow-[var(--primary)] hover:-translate-y-1 hover:shadow-md transition-all"
          >
            {`<`}
          </button>
          <button
            onClick={() => {
              document.getElementById(id === data.length - 1 ? `${parentKey}0` : parentKey + (id + 1))?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
              setId(id === data.length - 1 ? 0 : id + 1)
            }}
            className="absolute right-0 top-1/2 z-20 bg-[var(--primary)] w-6 h-6 rounded-full shadow-none hover:shadow-[var(--primary)] hover:-translate-y-1 hover:shadow-md transition-all"
          >
            {`>`}
          </button>
        </>
      }
    </div>
  )
}

const Menu = ({ id }) => {

  const delDoc = () => {
    const docRef = doc(db, "posts", id);
    deleteDoc(docRef);
  };

  return (
    <div className="relative">
      <Dropdown>
        <DropdownTrigger>
          <NextImage
            alt=""
            src={dots}
            width={18}
            className="cursor-pointer"
          />
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>
            <p className="cursor-pointer text-red-600" onClick={delDoc}>
              delete
            </p>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

const Btn = ({ svg, data, children, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className="flex h-fit w-fit cursor-pointer flex-row gap-2"
    >
      {children}
      {svg && <NextImage alt="" width={24} src={svg} className={className} />}
      <p>{data}</p>
    </div>
  );
};

const Post = ({ data, userData }) => {
  return (
    <div className="flex flex-col gap-4">
      {Array.isArray(data) && data?.map((doc) => (
        <PostComp key={doc.id} data={doc} userData={userData} />
      ))}
    </div>
  );
};

const PostComp = ({ data, userData }) => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [setData] = useSet("users");
  const [updateXp] = useLevel(user);

  useEffect(() => {
    if (data.uid) {
      const docRef = doc(db, "users", `${data.uid}`);
      const fetchData = () => {
        onSnapshot(docRef, (item) => {
          setUser(item.data());
        });
      };

      fetchData();
    }
  }, [data]);

  const liked = async (id, num, likes) => {
    const docRef = doc(db, "posts", id);
    if (!userData) return;

    if (likes.every((uid) => uid !== userData.uid)) {
      const userLikes = userData.likes;
      userLikes.push(id);

      setData(userData.uid, { ...userData, likes: userLikes });
      num = num + 1;
      likes.push(userData.uid);

      await updateDoc(docRef, {
        likes: num,
        liked: likes,
      });
      if (userData.uid !== data.uid) {
        updateXp(5);
      }
    } else if (likes.some((uid) => uid == userData.uid)) {
      const userLikes = userData.likes.filter((like) => like !== id);
      setData(userData.uid, { ...userData, likes: userLikes });

      num = num - 1;
      likes = likes.filter((item) => item !== userData.uid);

      await updateDoc(docRef, {
        likes: num,
        liked: likes,
      });
      if (userData.uid !== data.uid) {
        updateXp(-5);
      }
    }
  };

  if (!user) return;

  return (
    <div className="rounded-xl border-2 p-4" key={data.id}>

      {/* user data */}
      <div className="mb-4 flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row items-center gap-2">
          <UserAvatar user={user} userData={userData} />
          <h1>{user.username}</h1>
        </div>
        {userData && data.uid === userData.uid && <Menu id={data.id} />}
      </div>

      {/* title */}
      <h1 className="mb-3 text-lg">{data.title}</h1>

      {/* description */}
      <p className="text-sm font-light text-neutral-200">{data.description}</p>

      {/* images */}
      <div className="mb-4 flex flex-row flex-wrap items-center justify-around relative gap-10">
        {data.src && Array.isArray(data.src) &&
          <>
            <ImgGroup data={data.src} title={data.title} parentKey={data.id} />
          </>
        }
      </div>

      {/* like and comment */}
      <div className="flex flex-row gap-4">
        <Btn
          data={data.likes}
          onClick={
            userData
              ? () => liked(data.id, data.likes, data.liked)
              : () => router.push("/login")
          }
        >
          <Heart
            className="h-6 w-6"
            fill={
              data.liked.every((like) => like !== userData?.uid) || !userData
                ? "transparent"
                : "red"
            }
            stroke={
              data.liked.every((like) => like !== userData?.uid) || !userData
                ? "white"
                : "red"
            }
          />
        </Btn>
        <Link href={`/${data.id}`}>
          <Btn data={data.comments.length + data.comments?.reduce((acc, item) => acc + item.replys?.length, 0) || data.comments.length} svg={comment} />
        </Link>
      </div>
    </div>
  );
};

export default Post;
