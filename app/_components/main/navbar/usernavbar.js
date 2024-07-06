"use client";
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/_hooks/useStore";
import Streak from "@/public/streak.js";

import {
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Divider,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";

import { app } from "@/app/_utils/firebase";

const auth = getAuth(app);

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]

const UserDropdownMenu = () => {
    const { userData } = useStore();
    const router = useRouter();

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isStreakMenuOpen, setIsStreakMenuOpen] = useState(false);

    const logOut = () => {
        signOut(auth)
            .catch((err) => console.error(err.message));
    };

    const changeRoute = (route) => {
        setIsUserMenuOpen(false)
        router.push(route)
    }

    return (
        <div className="flex flex-row sm:gap-4 gap-3 items-center bg-zinc-900 py-2 px-3 h-14 rounded-2xl">
            <Popover>
                <PopoverTrigger>
                    <div className="flex gap-2 items-center hover:bg-zinc-800 h-full sm:px-2 rounded-xl cursor-pointer">
                        <Streak className="w-7 h-7" />
                        {userData?.streak?.at(-1)?.streak}
                    </div>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="flex flex-col items-center px-4 py-6">
                        <h1 className="text-5xl text-violet-600">{userData?.streak?.at(-1)?.streak}</h1>
                        <h3 className="text-md">Of Streak!</h3>
                        <Divider orientation="horizontal" className="w-full mt-6 mb-6" />
                        <div className="w-full flex flex-row items-center justify-center gap-4">
                            {days.map((day, index) => (
                                <div key={day} className="flex flex-col items-center gap-2">
                                    <Streak className={`w-fit h-7 ${index <= new Date().getDay() ? index === new Date(userData?.streak?.at(index - new Date().getDay() - 1)?.time).getDay() ? "stroke-violet-600" : "stroke-zinc-700" : "stroke-zinc-300"}`} />
                                    <p>{day.slice(0, 3)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            <Divider orientation="vertical" className="h-7" />
            <Dropdown>
                <DropdownTrigger onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                    <Avatar className="bg-transparent h-9 w-9 hover:cursor-pointer hover:opacity-80 outline-2 outline-white outline-offset-2" src={userData.photoURL} />
                </DropdownTrigger>
                <DropdownMenu isOpened={isUserMenuOpen} disabledKeys={[""]} aria-label="user">
                    <DropdownItem key="profile" onClick={() => changeRoute("/profile")}>Profile</DropdownItem>
                    <DropdownItem key="settings" onClick={() => changeRoute("/settings")}>Settings</DropdownItem>
                    <DropdownItem key="logout" onClick={() => logOut()} color="danger">Logout</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

export default UserDropdownMenu;