"use client"

import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import {Checkbox} from "@nextui-org/checkbox";
import { User01, UserEdit } from "@untitled-ui/icons-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const FormForCreateProfile = () => {
	const router = useRouter()
	const [isAdministrator, setIsAdministrator] = useState(false)
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [idOrganization, setIdOrganization] = useState("")
	const [nameOrganization, setNameOrganization] = useState("")
	const [isChecked, setIsChecked] = useState(false)
	const [goNext, setGoNext] = useState(false)
	const [isInvalid, setIsInvalid] = useState(false)
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (firstName.trim() && lastName.trim() && idOrganization.trim() && isChecked) {
			setGoNext(true)
		} else {
			setGoNext(false)
		}
	}, [firstName, lastName, idOrganization, isChecked])

	const createProfile = async () => {
		setIsLoading(true)
		const newProfileObject = {
			firstName,
			lastName,
			organizationId: idOrganization,
			isOwner: isAdministrator,
			organizationName: isAdministrator ? nameOrganization : null 
		}
		try {

			const res = await fetch("http://localhost:3000/api/profile/createProfile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body : JSON.stringify(newProfileObject)
			})
			const data = await res.json()
			if (data && data.created) {
				router.refresh()
			} else {
				setError(data.error ? data.error : "wystąpił niespodziewny błąd")
			}
		} catch(err) {
			console.error(err)
		}
		setIsLoading(false)
	}
    return (
        <Card className="flex flex-col gap-2 max-w-xl p-2 mx-auto">
			<CardHeader><h1 className="text-4xl">Tworzenie profilu</h1></CardHeader>
			<CardBody className="flex flex-col gap-2">
        	<div className="flex gap-2">
				<Input isRequired color="primary"  label="Imię" value={firstName} onValueChange={setFirstName}/>
				<Input isRequired color="primary" label="Nazwisko" value={lastName} onValueChange={setLastName} />
			</div>
			<div className="flex gap-2">
				<Input isRequired color="primary" label="Id organizacji" value={idOrganization} onValueChange={setIdOrganization} errorMessage="brak takiej organizacji" isInvalid={isInvalid}/>
			</div>
			<div className="flex gap-2">
				<Switch
					color="primary"
					startContent={<User01/>}
					endContent={<UserEdit/>}
					isSelected={isAdministrator}
					onValueChange={setIsAdministrator}
					>
					konto administratora
				</Switch>
			<Input isRequired color="primary" label="Nazwa organizacji" value={nameOrganization} onValueChange={setNameOrganization} isDisabled={!isAdministrator}/>
			</div>
			<div>
			<Checkbox isRequired size="md" isSelected={isChecked} onValueChange={setIsChecked}>Akceptuję <Link className="underline" href="/rulesAndRegulations">regulamin</Link></Checkbox>
			</div>
			{
				error ? (
					<div className="p-2 rounded-lg bg-danger-700">
						{error}
					</div>
				) : null
			}
			<div>
				<Button onClick={createProfile} className="w-full" isDisabled={!goNext} isLoading={isLoading}>Stwórz profil</Button>
			</div>
					</CardBody>
        </Card>
    )
}

export default FormForCreateProfile;