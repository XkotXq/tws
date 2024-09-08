import { headers } from "next/headers";
import ClientNavigation from "./clientNavigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Navigation() {
	const { getUser, isAuthenticated, getPermission, getRoles } =
		getKindeServerSession();
	const isAuthenticatedC = await isAuthenticated();
	const userC = await getUser();
	const roleC = await getPermission("create:profile");
	async function getAccountDetails(_profileIsCreated) {
			try {
				const res = await fetch(
					"http://localhost:3000/api/profile/getDataProfile",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(
							{
								userId: userC.id
							}
						)
					}
				)
				const data = await res.json()
				return data
			} catch (err) {
				return {profile: null, created: false}
			}
	}
	const {profile, created} = await getAccountDetails()

	return (
		// <div>elo</div>
		<ClientNavigation
			isAuthenticated={isAuthenticatedC}
			isLoading={false}
			user={userC}
			permission={roleC}
            profileIsCreated={created}
			accountDetails={profile}
		/>
	);
}
