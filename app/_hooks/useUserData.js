/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { collection, doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import useSet from "./useSet"
import { useState } from "react";
import { app } from "../_utils/firebase";
import { useStore } from "./useStore";

const db = getFirestore();
const userRef = collection(db, "users");

const useUserData = (create) => {
    const [setDoc] = useSet("users");
    const [data, setData] = useState();

    const { setStreakModal } = useStore();

    const fetch = async (uid, user) => {
        const docRef = doc(userRef, uid);
        const data = await getDoc(docRef);

        if (data.exists() && data.data().username)
        {
            onSnapshot(docRef, (item) => {
                setData(item.data())
            })
        }
        else if(create)
        {
            setDoc(user.uid, {
                username: user.displayName,
                photoURL: user.photoURL,
                uid: user.uid,
                level: 0,
                xp: 0,
                requiredXp: 5,
                followers: [],
                following: [],
                likes: [],
                streak: [{time: Date.now(), streak: 1}],
            })
            const func = async () => {
                const data = await getDoc(docRef);
                setData(data.data())
            };
            func()
            setStreakModal(true)
        }
    }
    return [data, fetch]
}

export default useUserData;
