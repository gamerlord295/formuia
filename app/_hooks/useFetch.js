/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { collection, getFirestore, onSnapshot, query } from 'firebase/firestore';
import { app } from '../_utils/firebase';

const db = getFirestore(app)

const useFetch = (collectionName, asArray = false) => {
    const [data, setData] = useState();
    const ref = collection(db, collectionName);

    const setFetch = (...filters) => {
        const q = query(ref, ...filters)
        let array = [];
        onSnapshot(q, (item) => {
            item.docs.forEach((doc) => {
                array.push({ ...doc.data(), id: doc.id });
            });

            if (array.length === 1 && !asArray) setData(array[0]);
            else if (array.length > 1 || asArray && array.length > 0) setData([...array]);
            else setData(null);
            array = [];
        })
    }

    return [data, setFetch]
}

export default useFetch;
