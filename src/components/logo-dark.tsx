import { type SVGProps, type Ref, forwardRef } from "react";
const SvgComponent = (
	props: SVGProps<SVGSVGElement>,
	ref: Ref<SVGSVGElement>,
) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={160}
		height={48}
		viewBox="0 0 160 48"
		fill="none"
		ref={ref}
		{...props}
	>
		<title>Logo (Dark Mode)</title>
		<path
			fill="#BBF451"
			fillRule="evenodd"
			d="M20 41.136c1.869 0 3.668-.299 5.352-.852-1.717-.29-3.527-.872-5.351-1.729-1.825.857-3.635 1.44-5.353 1.73 1.684.552 3.483.851 5.352.851ZM3.717 29.356c.29-1.718.872-3.529 1.73-5.355-.858-1.825-1.441-3.636-1.73-5.355A17.122 17.122 0 0 0 2.864 24c0 1.87.3 3.67.853 5.356Zm3.604-2.01c-.16.469-.296.93-.41 1.382-.887 3.551-.236 5.988 1.07 7.293 1.305 1.306 3.742 1.957 7.293 1.069.452-.113.913-.25 1.382-.41a32.248 32.248 0 0 1-5.14-4.194 32.244 32.244 0 0 1-4.195-5.14Zm12.68 7.845c-2.143-1.172-4.324-2.786-6.365-4.826-2.04-2.04-3.653-4.221-4.825-6.364 1.172-2.143 2.786-4.324 4.826-6.364 2.04-2.04 4.221-3.654 6.364-4.827 2.142 1.173 4.323 2.786 6.363 4.827 2.041 2.04 3.655 4.221 4.827 6.364-1.172 2.143-2.786 4.323-4.826 6.363-2.04 2.041-4.221 3.655-6.364 4.827Zm12.68-7.845a32.243 32.243 0 0 1-4.194 5.14 32.247 32.247 0 0 1-5.141 4.194c.468.16.93.297 1.382.41 3.551.888 5.988.237 7.293-1.069 1.306-1.305 1.957-3.742 1.069-7.293-.113-.452-.25-.913-.41-1.382Zm1.874-3.345c.857-1.824 1.44-3.634 1.73-5.351a17.12 17.12 0 0 1 .851 5.35c0 1.87-.299 3.668-.852 5.352-.29-1.717-.872-3.526-1.729-5.35Zm-9.2-16.284c-1.719.289-3.529.872-5.354 1.73-1.826-.858-3.637-1.441-5.355-1.73A17.12 17.12 0 0 1 20 6.864c1.87 0 3.67.3 5.354.853Zm8.703 2.057A19.936 19.936 0 0 0 20 4C8.954 4 0 12.954 0 24s8.954 20 20 20a19.936 19.936 0 0 0 14.235-5.951A19.936 19.936 0 0 0 40 24a19.936 19.936 0 0 0-5.942-14.226Zm-17.402 1.547c-.469-.16-.93-.297-1.383-.41-3.551-.888-5.988-.236-7.293 1.069-1.306 1.305-1.957 3.742-1.07 7.293.114.453.25.915.411 1.383a32.245 32.245 0 0 1 4.195-5.14 32.248 32.248 0 0 1 5.14-4.195Zm16.025 9.336a32.237 32.237 0 0 0-4.195-5.142 32.245 32.245 0 0 0-5.14-4.194c.468-.16.93-.297 1.383-.41 3.55-.888 5.988-.237 7.293 1.069 1.305 1.305 1.957 3.742 1.069 7.293-.113.453-.25.915-.41 1.384Z"
			clipRule="evenodd"
			opacity={0.84}
		/>
		<g fill="#fff" opacity={0.84}>
			<path d="M54.725 19.366c0 3.915 10.8.593 10.8 8.1 0 3.78-3.132 5.966-7.425 5.966-4.347 0-7.452-1.998-8.1-6.183h4.563c.351 1.81 1.62 2.809 3.564 2.809s2.97-.784 2.97-2.052c0-4.105-10.827-.973-10.827-8.236 0-3.078 2.565-5.561 7.074-5.561 3.807 0 7.101 1.808 7.668 6.047h-4.617c-.378-1.808-1.431-2.672-3.213-2.672-1.512 0-2.457.701-2.457 1.782ZM71.246 38.968h-4.13V18.474h4.13v1.512c.892-1.268 2.133-1.97 3.645-1.97 3.753 0 6.102 2.943 6.102 7.695 0 4.94-2.402 7.721-6.102 7.721-1.538 0-2.78-.648-3.645-1.89v7.425Zm2.782-17.605c-1.837 0-2.782 1.54-2.782 4.348s.973 4.373 2.782 4.373c1.781 0 2.726-1.538 2.726-4.373 0-2.808-.972-4.348-2.727-4.348ZM82.633 33V13.56h4.131v6.832c.945-1.62 2.43-2.377 4.212-2.377 2.781 0 4.86 1.701 4.86 5.293V33h-4.13v-8.856c0-1.837-.73-2.782-2.242-2.782-1.647 0-2.7 1.431-2.7 3.294v8.344h-4.13ZM111.787 28.221c-.756 3.349-3.456 5.211-7.02 5.211-4.509 0-7.29-2.916-7.29-7.695 0-4.94 2.808-7.721 7.128-7.721 4.347 0 7.074 2.889 7.074 7.64v.919h-9.99c.216 2.322 1.296 3.564 3.078 3.564 1.35 0 2.268-.595 2.7-1.918h4.32Zm-7.182-6.912c-1.539 0-2.511 1-2.835 2.89h5.643c-.324-1.89-1.296-2.89-2.808-2.89ZM113.405 33V18.475h4.131V20.5c.918-1.729 2.322-2.485 3.807-2.485.594 0 1.134.162 1.431.46v3.482a7.39 7.39 0 0 0-1.647-.162c-2.484 0-3.591 1.404-3.591 3.7V33h-4.131ZM132.796 26.817v-8.343h4.131v14.527h-4.131v-1.944c-.945 1.62-2.376 2.375-4.131 2.375-2.754 0-4.779-1.674-4.779-5.292v-9.666h4.131v8.83c0 1.863.702 2.78 2.16 2.78 1.593 0 2.619-1.404 2.619-3.267ZM139.193 33V13.56h4.131V33h-4.131ZM159.25 28.221c-.756 3.349-3.456 5.211-7.02 5.211-4.509 0-7.29-2.916-7.29-7.695 0-4.94 2.808-7.721 7.128-7.721 4.347 0 7.074 2.889 7.074 7.64v.919h-9.99c.216 2.322 1.296 3.564 3.078 3.564 1.35 0 2.268-.595 2.7-1.918h4.32Zm-7.182-6.912c-1.539 0-2.511 1-2.835 2.89h5.643c-.324-1.89-1.296-2.89-2.808-2.89Z" />
		</g>
	</svg>
);
const ForwardRef = forwardRef(SvgComponent);
export { ForwardRef as LogoDark };
