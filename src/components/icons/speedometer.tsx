const DashboardSpeed02Icon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={20}
		height={20}
		fill={"none"}
		{...props}
		data-slot="icon"
	>
		<circle cx="12" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
		<path
			d="M12 15V10"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
		<path
			d="M22 13C22 7.47715 17.5228 3 12 3C6.47715 3 2 7.47715 2 13"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
	</svg>
);

export { DashboardSpeed02Icon as IconSpeedometer };
