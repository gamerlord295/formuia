"use client"
import useFetch from "@/app/_hooks/useFetch"
import { doc, updateDoc, where } from "firebase/firestore"
import { useEffect } from "react"
import UserAvatar from "../user/avatar"
import { useStore } from "@/app/_hooks/useStore"
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import { db } from "@/app/_utils/firebase"

import Menu from "@/public/menu.js"
import Reply from "@/public/reply"
import useLevel from "@/app/_hooks/useLevel"

const Comment = ({ data, slug, comments, setActiveComment, parentId, parentData }) => {
    const [user, fetchUser] = useFetch("users", false)
    const [updateXp] = useLevel(user);

    const { userData } = useStore()

    useEffect(() => {
        if (!data?.userUid) return;

        fetchUser(where("uid", "==", data.userUid))
    }, [data])

    const handleDelete = async () => {
        const docRef = doc(db, "posts", slug);
        
        let filteredComments = comments.filter((comment) => comment.id !== parentId);
        let newComments = comments.filter((comment) => comment.id === parentId)[0];
        
        if (parentId !== data.id)
        {
            const filteredReplys = newComments.replys.filter(reply => reply.id !== data.id)
            newComments = { ...newComments, replys: filteredReplys }
            
            filteredComments.push(newComments)
        }

        await updateDoc(docRef, { comments: [...filteredComments] });

        // if (user?.uid !== userData?.uid) {
        //     updateXp(-10);
        // }
    };

    const handleReply = async () => {

        setActiveComment({ replyTo: data.id, comment: data.comment, id: parentId });
    }

    if (!user) return;

    return (
        <div className="flex flex-col gap-4 pt-4">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2 items-center">
                    <UserAvatar user={user} userData={userData} />
                    <p>{user?.username}</p>
                </div>
                <Dropdown>
                    <DropdownTrigger>
                        <button>
                            <Menu className="cursor-pointer w-8 h-4" />
                        </button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="menu">
                        {userData?.uid === data.userUid &&
                            <DropdownItem onClick={() => handleDelete(data.id)}>
                                Delete
                            </DropdownItem>
                        }
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className="flex flex-row w-full justify-between">
                <p>{data.comment}</p>
                <Reply className="w-fit h-8 cursor-pointer" onClick={handleReply} />
            </div>
            <div className="flex flex-col pl-8 border-l-2">
                {data.replys?.filter(reply => reply.replyTo === data.id)?.map((reply) => (
                    <Comment data={reply} key={reply.id} slug={slug} comments={comments} parentData={parentData} parentId={parentId} setActiveComment={setActiveComment} />
                ))}
                {parentData.replys?.filter(reply => reply.replyTo === data.id && data.id !== parentId)?.map(reply => (
                    <Comment data={reply} key={reply.id} slug={slug} comments={comments} parentData={parentData} parentId={parentId} setActiveComment={setActiveComment} />
                ))}
            </div>
        </div>
    )
}

export default Comment