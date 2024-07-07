/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation";
import { app, db } from "../_utils/firebase"
import useUserData from "./useUserData"
import { useEffect, useState } from "react";

import { useStore } from "./useStore";
import { doc, updateDoc } from "firebase/firestore";
import useLevel from "./useLevel";

const auth = getAuth(app);

const useAuth = (protect) => {
    const router = useRouter()
    const [userData, setFetch] = useUserData(true)
    const [loading, setLoading] = useState(true)
    const [updateXp] = useLevel(userData);

    const { setUserData, setStreakModal } = useStore();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await setFetch(user.uid, user)
            }
            else if (!user && protect) {
                router.push('/login');
            }
            else {
                setUserData(null)
            }
            setLoading(false);
        })
    }, [])

    useEffect(() => {
        setUserData(userData);

        if (!userData) return;

        // if(new Date(userData.streak?.at(-1).time).toLocaleDateString() === new Date().toLocaleDateString()) return;

        if (!userData.streak) userData.streak = [];

        const streak = userData.streak?.at(-1) || null

        const updateStreak = (streak) => {
            setStreakModal(streak);
            streak % 7 === 0 ? updateXp(20) : null;
            updateDoc(doc(db, "users", userData.uid), {
                streak: [...userData.streak, { time: Date.now(), streak }]
            })
        }

        const getStreak = () => {
            if (!streak) return;
            else if (streak.time <= Date.now() - 1000 * 60 * 60 * 24) {
                updateStreak(streak.streak + 1)
            }
            else if ((new Date(streak.time).getDay() < new Date().getDay() || (new Date(streak.time).getDay() === 6 && new Date().getDay() === 0)) && streak.time >= Date.now() - 1000 * 60 * 60 * 24 * 2) {
                
                updateStreak(streak.streak + 1)
            }
            else if (streak.time >= Date.now() - 1000 * 60 * 60 * 24) {
                return
            }
            else {
                updateStreak(1)
                return
            }
        }

        getStreak();

    }, [userData])

    return [userData, loading];
}

export default useAuth;