import { IconCircleHalf, IconMoon, IconSun } from "justd-icons";

import { Button, composeTailwindRenderProps, Tooltip } from "ui";
import { useTheme } from "./theme-provider";

export function ThemeSwitcher({
	shape = "square",
	appearance = "outline",
	className,
	...props
}: React.ComponentProps<typeof Button>) {
	const { value: theme, set: setTheme } = useTheme();

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
