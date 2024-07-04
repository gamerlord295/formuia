import { MyInput, MyButton } from "@/app/_css/customVariants";
import { useStore } from "@/app/_hooks/useStore";
import { useEffect, useState } from "react";
import useSet from "@/app/_hooks/useSet";
import { storage } from "@/app/_utils/firebase";
import { getAuth, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const auth = getAuth();

export default function Account() {
  const [pfp, setPfp] = useState({ pfp: null, url: null });
  const [fields, setFields] = useState({
    username: null,
    description: null,
    edit: false
  });
  const [setData] = useSet("users");
  const { userData } = useStore();

  useEffect(() => {
    if (userData) {
      setFields({
        username: userData?.username,
        description: userData?.description,
      });
    }
  }, [userData]);

  const changePfp = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setPfp({ pfp: img, url: URL.createObjectURL(img) });
    }
  };

  const uploadPfp = async () => {
    // sets edit true
    setFields(prev => ({ ...prev, edit: true }));

    // declares imgUrl variable for later
    let imgUrl;

    // checks if pfp changed and uploads it
    if (pfp.pfp) {
      let imgRef = ref(storage, `pfps/${userData.uid}pfp`);

      try {
        await uploadBytes(imgRef, pfp.pfp)
        
        imgUrl = await getDownloadURL(imgRef);
      }
      catch (error) {
        console.log("faild to upload profile picture: ", error);
      }
    };

    // updates profile
    try {
      await updateProfile(auth.currentUser, {
        photoURL: imgUrl || userData.photoURL,
        displayName: fields.username || userData.username,
      });
    }
    catch (error) {
      console.log("faild to update profile: ", error);
    }
      
    // updates user data
    try {
    setData(userData.uid, {
      ...userData,
      photoURL: imgUrl || userData.photoURL,
      username: fields.username || userData.username,
      description: fields.description || userData.description || "",
    });
    }
    catch (error) {
      console.log("faild to update user data: ", error);
    }
    // resets pfp and fields
    setPfp({ pfp: null, url: null });
    setFields({ username: null, description: null, edit: false });
  };
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex w-full flex-col gap-6">
        <label className="text-xl">Profile</label>
        <div className="children-border flex flex-col">
          <div className="flex w-full items-center justify-center pb-6">
            <label className="relative h-fit w-fit rounded-full">
              <input
                value=""
                id="upload"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                className="hidden"
                onChange={(e) => changePfp(e)}
              />
              <img
                className="h-32 w-32 rounded-full object-cover"
                alt=""
                src={pfp.url ? pfp.url : userData?.photoURL}
              />
              <div className="absolute top-0 hidden h-32 cursor-pointer items-center justify-center rounded-full bg-white opacity-0 invert hover:opacity-60 sm:flex">
                <img
                  src="https://www.svgrepo.com/show/304506/edit-pen.svg"
                  className="h-16 w-32 opacity-100"
                />
              </div>
              <div className="absolute top-0 flex h-32 w-32 cursor-pointer items-end justify-end sm:hidden">
                <img
                  className="h-8 w-8 rounded-full border-4 border-white bg-lime-500 invert"
                  src="https://www.svgrepo.com/show/304506/edit-pen.svg"
                />
              </div>
            </label>
          </div>
          <div className="flex flex-col gap-4 pb-4 pt-6">
            <label>Username</label>
            <MyInput
              color="violet"
              variant="bordered"
              placeholder="username"
              label=""
              labelPlacement="outside"
              onChange={(e) =>
                setFields({ ...fields, username: e.target.value })
              }
            />
            <label>Description</label>
            <MyInput
              color="violet"
              variant="bordered"
              placeholder="description"
              label=""
              labelPlacement="outside"
              onChange={(e) =>
                setFields({ ...fields, description: e.target.value })
              }
            />
          </div>
          {((!!pfp.url && pfp.url !== userData?.photoURL) ||
            (!!fields.description &&
              fields.description !== userData?.description) ||
            (!!fields.username && fields.username !== userData?.username)) && (
              <div className="mt-4 flex items-center justify-end">
                <MyButton onClick={uploadPfp} isLoading={fields.edit}>Save</MyButton>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
