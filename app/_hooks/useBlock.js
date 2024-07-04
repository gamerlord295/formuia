import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../_utils/firebase";
import useUserData from "./useUserData";
import { useRouter } from "next/navigation";

const db = getFirestore(app);

const useBlock = (userData) => {
    const router = useRouter();

    /**
     * Toggles the block status of a user.
     * 
     * @param {object} user - The user to block or unblock.
     * @returns {Promise<void>}
     */

    const block = async (user) => {
        // Check if there is valid user data and a user to block.
        if (!userData) {
            router.push("/login");
            return
        };
        if (!user) return;

        // Get the document references.
        const docRef = doc(db, "users", userData.uid);
        const userRef = doc(db, "users", user.uid);

        // Define the blocks.
        let blocks = userData.blocks || [];
        let userBlocks = user.blocked || [];

        // If the user has not blocked this user, add them to block.
        if (userData.blocks?.every((uid) => uid !== user.uid)) {
            blocks.push(user.uid);
            userBlocks.push(userData.uid);

        // If the user is already blocked, unblock them.
        } else if (userData.blocks?.some((uid) => uid === user.uid)) {
            blocks = blocks.filter((uid) => uid !== user.uid);
            userBlocks = userBlocks.filter((uid) => uid !== userData.uid);

        // If not any case, return early.
        } else {
            return;
        }

        // Remove the user from the followers and following of the user to block.
        const followers = userData?.followers?.filter((follower) => follower !== user.uid) || [];
        const following = userData?.following?.filter((follower) => follower !== user.uid) || [];
        const userFollowers = user?.followers?.filter((follower) => follower !== userData.uid) || [];
        const userFollowing = user?.following?.filter((follower) => follower !== userData.uid) || [];

        try {
            // Update the documents.
            await updateDoc(docRef, { ...userData, blocks, followers, following });
            await updateDoc(userRef, { ...user, blocked: userBlocks, followers: userFollowers, following: userFollowing });
        } catch (error) {
            console.error("Error blocking user", error);
        }
    }

    return [block];
}


export default useBlock;