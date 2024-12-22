import type { ComponentPropsWithoutRef } from "react";
import { LogoLight } from "./logo-light";
import { LogoDark } from "./logo-dark";

export function Logo({ ...props }: ComponentPropsWithoutRef<"svg">) {
	return (
		<>
			<LogoLight className="hidden dark:block" {...props} />
			<LogoDark className="dark:hidden" {...props} />
		</>
	);
}
