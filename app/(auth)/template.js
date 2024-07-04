import NavBar from "@/app/_components/main/navbar/navbar";
import Footer from "@/app/_components/main/footer";

export default function Layout({ children }) {
    return <>
        <NavBar />
        <div className="m-auto flex max-w-6xl w-full grow flex-col justify-start gap-4 px-8">
            {children}
            <Footer />
        </div></>;
}