import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import FormForCreateProfile from "./formForCreateProfile"

async function page() {
	const { getUser, refreshTokens } = getKindeServerSession();
    const userC = await getUser()
    async function profileIsCreated() {
		try {
			const res = await fetch(
				"http://localhost:3000/api/profile/checkProfile",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
                    body: JSON.stringify({
                        id: userC.id
                    })
				}
			);
			const data = await res.json();
            const isCreated = data.created ? data.created: false
			return isCreated
		} catch (e) {
			console.error(e);
		}
	}
    const _profileIsCreated = await profileIsCreated()
	if (_profileIsCreated ) {
		redirect("/");
	}
    await refreshTokens();
    

	return (
		<div className="w-full">
            <div>
			    <FormForCreateProfile/>
            </div>
            
		</div>
	);
}
export default page;
