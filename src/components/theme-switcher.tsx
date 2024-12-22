"use client";

import {
	IconCircleHalf,
	IconDeviceDesktop2,
	IconMoon,
	IconSun,
} from "justd-icons";
import { useTheme } from "next-themes";
import { Button, composeTailwindRenderProps, Tooltip } from "ui";

export function ThemeSwitcher({
	shape = "square",
	appearance = "outline",
	className,
	...props
}: React.ComponentProps<typeof Button>) {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		const nextTheme =
			theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
		setTheme(nextTheme);
	};

	return (
		<Tooltip delay={0}>
			<Button
				shape={shape}
				appearance={appearance}
				size="square-petite"
				className={composeTailwindRenderProps(
					className,
					"**:data-[slot=icon]:text-fg",
				)}
				aria-label="Switch theme"
				onPress={toggleTheme}
				{...props}
			>
				{theme === "light" ? (
					<IconSun />
				) : theme === "dark" ? (
					<IconMoon />
				) : (
					<IconCircleHalf />
				)}
			</Button>
			<Tooltip.Content showArrow>
				<span className="text-xs">
					{theme === "light"
						? "Switch to Dark"
						: theme === "dark"
							? "Switch to System"
							: "Switch to Light"}
				</span>
			</Tooltip.Content>
		</Tooltip>
	);
}
