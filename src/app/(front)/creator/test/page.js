import checkAuthAndPermissions from "utils/checkIsAuthAndPermissions";
import { CanvasRevealBoxWithoutBorder } from "@/components/CanvasRevealBoxWithoutBorder";
import MaxWidthWrapper from "@/components/maxWidthWrapper";
import TestCreatorBox from "./testCreatorBox"
import { redirect } from "next/navigation";


export default async function Page() {
    const { profileIsActive, enoughPermissions } = await checkAuthAndPermissions()
	 if (!profileIsActive && !enoughPermissions ) {
        redirect("/createAccount");
	}
    return (
       <div className="flex flex-col gap-2">
            <section className="w-full">
            <CanvasRevealBoxWithoutBorder
					colors={[
                        [3, 94, 252],
                        [107, 3, 252],
                    ]}>
					<MaxWidthWrapper className="py-10 flex justify-between items-center">
						<h1 className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-xl">
							Kreator testów
						</h1>
					</MaxWidthWrapper>
				</CanvasRevealBoxWithoutBorder>
            </section>
            <section className="w-full">
                <MaxWidthWrapper>
                    <TestCreatorBox/>
				</MaxWidthWrapper>
            </section>
       </div> 
    )
}