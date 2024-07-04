/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import image from "@/public/image.svg";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { app, storage } from "@/app/_utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MyInput, MyTextarea, MyButton } from "@/app/_css/customVariants";
import { useStore } from "@/app/_hooks/useStore";

const db = getFirestore(app);
const colRef = collection(db, "posts");

export default function PostForm() {
  const [img, setImg] = useState([]);
  const [url, setUrl] = useState([]);
  const { userData } = useStore()
  const [buttonValues, setButtonValues] = useState({
    value: "Submit",
    isDisabled: false,
    isLoading: false,
  });

  const updateImage = ({ target: { files } }) => {
    const [file] = files || [];
    if (!file) return;
    const objectURL = URL.createObjectURL(file);
    setImg((prev) => [...prev, file]);
    setUrl((prev) => [...prev, objectURL]);
    files = null;
  };

  const addData = (e) => {
    e.preventDefault();
    const { target } = e;
    setButtonValues({ ...buttonValues, isLoading: true, value: "Loading" });
    const arr = [];
    let itemsDone = 0;
    const title = target.title.value;
    const description = target.des.value;


    img.forEach(async (currentImg, index, array) => {
      const imgRef = ref(storage, `posts/${self.crypto.randomUUID()}`);
      await uploadBytes(imgRef, currentImg).then(async () => {
        const imgUrl = await getDownloadURL(imgRef);
        arr.push(imgUrl);
        itemsDone++;
        if (itemsDone === array.length) {
          addDoc(colRef, {
            title,
            description,
            src: arr || null,
            uid: userData.uid,
            likes: 0,
            liked: [],
            comments: [],
            CreatedAt: new Date(),
          });
        }
      });
    });


    target.reset();
    setImg([]);
    setUrl([]);
    setButtonValues({ ...buttonValues, isLoading: false, value: "Submit" });
  };

  return (
    <>
      <form
        onSubmit={(e) => addData(e)}
        className="mt-4 flex flex-col gap-4 border-b border-b-zinc-500 pb-4"
      >
        <h1 className="text-2xl">Share a post</h1>
        <Field title="Title">
          <MyInput
            isRequired={true}
            type="text"
            color="violet"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Post title"
            id="title"
            name="title"
          />
        </Field>
        <Field title="description">
          <MyTextarea
            color="violet"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Post description"
            id="description"
            name="des"
          />
        </Field>
        <div className="flex justify-between">
          <div className="flex flex-col items-start gap-0">
            <MyButton
              className="purple-btn flex flex-row"
              onClick={() => document.getElementById("fileSelctor").click()}
              color="violet"
              startContent={
                <Image
                  width={26}
                  className="mr-2"
                  src={image}
                  alt="select image"
                />
              }
            >
              <input
                className="hidden"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                name="img"
                id="fileSelctor"
                onChange={(e) => updateImage(e)}
              />
              Add Image
            </MyButton>
            <div className="flex flex-row gap-4">
              {url?.map((item) => (
                <div
                  key={item}
                  className="relative"
                  onClick={() => {
                    const index = url.indexOf(item);
                    let urlArr = [...url];
                    let imgsArr = [...img];
                    urlArr.splice(index, 1);
                    imgsArr.splice(index, 1);
                    setUrl(urlArr);
                    setImg(imgsArr);
                  }}
                >
                  <img src={item} className="h-16 w-16 object-cover" alt="" />
                  <p className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-slate-700 text-center font-bold opacity-50 hover:opacity-80">
                    X
                  </p>
                </div>
              ))}
            </div>
          </div>
          <MyButton
            isLoading={buttonValues.isLoading}
            name="submit"
            type="submit"
            color="violet"
          >
            {buttonValues.value}
          </MyButton>
        </div>
      </form>
    </>
  );
}

const Field = ({ children, title }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={title} className="text-lg">
        {title}
      </label>
      {children}
    </div>
  );
};
