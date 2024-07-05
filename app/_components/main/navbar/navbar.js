"use client"

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logowhite.png";
import largeLogo from "@/public/logolargeblack.png";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";

import UserDropdownMenu from "./usernavbar";

import Home from "@/public/home.js";
import Chat from "@/public/Chat";
import { useStore } from "@/app/_hooks/useStore";


function Menu({ classes }) {
  return (
    <NavbarContent className={classes}>
      <NavbarItem>
        <Link href="/">
          <Home className="w-6 h-6" />
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link href="/chats">
          <Chat className="w-7 h-7" />
        </Link>
      </NavbarItem>
    </NavbarContent>
  );
}

const NavBar = () => {
  const { userData } = useStore();

  return (
    <Navbar
      isBlurred={false}
      isBordered
      position="sticky"
      className="mb-8 flex w-full items-center gap-4 border-zinc-500 bg-zinc-950 py-3"
    // isMenuOpen={menuOpened}
      classNames={{
        wrapper: "px-4 sm:px-6"
      }}
    >
      <NavbarContent>
        {/* NavBar Items large width */}
        <Menu
          classes="md:flex"
        />
        {/* NavBar Logo */}
        <NavbarBrand>
          <Link href="/">
            <Image
              src={logo}
              className="absolute left-1/2 top-1/2 h-10 w-12 -translate-x-1/2 -translate-y-1/2 object-contain md:hidden"
              alt=""
            />
            <Image
              src={largeLogo}
              className="absolute left-1/2 top-1/2 hidden h-10 w-40 -translate-x-1/2 -translate-y-1/2 object-contain invert md:block"
              alt=""
            />
          </Link>
        </NavbarBrand>
        {/* NavBar User */}
        {userData ?
          (
            <UserDropdownMenu />
          ) : (
            <Link href="/login">
              <Button
                variant="ghost"
                className="bg-transparent"
                color="secondary"
              >
                Login
              </Button>
            </Link>
          )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavBar;
