"use client"
import { MyButton } from "@/app/_css/customVariants";
import { useStore } from "@/app/_hooks/useStore";
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";

const Streak = () => {
    const { streakModal, setStreakModal, userData } = useStore();

    return (
        <div>
            <Modal isOpen={streakModal} onOpenChange={setStreakModal} size="md" hideCloseButton={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody>
                                {userData?.streak &&
                                    <div className="flex flex-col gap-8 p-6 items-center">
                                        <div className="flex flex-col gap-2 items-center">
                                            <p className="text-6xl text-center text-[var(--primary)]">{userData?.streak.at(-1)?.streak}</p>
                                            <p>Days of streak!</p>
                                        </div>
                                        <MyButton color="violet" onClick={onClose} variant="outline">close</MyButton>
                                    </div>
                                }
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Streak;