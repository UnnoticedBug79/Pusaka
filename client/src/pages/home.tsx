import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Upload, Coins, Store } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { NFTCard } from "@/components/nft-card";
import { CollectionCard } from "@/components/collection-card";
import { ArtistCard } from "@/components/artist-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { NFTWithDetails, CollectionWithDetails, UserWithStats } from "@shared/schema";

export default function Home() {
  const { data: collections, isLoading: collectionsLoading } = useQuery<CollectionWithDetails[]>({
    queryKey: ["/api/collections"],
  });

  const { data: nfts, isLoading: nftsLoading } = useQuery<NFTWithDetails[]>({
    queryKey: ["/api/nfts"],
  });

  const { data: artists, isLoading: artistsLoading } = useQuery<UserWithStats[]>({
    queryKey: ["/api/users"],
  });

  const featuredNFTs = nfts?.slice(0, 4) || [];
  const featuredCollections = collections?.slice(0, 3) || [];
  const featuredArtists = artists?.slice(0, 3) || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Collections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Featured Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Curated traditional Indonesian crafts from master artisans preserving centuries of cultural heritage</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collectionsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <Skeleton className="w-full h-56" />
                  <div className="p-6">
                    <Skeleton className="h-7 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-6" />
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              featuredCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* NFT Marketplace Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-16 text-center lg:text-left">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Explore NFTs
              </h2>
              <p className="text-xl text-gray-600">Discover authentic traditional Indonesian crafts as digital collectibles</p>
            </div>
            <Link href="/explore">
              <Button className="bg-batik-brown text-white hover:bg-batik-brown/90 px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 mt-6 lg:mt-0">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {nftsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <Skeleton className="w-full h-72" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex justify-between mb-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <Skeleton className="h-3 w-16 mb-1" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              featuredNFTs.map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
              ))
            )}
          </div>

          <div className="text-center mt-16">
            <Link href="/explore">
              <Button className="bg-batik-brown text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-batik-brown/90 transition-all duration-200 shadow-sm hover:shadow-md">
                Load More NFTs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Featured Artists
            </h2>
            <p className="text-xl text-gray-600">Meet the master craftsmen preserving Indonesian traditions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artistsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-48 mx-auto mb-2" />
                  <Skeleton className="h-4 w-32 mx-auto mb-4" />
                  <div className="flex justify-center space-x-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))
            ) : (
              featuredArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/artists">
              <Button className="bg-batik-brown text-white hover:bg-batik-brown/90">
                View All Artists <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Create NFT Section */}
      <section className="py-16 batik-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Become a Featured Artist
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Share your traditional Indonesian crafts with the world. Mint your artwork as NFTs and join our community of cultural preservationists.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-4">
                <Upload className="h-12 w-12 mx-auto mb-3" />
                <h3 className="font-semibold">Upload Your Art</h3>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-4">
                <Coins className="h-12 w-12 mx-auto mb-3" />
                <h3 className="font-semibold">Mint NFT</h3>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-4">
                <Store className="h-12 w-12 mx-auto mb-3" />
                <h3 className="font-semibold">List for Sale</h3>
              </div>
            </div>
          </div>
          <Link href="/create">
            <Button className="bg-batik-gold text-batik-brown px-8 py-3 rounded-lg font-bold text-lg hover:bg-batik-gold/90 transition-colors">
              Start Creating
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-batik-gold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Pusaka
              </h3>
              <p className="text-gray-400 mb-4">
                Preserving Indonesian traditional crafts through blockchain technology on the Internet Computer Protocol.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/explore" className="hover:text-white transition-colors">Explore NFTs</Link></li>
                <li><Link href="/explore" className="hover:text-white transition-colors">Collections</Link></li>
                <li><Link href="/artists" className="hover:text-white transition-colors">Artists</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><Link href="/create" className="hover:text-white transition-colors">Creator Guide</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Pusaka. Built with ❤️ for Indonesian traditional crafts. Running on Internet Computer Protocol.
              </p>
              <div className="mt-4 md:mt-0">
                <p className="text-gray-400 text-sm">
                  Developed by Team <strong className="text-batik-gold">unnoticedbug79</strong>
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  M Raffi Firdaus, Hari Hardiyan, M Akbar
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
