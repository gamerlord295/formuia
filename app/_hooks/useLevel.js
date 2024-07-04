import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "@/app/_utils/firebase";

const db = getFirestore(app);

const userRef = collection(db, "users");
const useLevel = (userData) => {
  const updateUserLevel = async (increaseXp) => {

    if (!userData?.uid) {
      console.error("failed to get Data");
      return;
    }

    const docRef = doc(userRef, userData.uid);


    if (userData.xp && userData.requiredXp && userData.level) {
      updateStats(increaseXp, docRef);
      return;
    }

    await setDoc(docRef, {
      ...userData,
      level: 0,
      xp: 0,
      requiredXp: 5,
    }).then(() => {
      updateStats(increaseXp, docRef);
    });
  };

  const updateStats = async (increaseXp, docRef) => {
    const { level, xp, requiredXp } = userData;
    let newLevel = level? level : 0
    let newXp = (xp? xp : 0 )+ increaseXp;
    let newRequiredXp = requiredXp? requiredXp : 5
    if (newXp >= newRequiredXp) {
      newLevel += 1;
      newXp = newXp - newRequiredXp;
      newRequiredXp = 10 + (newLevel * newLevel - 1) * 5;
    } else if (newXp < 0) {
       newLevel -= 1;
       newRequiredXp = 10 + (newLevel * newLevel - 1) * 5;
       newXp = newRequiredXp + increaseXp;
    }


    await setDoc(docRef, {
      ...userData,
      level: newLevel,
      xp: newXp,
      requiredXp: newRequiredXp,
    });
  };

  return [updateUserLevel];
};

export default useLevel;
