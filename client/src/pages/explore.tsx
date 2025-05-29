import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { NFTCard } from "@/components/nft-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { NFTWithDetails } from "@shared/schema";

export default function Explore() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Parse URL search params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location]);

  const { data: nfts, isLoading } = useQuery<NFTWithDetails[]>({
    queryKey: ["/api/nfts", { category: category === "all" ? undefined : category, search: searchQuery || undefined }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category !== "all") params.append('category', category);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/nfts?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch NFTs');
      return response.json();
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search params
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (category !== "all") params.append('category', category);
    setLocation(`/explore?${params.toString()}`);
  };

  const sortedNFTs = nfts ? [...nfts].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price_high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "recent":
      default:
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    }
  }) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Explore NFTs
          </h1>
          <p className="text-xl text-gray-600">
            Discover authentic Indonesian traditional crafts as digital collectibles
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search NFTs, artists, or collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </form>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="batik">Batik</SelectItem>
                  <SelectItem value="wood_sculpture">Wood Sculptures</SelectItem>
                  <SelectItem value="textile">Textiles</SelectItem>
                  <SelectItem value="mask">Traditional Masks</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Listed</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-6">
            <p className="text-gray-600">
              {sortedNFTs.length} NFT{sortedNFTs.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
              {category !== "all" && ` in ${category}`}
            </p>
          </div>
        )}

        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Skeleton className="w-full h-64" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex justify-between mb-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))
          ) : sortedNFTs.length > 0 ? (
            sortedNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No NFTs Found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 
                    `No NFTs match your search for "${searchQuery}"` : 
                    "No NFTs available in this category"
                  }
                </p>
              </div>
              {(searchQuery || category !== "all") && (
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setCategory("all");
                    setLocation("/explore");
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Load More (if needed) */}
        {!isLoading && sortedNFTs.length > 0 && sortedNFTs.length % 12 === 0 && (
          <div className="text-center mt-12">
            <Button className="bg-batik-brown text-white px-8 py-3 rounded-lg font-semibold hover:bg-batik-brown/90 transition-colors">
              Load More NFTs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
