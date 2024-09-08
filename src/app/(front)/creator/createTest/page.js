import MaxWidthWrapper from "@/components/maxWidthWrapper";
import { CanvasRevealBoxWithoutBorder } from "@/components/CanvasRevealBoxWithoutBorder";
import ConfigureBox from "./configureBox"

export default async function page() {


	const getTests = async () => {
		try {
			const res = await fetch("http://localhost:3000/api/content/test", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})
			if (!res.ok) {
				return null
			}
			const data = await res.json()
			return data
		} catch (err) {
			console.log("błąd podczas pobierania")
		}
	}
	const tests = await getTests()

	return (
		<div>
			<section className="w-full">
				<CanvasRevealBoxWithoutBorder
					colors={[
                        [252, 3, 3],
                        [252, 119, 3],
                    ]}>
					<MaxWidthWrapper className="py-10 flex justify-between items-center">
						<h1 className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-xl">
							Konfiguracja testu
						</h1>
					</MaxWidthWrapper>
				</CanvasRevealBoxWithoutBorder>
			</section>
			<div></div>
			<div className="w-full">
				<MaxWidthWrapper>
					<ConfigureBox tests={tests}/>
				</MaxWidthWrapper>
			</div>
		</div>
	);
}
