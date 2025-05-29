import { useQuery } from "@tanstack/react-query";
import { ArtistCard } from "@/components/artist-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserWithStats } from "@shared/schema";

export default function Artists() {
  const { data: artists, isLoading } = useQuery<UserWithStats[]>({
    queryKey: ["/api/users"],
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Featured Artists
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the master craftsmen preserving Indonesian traditions through their beautiful NFT collections. 
            These verified artists bring centuries of cultural heritage to the digital world.
          </p>
        </div>

        {/* Artist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center">
                  <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-48 mx-auto mb-2" />
                  <Skeleton className="h-4 w-32 mx-auto mb-4" />
                  <Skeleton className="h-12 w-full mb-4" />
                  <div className="flex justify-center space-x-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            ))
          ) : artists && artists.length > 0 ? (
            artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Artists Found</h3>
                <p className="text-gray-500">
                  There are currently no artists available. Please check back later.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Artist Categories */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Artist Specializations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-warm-cream rounded-lg">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-semibold text-batik-brown mb-2">Batik Masters</h3>
              <p className="text-sm text-gray-600">Traditional Indonesian textile artists creating intricate wax-resist patterns</p>
            </div>
            <div className="text-center p-6 bg-warm-cream rounded-lg">
              <div className="text-3xl mb-3">🪵</div>
              <h3 className="font-semibold text-batik-brown mb-2">Wood Carvers</h3>
              <p className="text-sm text-gray-600">Skilled artisans creating beautiful sculptures from Indonesian hardwoods</p>
            </div>
            <div className="text-center p-6 bg-warm-cream rounded-lg">
              <div className="text-3xl mb-3">🧵</div>
              <h3 className="font-semibold text-batik-brown mb-2">Textile Weavers</h3>
              <p className="text-sm text-gray-600">Heritage keepers preserving traditional Indonesian weaving techniques</p>
            </div>
            <div className="text-center p-6 bg-warm-cream rounded-lg">
              <div className="text-3xl mb-3">🎭</div>
              <h3 className="font-semibold text-batik-brown mb-2">Mask Makers</h3>
              <p className="text-sm text-gray-600">Traditional theater mask creators for wayang and cultural performances</p>
            </div>
          </div>
        </div>

        {/* Artist Statistics */}
        <div className="mt-12 bg-batik-gradient text-white rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Community Impact
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-batik-gold mb-2">
                  {artists?.length || 0}
                </div>
                <div className="text-sm opacity-90">Verified Artists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-batik-gold mb-2">
                  {artists?.reduce((sum, artist) => sum + artist.nftCount, 0) || 0}
                </div>
                <div className="text-sm opacity-90">NFTs Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-batik-gold mb-2">
                  {artists?.reduce((sum, artist) => sum + artist.followersCount, 0).toLocaleString() || 0}
                </div>
                <div className="text-sm opacity-90">Total Followers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-batik-gold mb-2">
                  {artists?.reduce((sum, artist) => sum + artist.collectionsCount, 0) || 0}
                </div>
                <div className="text-sm opacity-90">Collections</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
