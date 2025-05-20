import { pgTable, text, serial, integer, date, numeric, timestamp, boolean, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  price: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Client schema
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
});

export const insertClientSchema = createInsertSchema(clients).pick({
  name: true,
  phone: true,
  address: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// Order schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  orderDate: date("order_date").notNull().defaultNow(),
  status: text("status").notNull().default("Em Produção"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("Pendente"),
  amountPaid: numeric("amount_paid", { precision: 10, scale: 2 }).default("0"),
  remainingAmount: numeric("remaining_amount", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  clientId: true,
  productId: true,
  quantity: true,
  orderDate: true,
  status: true,
  total: true,
  paymentStatus: true,
  amountPaid: true,
  remainingAmount: true,
});

export const orderStatuses = ["Em Produção", "Finalizado", "Cancelado"] as const;
export const paymentStatuses = ["Pendente", "Pagamento Parcial", "Pago 100%"] as const;

export const orderSchema = insertOrderSchema.extend({
  status: z.enum(orderStatuses),
  paymentStatus: z.enum(paymentStatuses),
  orderDate: z.coerce.date(),
});

export type InsertOrder = z.infer<typeof orderSchema>;
export type Order = typeof orders.$inferSelect;

// Tabela de sessões para autenticação
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Tabela de usuários
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  isAdmin: true,
});

export const userSchema = insertUserSchema.extend({
  username: z.string().min(3, "Usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  isAdmin: z.boolean().default(false),
});

export type InsertUser = z.infer<typeof userSchema>;
export type User = typeof users.$inferSelect;
