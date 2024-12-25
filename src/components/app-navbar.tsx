import {
	IconCommandRegular,
	IconDashboard,
	IconHeadphones,
	IconLogout,
	IconSearch,
	IconSettings,
	IconShield,
	IconShippingBagHeart,
	IconShoppingBag,
} from "justd-icons";
import { Avatar, Button, buttonStyles, Menu, Navbar, Separator } from "ui";
import { ThemeSwitcher } from "./theme-switcher";
import { Logo } from "./logo";
import type { authClient } from "~/utils/auth-client";
import { Link } from "@tanstack/react-router";
import { getAvatarInitials } from "~/utils/misc";
import type schema from "~/server/db/schema";

type Auth =
	| (typeof authClient.$Infer.Session & {
			seller: typeof schema.sellers.$inferSelect | null;
	  })
	| null;

export default function AppNavbar({
	children,
	auth,
	...props
}: React.ComponentProps<typeof Navbar> & {
	auth: Auth;
}) {
	return (
		<>
			<Navbar intent="inset" {...props}>
				<Navbar.Nav>
					<Navbar.Logo aria-label="Go to home page" href="/">
						<Logo className="w-24" />
					</Navbar.Logo>
					<Navbar.Section>
						<Navbar.Item isCurrent href="/">
							Home
						</Navbar.Item>
						<Navbar.Item href="/">Browse Cars</Navbar.Item>
						<Navbar.Item href="/">Wishlist</Navbar.Item>
						<Navbar.Item href="/">My Purchases</Navbar.Item>
					</Navbar.Section>
					<Navbar.Section className="hidden ml-auto sm:flex">
						<Navbar.Flex>
							<Button
								appearance="plain"
								size="square-petite"
								aria-label="Search for products"
							>
								<IconSearch />
							</Button>
							<Button
								appearance="plain"
								size="square-petite"
								aria-label="Your Bag"
							>
								<IconShoppingBag />
							</Button>
							<ThemeSwitcher appearance="plain" />
						</Navbar.Flex>
						<Separator orientation="vertical" className="mr-3 ml-1 h-6" />
						{auth?.seller && <UserMenu auth={auth} />}
						{!auth && (
							<Link
								className={buttonStyles({
									intent: "primary",
									size: "extra-small",
								})}
								to="/sign-in"
							>
								Sign in
							</Link>
						)}
						{auth && !auth.seller && (
							<Link
								className={buttonStyles({
									intent: "primary",
									size: "extra-small",
								})}
								to="/become-seller"
							>
								Become a seller
							</Link>
						)}
					</Navbar.Section>
				</Navbar.Nav>

				<Navbar.Compact>
					<Navbar.Flex>
						<Navbar.Trigger className="-ml-2" />
						<Separator orientation="vertical" className="h-6 sm:mx-1" />
						<Navbar.Logo aria-label="Go to home page" href="/">
							<Logo iconOnly className="w-6" />
						</Navbar.Logo>
					</Navbar.Flex>
					<Navbar.Flex>
						<Navbar.Flex>
							<Button
								appearance="plain"
								size="square-petite"
								aria-label="Search for products"
							>
								<IconSearch />
							</Button>
							{/* <Button
								appearance="plain"
								size="square-petite"
								aria-label="Your Bag"
							>
								<IconShoppingBag />
							</Button> */}
							<ThemeSwitcher appearance="plain" />
						</Navbar.Flex>
						<Separator orientation="vertical" className="mr-3 ml-1 h-6" />
						{auth?.seller && <UserMenu auth={auth} />}
						{!auth && (
							<Link
								className={buttonStyles({
									intent: "primary",
									size: "extra-small",
								})}
								to="/sign-in"
							>
								Sign in
							</Link>
						)}
						{auth && !auth.seller && (
							<Link
								className={buttonStyles({
									intent: "primary",
									size: "extra-small",
								})}
								to="/become-seller"
							>
								Become a seller
							</Link>
						)}
					</Navbar.Flex>
				</Navbar.Compact>

				<Navbar.Inset>{children}</Navbar.Inset>
			</Navbar>
		</>
	);
}

function UserMenu({ auth }: { auth: NonNullable<Auth> }) {
	return (
		<Menu>
			<Menu.Trigger aria-label="Open Menu">
				<Avatar
					alt={auth.user.name}
					initials={getAvatarInitials(auth.user.name)}
					size="small"
					shape="square"
					src={auth.user.image}
				/>
			</Menu.Trigger>
			<Menu.Content placement="bottom right" className="sm:min-w-56">
				<Menu.Section>
					<Menu.Header separator>
						<span className="block">{auth.user.name}</span>
						<span className="font-normal text-muted-fg">
							@{auth.user.email}
						</span>
					</Menu.Header>
				</Menu.Section>

				<Menu.Item href="/">
					<IconDashboard />
					Dashboard
				</Menu.Item>
				<Menu.Item href="/">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="20"
						height="20"
						fill="none"
						data-slot="icon"
					>
						<path
							d="M2 4.5H8.75736C9.55301 4.5 10.3161 4.81607 10.8787 5.37868L14 8.5"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M5 13.5H2"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M8.5 7.5L10.5 9.5C11.0523 10.0523 11.0523 10.9477 10.5 11.5C9.94772 12.0523 9.05229 12.0523 8.5 11.5L7 10C6.13931 10.8607 4.77671 10.9575 3.80294 10.2272L3.5 10"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M5 11V15.5C5 17.3856 5 18.3284 5.58579 18.9142C6.17157 19.5 7.11438 19.5 9 19.5H18C19.8856 19.5 20.8284 19.5 21.4142 18.9142C22 18.3284 22 17.3856 22 15.5V12.5C22 10.6144 22 9.67157 21.4142 9.08579C20.8284 8.5 19.8856 8.5 18 8.5H9.5"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M15.25 14C15.25 14.9665 14.4665 15.75 13.5 15.75C12.5335 15.75 11.75 14.9665 11.75 14C11.75 13.0335 12.5335 12.25 13.5 12.25C14.4665 12.25 15.25 13.0335 15.25 14Z"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					My Purchases
				</Menu.Item>
				<Menu.Item href="/">
					<IconShippingBagHeart />
					My Wishlist
				</Menu.Item>
				<Menu.Separator />

				<Menu.Item href="/">
					<IconHeadphones />
					Customer Support
				</Menu.Item>
				<Menu.Separator />
				<Menu.Item href="/">
					<IconLogout />
					Log out
				</Menu.Item>
			</Menu.Content>
		</Menu>
	);
}
