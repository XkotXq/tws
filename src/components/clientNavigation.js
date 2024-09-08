"use client";

import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Link,
	Avatar,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	DropdownSection,
	Chip,
	Skeleton,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarMenuItem,
	Divider,
} from "@nextui-org/react";
import {
	LogOut04,
	Award01,
	Certificate01,
	BookClosed,
	BookOpen01,
	File02,
	User01,
	UserPlus01,
	User03,
	Bookmark,
	PlusSquare,
	Home03,
	Phone,
	InfoCircle,
} from "@untitled-ui/icons-react";
import {
	LoginLink,
	RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { useState } from "react";

function ClientNavigation({
	isAuthenticated,
	isLoading,
	user,
	permission,
	profileIsCreated,
	accountDetails,
}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<Navbar onMenuOpenChange={setIsMenuOpen}>
			<NavbarContent className="flex gap-4">
				<NavbarMenuToggle
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					className="sm:hidden"
				/>
				<NavbarBrand>
					<Link href="/" className="flex gap-2">
						<img src="/twsnew.svg" width={40} />
						<p className="text-white md:block hidden">TestyWSieci</p>
					</Link>
				</NavbarBrand>
			</NavbarContent>
			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				{isAuthenticated && !profileIsCreated ? (
					<NavbarItem>
						<Link href="/createAccount" color="foreground">
							stwórz profil
						</Link>
					</NavbarItem>
				) : null}
				{accountDetails &&
				(accountDetails?.isOwner || accountDetails?.isManage) ? (
					<NavbarItem>
						<Link
							href="/creator"
							color="foreground"
							className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700 font-bold">
							kreator ✨
						</Link>
					</NavbarItem>
				) : null}
				<NavbarItem>
					<Link href="/information" color="foreground">
						informacje
					</Link>
				</NavbarItem>
				{!accountDetails?.isOwner && !accountDetails?.isManage ? (
					<NavbarItem>
						<Link
							href="/tests"
							color="foreground"
							className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700 font-bold">
							testy
						</Link>
					</NavbarItem>
				) : null}
				<NavbarItem>
					<Link href="/contact" color="foreground">
						kontakt
					</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify="end">
				{isLoading ? (
					<>
						<Skeleton className="flex rounded-full w-10 h-10" />
					</>
				) : !isAuthenticated ? (
					<>
						{/* <Button as={LoginLink}>
					Zaloguj
					</Button> */}
						<LoginLink postLoginRedirectURL="/createAccount">
							{/* <Button variant="bordered">Zaloguj</Button> */}
							<button className="p-[3px] relative">
								<div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
								<div className="px-5 py-2  bg-black rounded-full  relative group transition duration-200 text-white hover:bg-transparent">
									Zaloguj
								</div>
							</button>
						</LoginLink>
						<RegisterLink postLoginRedirectURL="/createAccount">
							{/* <Button>Zarejestruj</Button> */}
							<button className="p-[3px] relative">
								<div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
								<div className="px-5 py-2  hover:bg-black rounded-full  relative group transition duration-200 text-white bg-transparent">
									Zarejestruj
								</div>
							</button>
						</RegisterLink>
					</>
				) : (
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<Avatar
								as="button"
								size="sm"
								name="BG"
								className="transition-transform"
								src={user.picture}
							/>
						</DropdownTrigger>
						<DropdownMenu>
							<DropdownSection showDivider>
								<DropdownItem key="profile" className="gap-2">
									{profileIsCreated ? (
										<div className="gap-2 flex flex-col">
											<div className="flex gap-2">
												<User03 /> {accountDetails.firstName}{" "}
												{accountDetails.lastName}
											</div>
											<div className="flex gap-2">
												<Bookmark /> {accountDetails.organizationId}
											</div>
										</div>
									) : (
										<>
											<p>Zalogowano jako:</p>
											<p>
												{user.given_name}{" "}
												{user.family_name ? user.family_name : null}
											</p>
										</>
									)}
								</DropdownItem>
							</DropdownSection>
							{isAuthenticated && !profileIsCreated ? (
								<DropdownItem
									className="max-w-64"
									href="/createAccount"
									startContent={<UserPlus01 />}
									description="Po stworzeniu swojego profilu uzyskasz pełny dostęp">
									<p>Stwórz profil</p>
								</DropdownItem>
							) : (accountDetails && accountDetails.isOwner) ||
							  accountDetails.isManage ? (
								<DropdownSection showDivider>
									<DropdownItem
										href="/account"
										key="my account"
										startContent={<User01 />}>
										<p>Moje konto</p>
									</DropdownItem>
									<DropdownItem
										key="create tests"
										className="group"
										href="/creator"
										startContent={
											<PlusSquare className="text-primary-500 group-hover:text-white" />
										}>
										<p className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700 font-bold group-hover:from-white group-hover:to-white">
											Kreator ✨
										</p>
									</DropdownItem>
								</DropdownSection>
							) : (
								<DropdownSection showDivider>
									<DropdownItem
										href="/account"
										key="my account"
										startContent={<User01 />}>
										<p>Moje konto</p>
									</DropdownItem>
									<DropdownItem key="all tests" startContent={<File02 />}>
										<p>Wszystkie testy</p>
									</DropdownItem>
									<DropdownItem
										key="saved tests"
										startContent={<BookClosed />}
										endContent={
											<Chip radius="full" variant="flat">
												{accountDetails.savedTests}
											</Chip>
										}>
										<p>Zapisane testy</p>
									</DropdownItem>
									<DropdownItem
										startContent={<BookOpen01 />}
										key="active tests"
										endContent={
											<Chip radius="full" variant="flat">
												{accountDetails.activeTests}
											</Chip>
										}>
										<p>Aktywne testy</p>
									</DropdownItem>
									<DropdownItem
										key="ended tests"
										startContent={<Certificate01 />}>
										<p>Zakończone testy</p>
									</DropdownItem>
									<DropdownItem key="atachment" startContent={<Award01 />}>
										<p>Osiągnięcia</p>
									</DropdownItem>
								</DropdownSection>
							)}
							<DropdownSection>
								<DropdownItem startContent={<LogOut04 />}>
									<LogoutLink>
										<p>Wyloguj</p>
									</LogoutLink>
								</DropdownItem>
							</DropdownSection>
						</DropdownMenu>
					</Dropdown>
				)}
			</NavbarContent>
			<NavbarMenu>
				{accountDetails &&
				(accountDetails.isOwner || accountDetails.isManage) ? (
					<NavbarItem>
						<Link
							href="/creator"
							color="foreground"
							className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700 font-bold flex gap-1">
							<PlusSquare className="h-5 w-5 text-primary-500" />
							kreator ✨
						</Link>
					</NavbarItem>
				) : null}
				{isAuthenticated && !profileIsCreated ? (
					<NavbarItem>
						<Link
							href="/createAccount"
							color="foreground"
							className="flex gap-1">
							stwórz profil
						</Link>
					</NavbarItem>
				) : isAuthenticated && profileIsCreated ? (
					<>
						<Divider />
						<NavbarItem>
							<Link
								href="/createAccount"
								color="foreground"
								className="flex gap-1">
								<File02 className="h-5 w-5" />
								wszystkie testy
							</Link>
						</NavbarItem>
						<NavbarItem>
							<Link
								href="/createAccount"
								color="foreground"
								className="flex gap-1">
								<BookClosed className="h-5 w-5" />
								zapisane testy
							</Link>
						</NavbarItem>
						<NavbarItem>
							<Link
								href="/createAccount"
								color="foreground"
								className="flex gap-1">
								<BookOpen01 className="h-5 w-5" />
								aktywne testy
							</Link>
						</NavbarItem>
						<NavbarItem>
							<Link
								href="/createAccount"
								color="foreground"
								className="flex gap-1">
								<Certificate01 className="h-5 w-5" />
								zakończone testy
							</Link>
						</NavbarItem>
						<Divider />
					</>
				) : null}
				<NavbarMenuItem>
					<Link href="/information" color="foreground" className="flex gap-1">
						<InfoCircle className="h-5 w-5" />
						informacje
					</Link>
				</NavbarMenuItem>
				<NavbarMenuItem>
					<Link href="/contact" color="foreground" className="flex gap-1">
						<Phone className="h-5 w-5" />
						kontakt
					</Link>
				</NavbarMenuItem>
			</NavbarMenu>
		</Navbar>
	);
}

export default ClientNavigation;
