import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  isVerified: boolean("is_verified").default(false),
  walletAddress: text("wallet_address"),
  followersCount: integer("followers_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  creatorId: integer("creator_id").references(() => users.id),
  floorPrice: decimal("floor_price", { precision: 10, scale: 2 }),
  itemCount: integer("item_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nfts = pgTable("nfts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("ICP"),
  category: text("category").notNull(), // "batik", "wood_sculpture", "textile", "mask"
  creatorId: integer("creator_id").references(() => users.id),
  ownerId: integer("owner_id").references(() => users.id),
  collectionId: integer("collection_id").references(() => collections.id),
  isListed: boolean("is_listed").default(true),
  tokenId: text("token_id").unique(),
  metadata: text("metadata"), // JSON string for additional properties
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  nftId: integer("nft_id").references(() => nfts.id),
  fromUserId: integer("from_user_id").references(() => users.id),
  toUserId: integer("to_user_id").references(() => users.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("ICP"),
  transactionHash: text("transaction_hash"),
  status: text("status").default("pending"), // "pending", "completed", "failed"
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  followersCount: true,
});

export const insertCollectionSchema = createInsertSchema(collections).omit({
  id: true,
  createdAt: true,
  itemCount: true,
});

export const insertNftSchema = createInsertSchema(nfts).omit({
  id: true,
  createdAt: true,
  tokenId: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  transactionHash: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

export type NFT = typeof nfts.$inferSelect;
export type InsertNFT = z.infer<typeof insertNftSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Extended types for API responses
export type NFTWithDetails = NFT & {
  creator: User;
  owner: User;
  collection?: Collection;
};

export type CollectionWithDetails = Collection & {
  creator: User;
  nfts?: NFT[];
};

export type UserWithStats = User & {
  nftCount: number;
  collectionsCount: number;
};
