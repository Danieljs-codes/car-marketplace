import type { ComponentPropsWithoutRef } from "react";
import { LogoLight } from "./logo-light";
import { LogoDark } from "./logo-dark";
import { LogoLightIcon } from "./logo-light-icon";
import { LogoDarkIcon } from "./logo-dark-icon";
import { cn } from "~/utils/classes";

interface Props extends ComponentPropsWithoutRef<"svg"> {
	iconOnly?: boolean;
}

export function Logo({ iconOnly, className, ...props }: Props) {
	if (iconOnly) {
		return (
			<>
				<LogoLightIcon className={cn(className, "dark:hidden")} {...props} />
				<LogoDarkIcon
					className={cn(className, "hidden dark:block")}
					{...props}
				/>
			</>
		);
	}

	return (
		<>
			<LogoLight className={cn(className, "dark:hidden")} {...props} />
			<LogoDark className={cn(className, "hidden dark:block")} {...props} />
		</>
	);
}
