import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/app/_utils/firebase";

export async function GET() {
  const q = query(collection(db, "posts"), orderBy("CreatedAt", "desc"));
  const postsSnap = await getDocs(q);
  const posts = [];

  postsSnap.forEach((doc) => {
    posts.push({ ...doc.data(), id: doc.id });
  });

  return new Response(JSON.stringify(posts), { status: 200 });
}
