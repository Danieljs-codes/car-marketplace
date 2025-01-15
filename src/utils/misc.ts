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

export const formatCurrency = ({
	amount,
	isKobo = false,
}: { amount: number; isKobo?: boolean }) => {
	const formatter = new NumberFormatter("en-NG", {
		style: "currency",
		currency: "NGN",
	});

	const finalAmount = isKobo ? koboToNaira(amount) : amount;
	return formatter.format(finalAmount);
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

export type OrderStatus = "completed" | "cancelled";

export const getOrderStatusBadgeIntent = (orderStatus: OrderStatus) => {
	if (orderStatus === "completed") {
		return "success";
	}
	if (orderStatus === "cancelled") {
		return "danger";
	}
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

export const koboToNaira = (amount: number) => amount / 100;

export const validCarCategories = [
	"sedan",
	"coupe",
	"suv",
	"crossover",
	"wagon/hatchback",
	"green car/hybrid",
	"convertible",
	"sports car",
	"pickup truck",
	"minivan/van",
	"luxury car",
] as const;
