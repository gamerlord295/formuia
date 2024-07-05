import NavBar from "@/app/_components/main/navbar/navbar";
import Footer from "@/app/_components/main/footer";

export default function Layout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center">
            <NavBar />
            <div className="m-auto flex max-w-6xl w-full grow flex-col justify-start gap-4 px-8">
                {children}
            </div>
            <Footer />
        </div>
    );
}