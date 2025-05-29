import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, getCategoryDisplayName } from "@/lib/utils";
import type { NFTWithDetails } from "@shared/schema";

interface NFTCardProps {
  nft: NFTWithDetails;
  onPurchase?: (nftId: number) => void;
}

export function NFTCard({ nft, onPurchase }: NFTCardProps) {
  const { toast } = useToast();

  const handleBuyNow = async () => {
    try {
      if (onPurchase) {
        onPurchase(nft.id);
      } else {
        // Mock purchase simulation
        toast({
          title: "🎉 Purchase Simulation",
          description: "This would initiate a blockchain transaction on ICP network.",
        });
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Unable to process purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover group hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden">
        <img 
          src={nft.image} 
          alt={nft.name}
          className="w-full h-72 object-cover image-hover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 text-gray-800 border-0 shadow-sm backdrop-blur-sm">
            {getCategoryDisplayName(nft.category)}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-1">{nft.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{nft.description}</p>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <img 
                src={nft.creator.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${nft.creator.username}`}
                alt={nft.creator.displayName}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">@{nft.creator.username}</span>
              {nft.creator.isVerified && (
                <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  ✓
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Current Price</span>
              <span className="text-2xl font-bold text-batik-brown">
                {formatPrice(nft.price, nft.currency)}
              </span>
            </div>
            <Button 
              onClick={handleBuyNow}
              className="bg-batik-brown text-white px-6 py-2.5 rounded-xl font-medium hover:bg-batik-brown/90 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
