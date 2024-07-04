import { collection, doc, getFirestore, setDoc } from "firebase/firestore";

import { app } from "../_utils/firebase"

const db = getFirestore();

const useSet = (ref) => {
    const colRef = collection(db, ref)
    const setData = (docId, data) => {
        setDoc(doc(colRef, docId), {
            ...data
        })
    }
    return [setData];
}

export default useSet;