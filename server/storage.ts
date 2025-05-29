import { 
  users, 
  collections, 
  nfts, 
  transactions,
  type User, 
  type InsertUser,
  type Collection,
  type InsertCollection,
  type NFT,
  type InsertNFT,
  type Transaction,
  type InsertTransaction,
  type NFTWithDetails,
  type CollectionWithDetails,
  type UserWithStats
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Collections
  getCollection(id: number): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  getAllCollections(): Promise<CollectionWithDetails[]>;
  getCollectionsByCreator(creatorId: number): Promise<Collection[]>;
  
  // NFTs
  getNFT(id: number): Promise<NFT | undefined>;
  createNFT(nft: InsertNFT): Promise<NFT>;
  getAllNFTs(): Promise<NFTWithDetails[]>;
  getNFTsByCategory(category: string): Promise<NFTWithDetails[]>;
  getNFTsByCreator(creatorId: number): Promise<NFT[]>;
  getNFTsByCollection(collectionId: number): Promise<NFT[]>;
  searchNFTs(query: string): Promise<NFTWithDetails[]>;
  updateNFTOwner(nftId: number, newOwnerId: number): Promise<void>;
  
  // Transactions
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUser(userId: number): Promise<Transaction[]>;
  updateTransactionStatus(id: number, status: string, hash?: string): Promise<void>;
  
  // Statistics
  getUserStats(userId: number): Promise<UserWithStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private collections: Map<number, Collection>;
  private nfts: Map<number, NFT>;
  private transactions: Map<number, Transaction>;
  
  private currentUserId: number;
  private currentCollectionId: number;
  private currentNftId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.collections = new Map();
    this.nfts = new Map();
    this.transactions = new Map();
    
    this.currentUserId = 1;
    this.currentCollectionId = 1;
    this.currentNftId = 1;
    this.currentTransactionId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Create sample users (artists)
    const artists: InsertUser[] = [
      {
        username: "pak_sugeng",
        displayName: "Pak Sugeng Wijaya",
        bio: "Master Batik Artist from Solo with 40+ years of traditional batik experience",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        isVerified: true,
        walletAddress: "0x1234567890abcdef",
        followersCount: 5200,
      },
      {
        username: "made_artist",
        displayName: "Made Sutrisna",
        bio: "Wood Carving Master from Bali, traditional Balinese sculpture specialist",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        isVerified: true,
        walletAddress: "0x2345678901bcdef1",
        followersCount: 3800,
      },
      {
        username: "ibu_sari",
        displayName: "Ibu Sari Lestari",
        bio: "Textile Heritage Keeper specializing in traditional weaving patterns",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        isVerified: true,
        walletAddress: "0x3456789012cdef12",
        followersCount: 7100,
      },
      {
        username: "dalang_jaya",
        displayName: "Dalang Jaya",
        bio: "Traditional theater mask creator preserving Javanese wayang culture",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        isVerified: true,
        walletAddress: "0x4567890123def123",
        followersCount: 2900,
      }
    ];

    artists.forEach(artist => this.createUser(artist));

    // Create collections
    const collectionsData: InsertCollection[] = [
      {
        name: "Royal Javanese Batik",
        description: "Traditional royal patterns from Central Java",
        image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop",
        creatorId: 1,
        floorPrice: "0.5",
      },
      {
        name: "Balinese Wood Art",
        description: "Hand-carved sculptures from Bali masters",
        image: "https://images.unsplash.com/photo-1578912996078-305d92249aa6?w=600&h=400&fit=crop",
        creatorId: 2,
        floorPrice: "1.2",
      },
      {
        name: "Heritage Textiles",
        description: "Woven treasures from across Indonesia",
        image: "https://images.unsplash.com/photo-1615887990450-4a4c1b9b8e0c?w=600&h=400&fit=crop",
        creatorId: 3,
        floorPrice: "0.8",
      }
    ];

    collectionsData.forEach(collection => this.createCollection(collection));

    // Create NFTs
    const nftsData: InsertNFT[] = [
      {
        name: "Megamendung #001",
        description: "Classic cloud pattern batik from Cirebon tradition, hand-drawn with traditional canting",
        image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=600&fit=crop",
        price: "2.5",
        category: "batik",
        creatorId: 1,
        ownerId: 1,
        collectionId: 1,
        metadata: JSON.stringify({ origin: "Cirebon", technique: "Traditional Canting", year: "2024" }),
      },
      {
        name: "Garuda Sculpture",
        description: "Hand-carved Balinese Garuda sculpture representing Indonesian national symbol",
        image: "https://images.unsplash.com/photo-1578912996078-305d92249aa6?w=600&h=600&fit=crop",
        price: "5.2",
        category: "wood_sculpture",
        creatorId: 2,
        ownerId: 2,
        collectionId: 2,
        metadata: JSON.stringify({ wood_type: "Hibiscus", height: "45cm", style: "Traditional Balinese" }),
      },
      {
        name: "Parang Kusuma",
        description: "Royal diagonal pattern batik, traditionally worn by Javanese nobility",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop",
        price: "3.8",
        category: "batik",
        creatorId: 1,
        ownerId: 1,
        collectionId: 1,
        metadata: JSON.stringify({ origin: "Solo", royal_grade: "High", pattern_meaning: "Flowering Knife" }),
      },
      {
        name: "Topeng Wayang",
        description: "Traditional Javanese theater mask used in wayang performances",
        image: "https://images.unsplash.com/photo-1596874047117-68fec3060b2a?w=600&h=600&fit=crop",
        price: "1.9",
        category: "mask",
        creatorId: 4,
        ownerId: 4,
        metadata: JSON.stringify({ character: "Arjuna", material: "Pule wood", age: "Contemporary" }),
      },
      {
        name: "Kawung Pattern",
        description: "Sacred four-circle motif representing the four cardinal directions",
        image: "https://images.unsplash.com/photo-1617480355948-0c0c06117d98?w=600&h=600&fit=crop",
        price: "2.8",
        category: "batik",
        creatorId: 1,
        ownerId: 1,
        collectionId: 1,
        metadata: JSON.stringify({ sacred_meaning: "Universe harmony", origin: "Yogyakarta" }),
      },
      {
        name: "Barong Lion",
        description: "Balinese mythical lion sculpture for protection and good fortune",
        image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=600&fit=crop",
        price: "4.5",
        category: "wood_sculpture",
        creatorId: 2,
        ownerId: 2,
        collectionId: 2,
        metadata: JSON.stringify({ purpose: "Temple guardian", wood_type: "Sandalwood" }),
      }
    ];

    nftsData.forEach(nft => this.createNFT(nft));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      followersCount: insertUser.followersCount || 0,
      isVerified: insertUser.isVerified || false,
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Collection methods
  async getCollection(id: number): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = this.currentCollectionId++;
    const collection: Collection = { 
      ...insertCollection, 
      id,
      createdAt: new Date(),
      itemCount: 0,
    };
    this.collections.set(id, collection);
    return collection;
  }

  async getAllCollections(): Promise<CollectionWithDetails[]> {
    const collections = Array.from(this.collections.values());
    return await Promise.all(collections.map(async collection => {
      const creator = await this.getUser(collection.creatorId!);
      const nfts = await this.getNFTsByCollection(collection.id);
      return {
        ...collection,
        creator: creator!,
        nfts,
      };
    }));
  }

  async getCollectionsByCreator(creatorId: number): Promise<Collection[]> {
    return Array.from(this.collections.values()).filter(
      collection => collection.creatorId === creatorId
    );
  }

  // NFT methods
  async getNFT(id: number): Promise<NFT | undefined> {
    return this.nfts.get(id);
  }

  async createNFT(insertNft: InsertNFT): Promise<NFT> {
    const id = this.currentNftId++;
    const nft: NFT = { 
      ...insertNft, 
      id,
      createdAt: new Date(),
      tokenId: `PUS-${id.toString().padStart(6, '0')}`,
      isListed: insertNft.isListed !== false,
      currency: insertNft.currency || "ICP",
    };
    this.nfts.set(id, nft);
    
    // Update collection item count
    if (nft.collectionId) {
      const collection = this.collections.get(nft.collectionId);
      if (collection) {
        collection.itemCount = (collection.itemCount || 0) + 1;
        this.collections.set(nft.collectionId, collection);
      }
    }
    
    return nft;
  }

  async getAllNFTs(): Promise<NFTWithDetails[]> {
    const nfts = Array.from(this.nfts.values()).filter(nft => nft.isListed);
    return await Promise.all(nfts.map(async nft => {
      const creator = await this.getUser(nft.creatorId!);
      const owner = await this.getUser(nft.ownerId!);
      const collection = nft.collectionId ? await this.getCollection(nft.collectionId) : undefined;
      return {
        ...nft,
        creator: creator!,
        owner: owner!,
        collection,
      };
    }));
  }

  async getNFTsByCategory(category: string): Promise<NFTWithDetails[]> {
    const nfts = Array.from(this.nfts.values()).filter(
      nft => nft.category === category && nft.isListed
    );
    return await Promise.all(nfts.map(async nft => {
      const creator = await this.getUser(nft.creatorId!);
      const owner = await this.getUser(nft.ownerId!);
      const collection = nft.collectionId ? await this.getCollection(nft.collectionId) : undefined;
      return {
        ...nft,
        creator: creator!,
        owner: owner!,
        collection,
      };
    }));
  }

  async getNFTsByCreator(creatorId: number): Promise<NFT[]> {
    return Array.from(this.nfts.values()).filter(nft => nft.creatorId === creatorId);
  }

  async getNFTsByCollection(collectionId: number): Promise<NFT[]> {
    return Array.from(this.nfts.values()).filter(nft => nft.collectionId === collectionId);
  }

  async searchNFTs(query: string): Promise<NFTWithDetails[]> {
    const lowercaseQuery = query.toLowerCase();
    const nfts = Array.from(this.nfts.values()).filter(nft => 
      nft.isListed && (
        nft.name.toLowerCase().includes(lowercaseQuery) ||
        nft.description.toLowerCase().includes(lowercaseQuery) ||
        nft.category.toLowerCase().includes(lowercaseQuery)
      )
    );
    
    return await Promise.all(nfts.map(async nft => {
      const creator = await this.getUser(nft.creatorId!);
      const owner = await this.getUser(nft.ownerId!);
      const collection = nft.collectionId ? await this.getCollection(nft.collectionId) : undefined;
      return {
        ...nft,
        creator: creator!,
        owner: owner!,
        collection,
      };
    }));
  }

  async updateNFTOwner(nftId: number, newOwnerId: number): Promise<void> {
    const nft = this.nfts.get(nftId);
    if (nft) {
      nft.ownerId = newOwnerId;
      this.nfts.set(nftId, nft);
    }
  }

  // Transaction methods
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      createdAt: new Date(),
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      status: insertTransaction.status || "pending",
      currency: insertTransaction.currency || "ICP",
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      tx => tx.fromUserId === userId || tx.toUserId === userId
    );
  }

  async updateTransactionStatus(id: number, status: string, hash?: string): Promise<void> {
    const transaction = this.transactions.get(id);
    if (transaction) {
      transaction.status = status;
      if (hash) transaction.transactionHash = hash;
      this.transactions.set(id, transaction);
    }
  }

  // Statistics
  async getUserStats(userId: number): Promise<UserWithStats> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const nftCount = Array.from(this.nfts.values()).filter(nft => nft.creatorId === userId).length;
    const collectionsCount = Array.from(this.collections.values()).filter(col => col.creatorId === userId).length;
    
    return {
      ...user,
      nftCount,
      collectionsCount,
    };
  }
}

export const storage = new MemStorage();
