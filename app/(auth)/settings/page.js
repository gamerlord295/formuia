"use client";
import useAuth from "@/app/_hooks/useAuth";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useState } from "react";
import Account from "@/app/(auth)/settings/account";
import Blocks from "@/app/(auth)/settings/blocks";

export default function Page() {
  const [userData, loading] = useAuth(true);
  const [comp, setComp] = useState("account");

  return (
    <div className="flex gap-8 flex-col md:flex-row">
      <div className="relative md:w-80 w-full rounded-xl border p-3 h-fit">
        <Listbox aria-label="tabs" className="flex flex-col gap-3">
          <ListboxItem
            key="account"
            className={`transition-all ${
              comp === "account" && "bg-white text-black"
            }`}
            onClick={() => setComp("account")}
          >
            Account
          </ListboxItem>
          <ListboxItem
            key="blocks"
            className={`transition-all ${
              comp === "blocks" && "bg-white text-black"
            }`}
            onClick={() => setComp("blocks")}
          >
            Block list
          </ListboxItem>
        </Listbox>
      </div>
      {comp === "account" && <Account />}
      {comp === "blocks" && <Blocks />}
    </div>
  );
}
