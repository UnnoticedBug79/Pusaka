import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { CollectionWithDetails } from "@shared/schema";

interface CollectionCardProps {
  collection: CollectionWithDetails;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Card className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden">
        <img 
          src={collection.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop'} 
          alt={collection.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
            <div className="flex items-center space-x-2">
              <img 
                src={collection.creator.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${collection.creator.username}`}
                alt={collection.creator.displayName}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-medium text-gray-800">@{collection.creator.username}</span>
              {collection.creator.isVerified && (
                <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  ✓
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              {collection.name}
            </h3>
            <p className="text-gray-600 leading-relaxed">{collection.description}</p>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">{collection.itemCount}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Items</span>
              </div>
              {collection.floorPrice && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-batik-brown">{formatPrice(collection.floorPrice)}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Floor Price</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
