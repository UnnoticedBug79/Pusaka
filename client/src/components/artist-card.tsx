import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAddress } from "@/lib/utils";
import type { UserWithStats } from "@shared/schema";

interface ArtistCardProps {
  artist: UserWithStats;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Card className="text-center group card-hover">
      <CardContent className="p-6">
        <div className="relative mb-4">
          <img 
            src={artist.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${artist.username}`}
            alt={artist.displayName}
            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-batik-gold image-hover"
          />
          {artist.isVerified && (
            <Badge 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-forest-green text-white"
            >
              Verified
            </Badge>
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          {artist.displayName}
        </h3>
        
        <p className="text-gray-600 mb-3 text-sm">{artist.bio}</p>
        
        {artist.walletAddress && (
          <p className="text-xs text-gray-500 mb-4 font-mono">
            {formatAddress(artist.walletAddress)}
          </p>
        )}
        
        <div className="flex justify-center space-x-4 text-sm">
          <Badge variant="secondary" className="bg-warm-cream text-batik-brown">
            {artist.nftCount} NFTs
          </Badge>
          <Badge variant="secondary" className="bg-warm-cream text-batik-brown">
            {artist.followersCount.toLocaleString()} followers
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
