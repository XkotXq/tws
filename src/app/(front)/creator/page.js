import MaxWidthWrapper from "@/components/maxWidthWrapper";
import { FlipWords } from "@/components/ui/flip-words";
import { CanvasRevealBoxWithoutBorder } from "@/components/CanvasRevealBoxWithoutBorder";
import Link from "next/link";
import { CanvasRevealEffectBox } from "@/components/CanvasRevealBox";
import checkAuthAndPermissions from "utils/checkIsAuthAndPermissions"
import { redirect } from "next/navigation";

export default async function page() {
	const { profileIsActive, enoughPermissions } = await checkAuthAndPermissions()
	 if (!profileIsActive || !enoughPermissions ) {
        redirect("/createAccount");
	}
	const words = ["Kreator pytań", "Menedżer zbiorów", "Kreator testów", "Konfigurator testów"];
	return (
		<div>
			<section className="w-full">
				<CanvasRevealBoxWithoutBorder
					colors={[
						[142, 22, 195],
						[211, 105, 233],
					]}>
					<MaxWidthWrapper className="py-10">
						<h1 className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-xl">
							<FlipWords words={words} />
						</h1>
					</MaxWidthWrapper>
				</CanvasRevealBoxWithoutBorder>
			</section>
			<section className="w-full dark:bg-black  dark:bg-dot-white/[0.2] relative">
				<MaxWidthWrapper>
					<div className="z-50 grid gap-4 mt-10 grid-cols-2 w-full">
						<Link href="/creator/question">
							<CanvasRevealEffectBox
								colors={[
									[252, 169, 3],
									[227, 252, 3],
								]}
								className="py-10 w-full"
								dotSize={3}>
								<p className="md:text-2xl text-2xl font-medium text-center text-white relative z-20 max-w-2xl mx-auto py-10">
									Kreator pytań
								</p>
							</CanvasRevealEffectBox>
						</Link>
						<Link href="/creator/collection">
							<CanvasRevealEffectBox
								colors={[
									[3, 252, 40],
									[3, 252, 194],
								]}
								className="py-10 w-full"
								dotSize={3}>
								<p className="md:text-2xl text-2xl font-medium text-center text-white relative z-20 max-w-2xl mx-auto py-10">
									Menedżer zbiorów
								</p>
							</CanvasRevealEffectBox>
						</Link>
						<Link href="/creator/test">
							<CanvasRevealEffectBox
								colors={[
									[3, 94, 252],
									[107, 3, 252],
								]}
								className="py-10 w-full"
								dotSize={3}>
								<p className="md:text-2xl text-2xl font-medium text-center text-white relative z-20 max-w-2xl mx-auto py-10">
									Kreator testów
								</p>
							</CanvasRevealEffectBox>
						</Link>
						<Link href="/creator/createTest">
							<CanvasRevealEffectBox
								colors={[
									[252, 3, 3],
									[252, 119, 3],
								]}
								className="py-10 w-full"
								dotSize={3}>
								<p className="md:text-2xl text-2xl font-medium text-center text-white relative z-20 max-w-2xl mx-auto py-10">
									Konfiguracja testu
								</p>
							</CanvasRevealEffectBox>
						</Link>
					</div>
				</MaxWidthWrapper>
				<MaxWidthWrapper></MaxWidthWrapper>
				<div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
			</section>
		</div>
	);
}
