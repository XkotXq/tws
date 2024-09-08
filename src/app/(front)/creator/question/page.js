import MaxWidthWrapper from "@/components/maxWidthWrapper";
import { Button } from "@nextui-org/react";
import { CanvasRevealBoxWithoutBorder } from "@/components/CanvasRevealBoxWithoutBorder";
import Link from "next/link";
import { Check, Save01 } from "@untitled-ui/icons-react";
import Switcher from "./switcher"
import QuestionCard from "./questionCard"
import QuestionCreatorBox from "./questionCreatorBox"
import checkAuthAndPermissions from "utils/checkIsAuthAndPermissions";
import { redirect } from "next/navigation";

export default async function page() {
	const { profileIsActive, enoughPermissions } = await checkAuthAndPermissions()
	 if (!profileIsActive && !enoughPermissions ) {
        redirect("/createAccount");
	}
	return (
		<div>
			<section className="w-full">
				<CanvasRevealBoxWithoutBorder
					colors={[
                        [252, 169, 3],
                        [227, 252, 3],
                    ]}>
					<MaxWidthWrapper className="py-10 flex justify-between items-center">
						<h1 className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-xl">
							Kreator pytań
						</h1>
					</MaxWidthWrapper>
				</CanvasRevealBoxWithoutBorder>
			</section>
			<div>
				</div>
			<div className="w-full">
				<MaxWidthWrapper>
				<QuestionCreatorBox/>
				</MaxWidthWrapper>
			</div>
		</div>
	);
}
