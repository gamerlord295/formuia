/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import Input from "@/app/_components/input";

const auth = getAuth();

export default function Page() {
  const [form, setform] = useState("Login");
  const [rstPassowrd, setRstPassword] = useState(false);
  const [button1, setButton1] = useState("bg-violet-600");
  const [button2, setButton2] = useState("");
  const [errorDis, setErrorDis] = useState("");

  const router = useRouter();
  const submit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    if (form === "Sign up") {
      const confirmPassword = e.target.cPassword.value;
      if (password !== confirmPassword) {
        setErrorDis("Passwords do not match");
        return;
      }
      const username = e.target.username.value;
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          return updateProfile(auth.currentUser, {
            displayName: username,
            photoURL:
              "https://icon-library.com/images/no-profile-picture-icon/no-profile-picture-icon-15.jpg",
          });
        })
        .catch((err) => {
          setErrorDis(err.message);
        });
    }
    else if (form === "Login") {
      signInWithEmailAndPassword(auth, email, password).catch((err) => {
        setErrorDis(err.message);
      });
    }
    else {
      sendPasswordResetEmail(auth, email).catch((err) => {
        setErrorDis(err.message);
      })
    }
  };

  const swap = (id) => {
    if (id === 1) {
      setButton1("bg-violet-600");
      setButton2("");
      setform("Login");
      setErrorDis("");
    } else {
      setButton1("");
      setButton2("bg-violet-600");
      setform("Sign up");
      setErrorDis("");
    }
  };

  const checkAuth = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/profile");
      }
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <div className="h-full-header flex flex-col items-center justify-center gap-4">
      <label className="text-center text-3xl font-bold">Login</label>
        <div className={`flex h-11 w-80 items-center justify-center gap-4 rounded-xl border border-gray-400 px-1 ${rstPassowrd? "hide-top" : "show"}`}>
          <div className={"relative h-8  w-1/2 rounded-lg " + button1}>
            <input
              defaultChecked
              onChange={() => swap(1)}
              className="relative z-10 h-full w-full cursor-pointer opacity-0"
              type="radio"
              name="loginForm"
            />
            <label className="absolute left-1/2 top-1/2 h-fit w-full -translate-x-1/2 -translate-y-1/2 text-center">
              Login
            </label>
          </div>
          <div className={"relative h-8  w-1/2 rounded-lg " + button2}>
            <input
              onChange={() => swap(2)}
              className="relative z-10 h-full w-full cursor-pointer opacity-0"
              type="radio"
              name="loginForm"
            />
            <label className="absolute left-1/2 top-1/2 h-fit w-full -translate-x-1/2 -translate-y-1/2 text-center">
              Sign Up
            </label>
          </div>
        </div>
      <form className="flex w-80 flex-col gap-4" onSubmit={(e) => submit(e)}>
        <Input
          type="text"
          name="username"
          minLength="3"
          className={`${form === "Sign up" ? "fade-in" : "fade-out"}`}
          placeholder="username"
          required={form === "Sign up"}
        />
        <Input type="email" className="" name="email" placeholder="E-Mail" />
        <Input
          type="password"
          name="password"
          className={`${form === "Sign up" || form === "Login" ? "fade-in" : "fade-out"}`}
          required={form === "Sign up" || form === "Login"}
          placeholder="Password"
        />
        <Input
          type="password"
          name="cPassword"
          placeholder="Confirm Password"
          className={`${form === "Sign up" ? "fade-in" : "fade-out"}`}
          required={form === "Sign up"}
        />
        <input className="login-btn" type="submit" value={form} />
        <button type="button" onClick={() => {
          if(!rstPassowrd) {
            setform("Send reset")
            setRstPassword(true)
          } else {
            setRstPassword(false)
            setform("Login")
            swap(1)
          }
          }}>{!rstPassowrd ?"Forgot password?" : "Login"}</button>
      </form>
      {errorDis && <p className="w-80 text-rose-800">{errorDis}</p>}
    </div>
  );
}
