import { Spinner } from "@nextui-org/react";

export default function Loader() {
    return <div className="h-screen w-screen flex flex-col items-center justify-center"><Spinner size="lg" color="secondary"/></div>
}
