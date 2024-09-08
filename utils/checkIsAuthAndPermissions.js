"use server"

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function chechAuthAndPermissions() {
    const { getUser } = getKindeServerSession();
    const userC = await getUser()
    if (!userC){
        return { profileIsActive: false, enoughPermissions: false };
    }
    async function profileIsCreated() {
        try {
            const res = await fetch("http://localhost:3000/api/profile/checkProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: userC.id }),
            });
    
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
    
            const data = await res.json();
            const isCreated = data.created || false;
            const isOwner = data.isOwner || false;
            const isManage = data.isManage || false;
            console.log(data, "profil logowanie")
            console.log({ profileIsActive: isCreated, enoughPermissions: isOwner || isManage }, "test")
            return { profileIsActive: isCreated, enoughPermissions: isOwner || isManage };
        } catch (e) {
            console.error(e);
            return { profileIsActive: false, enoughPermissions: false };
        }
    }
    
    const { profileIsActive, enoughPermissions } = await profileIsCreated();
    return { profileIsActive, enoughPermissions}
}