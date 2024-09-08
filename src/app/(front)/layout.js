import Navigation from "@/components/navigation";


export default function layout({ children }) {
    return (
        <div className="w-full">
            <Navigation/>
            <div className="w-full">
                {children}
            </div>
            <div>

            </div>
        </div>

    );
}
