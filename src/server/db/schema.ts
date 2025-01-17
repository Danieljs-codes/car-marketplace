import {
	bigint,
	boolean,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { createId as cuid } from "@paralleldrive/cuid2";

export const listingStatusEnum = pgEnum("listing_status", [
	"active",
	"sold",
	"expired",
]);
export const transmissionTypeEnum = pgEnum("transmission_type", [
	"automatic",
	"manual",
]);
export const fuelTypeEnum = pgEnum("fuel_type", [
	"petrol",
	"diesel",
	"electric",
	"hybrid",
]);

export const carCategoryEnum = pgEnum("car_category", [
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
]);

export const carConditionEnum = pgEnum("car_condition", [
	"new",
	"used",
	"certified-pre-owned",
	"damaged",
]);

export const usersTable = pgTable("users", {
	id: text().primaryKey(),
	name: text().notNull(),
	email: text().notNull().unique(),
	emailVerified: boolean().notNull(),
	image: text(),
	createdAt: timestamp().notNull(),
	updatedAt: timestamp().notNull(),
});

export const sessionsTable = pgTable("sessions", {
	id: text().primaryKey(),
	expiresAt: timestamp().notNull(),
	token: text().notNull().unique(),
	createdAt: timestamp().notNull(),
	updatedAt: timestamp().notNull(),
	ipAddress: text(),
	userAgent: text(),
	userId: text()
		.notNull()
		.references(() => usersTable.id),
});

export const accountsTable = pgTable("accounts", {
	id: text().primaryKey(),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: text()
		.notNull()
		.references(() => usersTable.id),
	accessToken: text(),
	refreshToken: text(),
	idToken: text(),
	accessTokenExpiresAt: timestamp(),
	refreshTokenExpiresAt: timestamp(),
	scope: text(),
	password: text(),
	createdAt: timestamp().notNull(),
	updatedAt: timestamp().notNull(),
});

export const verificationsTable = pgTable("verifications", {
	id: text().primaryKey(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp().notNull(),
	createdAt: timestamp(),
	updatedAt: timestamp(),
});

export const sellersTable = pgTable("sellers", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	businessName: text().notNull(),
	businessEmail: text().notNull(),
	businessPhoneNumber: text().notNull(),
	userId: text()
		.notNull()
		.references(() => usersTable.id),
	paystackSubaccountId: text().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
});

export const carListingsTable = pgTable("car_listings", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	sellerId: text()
		.notNull()
		.references(() => sellersTable.id),
	make: text().notNull(),
	model: text().notNull(),
	year: integer().notNull(),
	condition: carConditionEnum().notNull(),
	price: bigint({ mode: "number" }).notNull(), // Store price in Kobo using bigint
	mileage: text().notNull(),
	transmission: transmissionTypeEnum().notNull(),
	fuelType: fuelTypeEnum().notNull(),
	description: text(),
	category: carCategoryEnum().notNull(),
	status: listingStatusEnum().default("active").notNull(),
	images: jsonb()
		.$type<
			Array<{
				url: string;
				blurhash: string;
				key: string;
				name: string;
				size: number;
			}>
		>()
		.notNull(),
	location: text("location").notNull(),
	vin: text("vin"), // Vehicle Identification Number
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
});

// Favorites table
export const favoritesTable = pgTable("favorites", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	userId: text()
		.notNull()
		.references(() => usersTable.id),
	listingId: text()
		.notNull()
		.references(() => carListingsTable.id),
	createdAt: timestamp().defaultNow(),
});

export const orderStatusEnum = pgEnum("order_status", [
	"completed",
	"cancelled",
]);

export const ordersTable = pgTable("orders", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	buyerId: text()
		.notNull()
		.references(() => usersTable.id),
	listingId: text()
		.notNull()
		.references(() => carListingsTable.id),
	sellerId: text()
		.notNull()
		.references(() => sellersTable.id),
	amount: bigint({ mode: "number" }).notNull(), // in kobo
	status: orderStatusEnum().default("completed").notNull(),
	paystackReference: text().notNull(),
	paystackTransactionId: text().notNull(),
	paymentMetadata: jsonb().$type<{
		channel?: string;
		currency?: string;
		gatewayResponse?: string;
	}>(),
	metadata: jsonb().$type<{
		deliveryAddress?: string;
		additionalNotes?: string;
	}>(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
});

const schema = {
	users: usersTable,
	sessions: sessionsTable,
	accounts: accountsTable,
	verifications: verificationsTable,
	sellers: sellersTable,
	favorites: favoritesTable,
	carListings: carListingsTable,
	orders: ordersTable,
};

export default schema;
