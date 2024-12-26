import { NumberFormatter } from "@internationalized/number";
export const getAvatarInitials = (name: string) => {
	const [firstName, lastName] = name.split(" ");

	if (firstName[0].toLowerCase() === lastName[0].toLowerCase()) {
		return firstName[0].toUpperCase();
	}

	return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
};

const pickFunc = <T extends {}, K extends keyof T>(
	obj: T,
	predicate: (k: string) => boolean,
): Pick<T, K> =>
	Object.keys(obj)
		.filter(predicate)
		.reduce(
			(filteredObj: Pick<T, K>, key) => ({
				// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
				...filteredObj,
				[key]: obj[key as keyof T],
			}),
			{} as Pick<T, K>,
		);

// filters an object based on an array of keys
export const pick = <T extends {}, K extends keyof T>(
	obj: T,
	keys: Array<K>,
): Pick<T, K> => pickFunc(obj, (k) => keys.includes(k as K));

// filters an object based on an array of keys
export const omit = <T extends {}, K extends keyof T>(
	obj: T,
	keys: Array<K>,
): Pick<T, K> => pickFunc(obj, (k) => !keys.includes(k as K));

export const formatCurrency = (amount: number) => {
	const formatter = new NumberFormatter("en-NG", {
		style: "currency",
		currency: "NGN",
	});

	return formatter.format(amount);
};

export type ListingStatus = "active" | "sold" | "expired";

export const getBadgeIntent = (listingStatus: ListingStatus) => {
	if (listingStatus === "active") {
		return "success";
	}
	if (listingStatus === "sold") {
		return "danger";
	}
	return "warning";
};

export const carConditionEnum = [
	"new",
	"used",
	"refurbished",
	"damaged",
	"for-parts",
] as const;

export const kebabToSentence = (str: string) =>
	str
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
