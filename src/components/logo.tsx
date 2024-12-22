import type { ComponentPropsWithoutRef } from "react";
import { LogoLight } from "./logo-light";
import { LogoDark } from "./logo-dark";
import { cn } from "~/utils/classes";

export function Logo({ className, ...props }: ComponentPropsWithoutRef<"svg">) {
	return (
		<>
			<LogoLight className={cn(className, "dark:hidden")} {...props} />
			<LogoDark className={cn(className, "hidden dark:block")} {...props} />
		</>
	);
}
