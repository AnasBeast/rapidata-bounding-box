import { ReactNode } from "react";
import NavBar from "../NavBar";

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-col p-4">
            <NavBar />
            <main className="mt-4">
                {children}
            </main>
        </div>
    );
}

export default Layout;