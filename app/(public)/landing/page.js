"use client";

import Link from "next/link";
import post from "@/public/post.png";
import ency from "@/public/ency.png"
import Image from "next/image";

const Content = ({ h1, children }) => {
  return (
    <div className="mx-auto mb-32 flex h-96 w-full flex-auto flex-row flex-wrap">
      <h1 className="text-lg">{h1}</h1>
      {children}
    </div>
  );
};

const Section = ({ classes, children }) => {
  return <div className={"mt-44 flex gap-4 " + classes}>{children}</div>;
};

const Page = () => {
  return (
    <>
      <div className="flex items-center"></div>
      <div className="mt-44 flex-col content-center px-10">
        <div className="mb-44 flex justify-center">
          <h1 className="font-mono text-xl">Welcome to Formuia</h1>
        </div>
        <Section classes="sm:flex-row flex-col">
          <div className="flex w-full flex-col items-center sm:w-1/2 sm:items-start">
            <h1 className="mb-4 text-2xl font-bold">Social media</h1>
            <p>
              Welcome to Formuia - where your voice finds it&apos;s
              freedom. Express yourself without limits, Share your thoughts.
              #SpeakFreely
            </p>
          </div>
          <div className="mt-4 flex w-full flex-col items-center justify-start border-t pt-4 sm:mt-0 sm:w-1/2 sm:border-l sm:border-t-0 sm:pt-0">
            <h1 className="mb-4 text-2xl font-extrabold">Sign Up now</h1>
            <Link href="./login">
              <div className="purple-btn text-xl font-bold">Click here!</div>
            </Link>
          </div>
        </Section>
        <Section classes="flex-col p-4 items-center">
          {/* <h1 className="text-2xl">Features</h1> */}
          <div className="mt-4 flex w-full max-w-3xl flex-row flex-wrap gap-4">
            <div className="mx-auto mb-32 flex h-96 w-full flex-auto flex-row flex-wrap items-center justify-center">
              <div className="max-w-xs">
                <h1 className="text-lg">Share Posts</h1>
                <p>
                  You can share whatever you want in{" "}
                  <Link
                    href="/"
                    className="underline underline-offset-4 hover:text-violet-600"
                  >
                    feed
                  </Link>
                  , but no NSFW/Nudes.
                </p>
              </div>
              <Image
                src={post}
                className="mx-auto mt-12 h-auto w-72 max-w-lg"
                alt
              />
            </div>
            <div className="mx-auto flex h-96 w-full flex-auto flex-row flex-wrap-reverse items-center justify-center">
              <Image
                src={ency}
                className="mx-auto mt-12 h-auto w-72 max-w-lg invert object-fill"
                alt
              />
              <div className="max-w-xs">
                <h1 className="text-lg">Feel Safe</h1>
                <p className="max-w-xs">
                  Your data is encrypted in our Storage, nothing can be stolen.
                </p>
              </div>
            </div>
            {/* <Content h1="3. Everything free">
              <p>Yes you heard right, you wont pay not even a cent!</p>
            </Content>
            <Content h1="4. Profile customization">
              <p>Change your nickname / picture anytime anywhere!</p>
            </Content>
            <Content h1="5. Leveling system">
              <p>Earn xp by just sharing posts!</p>
            </Content>
            <Content h1="6. Android app">
              <p>Yes! Android app that&apos;s right, Also for FREE!</p>
            </Content> */}
          </div>
        </Section>
        <Section classes="flex-col">
          <h1 className="text-2xl font-bold">About</h1>
          <p>
            My goal from this platform is gaining experience and creating app
            for web and android devices
          </p>
          <p>Made by: GamerLord</p>
        </Section>
      </div>
    </>
  );
};

export default Page;
