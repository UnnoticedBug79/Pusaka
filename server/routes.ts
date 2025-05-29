import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertNftSchema, 
  insertUserSchema, 
  insertCollectionSchema, 
  insertTransactionSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // NFT routes
  app.get("/api/nfts", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let nfts;
      if (search) {
        nfts = await storage.searchNFTs(search as string);
      } else if (category) {
        nfts = await storage.getNFTsByCategory(category as string);
      } else {
        nfts = await storage.getAllNFTs();
      }
      
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch NFTs" });
    }
  });

  app.get("/api/nfts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const nft = await storage.getNFT(id);
      
      if (!nft) {
        return res.status(404).json({ error: "NFT not found" });
      }
      
      const creator = await storage.getUser(nft.creatorId!);
      const owner = await storage.getUser(nft.ownerId!);
      const collection = nft.collectionId ? await storage.getCollection(nft.collectionId) : undefined;
      
      res.json({
        ...nft,
        creator,
        owner,
        collection,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch NFT" });
    }
  });

  app.post("/api/nfts", async (req, res) => {
    try {
      const validatedData = insertNftSchema.parse(req.body);
      const nft = await storage.createNFT(validatedData);
      res.status(201).json(nft);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid NFT data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create NFT" });
    }
  });

  // Collections routes
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getAllCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collections" });
    }
  });

  app.get("/api/collections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const collection = await storage.getCollection(id);
      
      if (!collection) {
        return res.status(404).json({ error: "Collection not found" });
      }
      
      const creator = await storage.getUser(collection.creatorId!);
      const nfts = await storage.getNFTsByCollection(id);
      
      res.json({
        ...collection,
        creator,
        nfts,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collection" });
    }
  });

  app.post("/api/collections", async (req, res) => {
    try {
      const validatedData = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(validatedData);
      res.status(201).json(collection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid collection data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create collection" });
    }
  });

  // Users/Artists routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userStats = await storage.getUserStats(id);
      res.json(userStats);
    } catch (error) {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.get("/api/users/:id/nfts", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const nfts = await storage.getNFTsByCreator(id);
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user NFTs" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid user data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Transaction routes (Mock blockchain)
  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      
      // Create transaction
      const transaction = await storage.createTransaction(validatedData);
      
      // Simulate blockchain processing
      setTimeout(async () => {
        try {
          // Mock successful transaction
          await storage.updateTransactionStatus(
            transaction.id, 
            "completed", 
            `0x${Math.random().toString(16).substr(2, 64)}`
          );
          
          // Update NFT ownership
          if (transaction.nftId) {
            await storage.updateNFTOwner(transaction.nftId, transaction.toUserId!);
          }
        } catch (error) {
          console.error("Transaction processing failed:", error);
          await storage.updateTransactionStatus(transaction.id, "failed");
        }
      }, 2000); // 2 second delay to simulate blockchain confirmation
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transactions = await storage.getTransactionsByUser(id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // Mock blockchain status endpoint
  app.get("/api/blockchain/status", async (req, res) => {
    res.json({
      network: "Internet Computer Protocol (ICP)",
      status: "active",
      blockHeight: Math.floor(Math.random() * 1000000) + 500000,
      gasPrice: "0.0001 ICP",
      lastBlock: new Date().toISOString(),
    });
  });

  // Mock wallet connection
  app.post("/api/wallet/connect", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      
      // Mock wallet validation
      res.json({
        connected: true,
        address: walletAddress,
        balance: (Math.random() * 100).toFixed(2) + " ICP",
        network: "ICP Mainnet",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to connect wallet" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
