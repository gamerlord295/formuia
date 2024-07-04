import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function checkAuth() {
    const auth = getAuth();

}