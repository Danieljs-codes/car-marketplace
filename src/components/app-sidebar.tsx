import {
	IconCheck,
	IconChevronLgDown,
	IconCircleQuestionmark,
	IconClock,
	IconCommandRegular,
	IconCreditCard,
	IconDashboard,
	IconDotsHorizontal,
	IconHeadphones,
	IconLogout,
	IconMessage,
	IconMinus,
	IconNotes,
	IconPackage,
	IconSettings,
	IconShield,
	IconShoppingBag,
	IconSupport,
	IconTicket,
} from "justd-icons";
import {
	Avatar,
	Link,
	Menu,
	Sidebar,
	SidebarContent,
	SidebarDisclosure,
	SidebarDisclosureGroup,
	SidebarDisclosurePanel,
	SidebarDisclosureTrigger,
	SidebarFooter,
	SidebarHeader,
	SidebarItem,
	SidebarLabel,
	SidebarLink,
	SidebarRail,
	SidebarSection,
	SidebarSectionGroup,
	useSidebar,
} from "ui";
import { Logo } from "./logo";
import { useAnimation, type Variants, motion } from "motion/react";
import type { authClient } from "~/utils/auth-client";
import { getAvatarInitials } from "~/utils/misc";
import { useLocation } from "@tanstack/react-router";

const pathVariants: Variants = {
	normal: {
		opacity: 1,
		pathLength: 1,
	},
	animate: {
		opacity: [0, 1],
		pathLength: [0, 1],
	},
};

export default function AppSidebar({
	auth,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	auth: (typeof authClient.$Infer.Session)["user"];
}) {
	const activeRoute = useLocation().pathname;
	const controls = useAnimation();
	const { state, isMobile } = useSidebar();
	const collapsed = state === "collapsed" && !isMobile;

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<Link
					className="flex items-center gap-x-2 group-data-[collapsible=dock]:size-10 group-data-[collapsible=dock]:justify-center"
					href="/"
				>
					{!collapsed ? (
						<Logo className="w-28 h-auto" />
					) : (
						<Logo iconOnly className="w-5 h-auto" />
					)}
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarSectionGroup>
					<SidebarSection title="Overview">
						<SidebarItem
							isCurrent={activeRoute.toLowerCase() === "/dashboard"}
							href="/"
						>
							<IconDashboard />
							<SidebarLabel>Overview</SidebarLabel>
						</SidebarItem>

						<SidebarItem
							isCurrent={activeRoute.toLowerCase().includes("listing")}
							href="/listings"
						>
							{({ isHovered, isCollapsed }) => (
								<>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										width={20}
										height={20}
										fill={"none"}
										data-slot="icon"
									>
										<path
											d="M6.98633 3.7002C9.78335 6.79476 14.3961 0.115903 17.1255 2.53974C18.696 3.93439 18.1995 7.01373 16.1607 9.01999"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
										<path
											d="M13.7897 13.9839C13.8075 13.6494 13.9014 13.0373 13.3927 12.5722M13.3927 12.5722C13.2353 12.4282 13.0201 12.2983 12.7272 12.1951C11.6788 11.8256 10.391 13.0623 11.302 14.1944C11.7917 14.803 12.1692 14.9901 12.1337 15.6812C12.1087 16.1673 11.6311 16.6752 11.0018 16.8686C10.4551 17.0367 9.85198 16.8142 9.47052 16.3879C9.00476 15.8675 9.0518 15.3769 9.04782 15.163M13.3927 12.5722L13.9668 11.998M9.51204 16.4528L8.9668 16.998"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M18.2726 6.63305C19.1981 6.8108 19.4057 7.39525 19.682 9.01703C19.9309 10.4776 20.0007 12.2304 20.0007 12.9765C19.9753 13.2515 19.8625 13.5081 19.682 13.7174C17.7469 15.7455 13.9064 19.5753 11.9681 21.4778C11.2074 22.1569 10.0597 22.1716 9.25241 21.5482C7.59928 20.0612 6.01095 18.3803 4.45501 16.8625C3.82993 16.0574 3.84458 14.9129 4.52567 14.1544C6.57621 12.0272 10.2867 8.38602 12.3813 6.3745C12.5913 6.19455 12.8486 6.08199 13.1243 6.05672C13.5943 6.0566 14.4005 6.11977 15.1859 6.1653"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
										/>
									</svg>
									<SidebarLink href="/listings">
										<SidebarLabel>Listings</SidebarLabel>
									</SidebarLink>
								</>
							)}
						</SidebarItem>
						<SidebarItem
							isCurrent={activeRoute.toLowerCase().includes("orders")}
							href="/"
						>
							{({ isHovered, isCollapsed }) => (
								<>
									<IconShoppingBag />
									<SidebarLink href="/">
										<SidebarLabel>Orders</SidebarLabel>
									</SidebarLink>
									{!isCollapsed && isHovered && (
										<Menu>
											<Menu.Trigger aria-label="Manage">
												<IconDotsHorizontal />
											</Menu.Trigger>
											<Menu.Content offset={0} placement="right top">
												<Menu.Item href="/">
													<IconClock />
													Orders Pending
												</Menu.Item>
												<Menu.Item href="/">
													<IconCheck />
													Completed Orders
												</Menu.Item>
												<Menu.Item
													onHoverStart={() => controls.start("animate")}
													onHoverEnd={() => controls.start("normal")}
													href="/"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														data-slot="icon"
													>
														<motion.path
															variants={pathVariants}
															animate={controls}
															d="M18 6 6 18"
														/>
														<motion.path
															transition={{ delay: 0.2 }}
															variants={pathVariants}
															animate={controls}
															d="m6 6 12 12"
														/>
													</svg>
													Canceled Orders
												</Menu.Item>
											</Menu.Content>
										</Menu>
									)}
								</>
							)}
						</SidebarItem>
						<SidebarItem
							isCurrent={activeRoute.toLowerCase().includes("payments")}
							href="/"
							badge="4 Pending"
						>
							<IconCreditCard />
							<SidebarLabel>Payments</SidebarLabel>
						</SidebarItem>
					</SidebarSection>

					{/* TODO: Remove it or replace it with something else */}
					<SidebarDisclosureGroup defaultExpandedKeys={[1]}>
						<SidebarDisclosure id={1}>
							<SidebarDisclosureTrigger>
								<IconSupport />
								<SidebarLabel>Support</SidebarLabel>
							</SidebarDisclosureTrigger>
							<SidebarDisclosurePanel>
								<SidebarItem
									isCurrent={activeRoute.toLowerCase().includes("tickets")}
									href="/"
								>
									<IconTicket />
									<SidebarLabel>Tickets</SidebarLabel>
								</SidebarItem>
								<SidebarItem
									isCurrent={activeRoute.toLowerCase().includes("chat")}
									href="/"
								>
									<IconMessage />
									<SidebarLabel>Chat Support</SidebarLabel>
								</SidebarItem>
								<SidebarItem
									isCurrent={activeRoute.toLowerCase().includes("faq")}
									href="/"
								>
									<IconCircleQuestionmark />
									<SidebarLabel>FAQ</SidebarLabel>
								</SidebarItem>
								<SidebarItem
									isCurrent={activeRoute.toLowerCase().includes("docs")}
									href="/"
								>
									<IconNotes />
									<SidebarLabel>Documentation</SidebarLabel>
								</SidebarItem>
							</SidebarDisclosurePanel>
						</SidebarDisclosure>
						<SidebarDisclosure id={2}>
							<SidebarDisclosureTrigger>
								<IconPackage />
								<SidebarLabel>Inventory</SidebarLabel>
							</SidebarDisclosureTrigger>
							<SidebarDisclosurePanel>
								<SidebarItem
									isCurrent={activeRoute.toLowerCase().includes("stock")}
									href="/"
								>
									<IconMinus />
									<SidebarLabel>Stock Levels</SidebarLabel>
								</SidebarItem>
								<SidebarItem
									isCurrent={activeRoute.toLowerCase().includes("warehouse")}
									href="/"
								>
									<IconMinus />
									<SidebarLabel>Warehouse</SidebarLabel>
								</SidebarItem>
								<SidebarItem
									isCurrent={activeRoute.toLowerCase().includes("shipping")}
									href="/"
								>
									<IconMinus />
									<SidebarLabel>Shipping</SidebarLabel>
								</SidebarItem>
							</SidebarDisclosurePanel>
						</SidebarDisclosure>
					</SidebarDisclosureGroup>
				</SidebarSectionGroup>
			</SidebarContent>

			<SidebarFooter>
				<Menu>
					<Menu.Trigger
						className="group"
						aria-label="Profile"
						data-slot="menu-trigger"
					>
						<Avatar
							shape="square"
							src={auth.image}
							initials={getAvatarInitials(auth.name)}
						/>
						<div className="in-data-[sidebar-collapsible=dock]:hidden text-sm">
							<SidebarLabel className="capitalize">
								{auth.name.toLowerCase()}
							</SidebarLabel>
							<span className="block -mt-0.5 text-muted-fg overflow-hidden text-ellipsis w-[86%]">
								{auth.email.toLowerCase()}
							</span>
						</div>
						<IconChevronLgDown
							data-slot="chevron"
							className="absolute right-3 transition-transform size-4 group-pressed:rotate-180"
						/>
					</Menu.Trigger>
					<Menu.Content
						placement="bottom right"
						className="sm:min-w-(--trigger-width)"
					>
						<Menu.Section>
							<Menu.Header separator>
								<span className="block capitalize">
									{auth.name.toLowerCase()}
								</span>
								<span className="font-normal text-muted-fg capitalize">
									{auth.email.toLowerCase()}
								</span>
							</Menu.Header>
						</Menu.Section>

						<Menu.Item href="/">
							<IconDashboard />
							Dashboard
						</Menu.Item>
						<Menu.Item href="/">
							<IconSettings />
							Settings
						</Menu.Item>
						<Menu.Item href="/">
							<IconShield />
							Security
						</Menu.Item>
						<Menu.Separator />
						<Menu.Item>
							<IconCommandRegular />
							Command Menu
						</Menu.Item>

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
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
