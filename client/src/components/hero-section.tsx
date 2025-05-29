import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function HeroSection() {
  return (
    <section className="relative batik-gradient text-white py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')] bg-cover bg-center" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Discover Authentic Indonesian Traditional Crafts as NFTs
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Empowering artisans to showcase and sell their beautiful batik patterns, wood sculptures, and traditional crafts on the blockchain. Built on ICP for fast, sustainable transactions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/explore">
                <Button className="bg-batik-gold text-batik-brown px-8 py-3 rounded-lg font-semibold hover:bg-batik-gold/90 transition-colors">
                  Explore Collection
                </Button>
              </Link>
              <Link href="/create">
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-batik-brown transition-colors"
                >
                  Create NFT
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
              alt="Beautiful traditional Indonesian batik with intricate patterns" 
              className="rounded-xl shadow-lg w-full h-48 object-cover image-hover"
            />
            <img 
              src="https://images.unsplash.com/photo-1578912996078-305d92249aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
              alt="Intricate Indonesian wood sculpture with traditional motifs" 
              className="rounded-xl shadow-lg w-full h-48 object-cover image-hover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
