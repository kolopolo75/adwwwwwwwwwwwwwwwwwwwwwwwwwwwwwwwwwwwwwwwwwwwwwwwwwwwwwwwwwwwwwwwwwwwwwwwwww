import { 
  Product, InsertProduct, 
  Client, InsertClient,
  Order, InsertOrder,
  User, InsertUser,
  products, clients, orders, users
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Clients
  getAllClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: InsertClient): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  
  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: InsertOrder): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  
  // Users and Authentication
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(username: string, password: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<boolean>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  isAdmin(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Products
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: InsertProduct): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const deleted = await db.delete(products).where(eq(products.id, id));
    return deleted.count > 0;
  }

  // Clients
  async getAllClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: number, client: InsertClient): Promise<Client | undefined> {
    const [updatedClient] = await db
      .update(clients)
      .set(client)
      .where(eq(clients.id, id))
      .returning();
    return updatedClient;
  }

  async deleteClient(id: number): Promise<boolean> {
    const deleted = await db.delete(clients).where(eq(clients.id, id));
    return deleted.count > 0;
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values({
        ...order,
        paymentStatus: order.paymentStatus || "Pendente",
      })
      .returning();
    return newOrder;
  }

  async updateOrder(id: number, order: InsertOrder): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set(order)
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<boolean> {
    const deleted = await db.delete(orders).where(eq(orders.id, id));
    return deleted.count > 0;
  }

  // User methods
  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    const [newUser] = await db
      .insert(users)
      .values({
        ...user,
        password: hashedPassword,
      })
      .returning();
    
    return newUser;
  }

  async validateUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    
    if (!user) return undefined;
    
    const isValid = await bcrypt.compare(password, user.password);
    
    return isValid ? user : undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async deleteUser(id: number): Promise<boolean> {
    const deleted = await db.delete(users).where(eq(users.id, id));
    return deleted.count > 0;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    // Se estiver atualizando a senha, precisamos fazer o hash
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }

  async isAdmin(id: number): Promise<boolean> {
    const user = await this.getUserById(id);
    return user?.isAdmin || false;
  }
}

export const storage = new DatabaseStorage();
