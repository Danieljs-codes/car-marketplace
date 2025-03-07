import {
	type DependencyList,
	type EffectCallback,
	useEffect,
	useRef,
} from "react";

export function useDidUpdate(
	fn: EffectCallback,
	dependencies?: DependencyList,
) {
	const mounted = useRef(false);

	useEffect(
		() => () => {
			mounted.current = false;
		},
		[],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (mounted.current) {
			return fn();
		}

		mounted.current = true;
		return undefined;
	}, dependencies);
}
