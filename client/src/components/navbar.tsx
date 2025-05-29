import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const [location] = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      // Mock wallet connection
      const mockAddress = "0x1234567890abcdef1234567890abcdef12345678";
      
      const response = await fetch("/api/wallet/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: mockAddress }),
      });
      
      if (response.ok) {
        setIsConnected(true);
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to ICP network",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/explore?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const NavLinks = () => (
    <>
      <Link href="/">
        <Button 
          variant={location === "/" ? "default" : "ghost"} 
          className="text-sm font-medium"
        >
          Home
        </Button>
      </Link>
      <Link href="/explore">
        <Button 
          variant={location === "/explore" ? "default" : "ghost"} 
          className="text-sm font-medium"
        >
          Explore
        </Button>
      </Link>
      <Link href="/artists">
        <Button 
          variant={location === "/artists" ? "default" : "ghost"} 
          className="text-sm font-medium"
        >
          Artists
        </Button>
      </Link>
      <Link href="/create">
        <Button 
          variant={location === "/create" ? "default" : "ghost"} 
          className="text-sm font-medium"
        >
          Create
        </Button>
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-batik-brown" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Pusaka
                </h1>
                <p className="text-sm text-gray-500 -mt-1">Traditional Craft NFTs</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLinks />
          </div>

          {/* Search and Connect Wallet */}
          <div className="flex items-center space-x-3">
            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:block">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search NFTs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-72 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-batik-brown/20 focus:border-batik-brown transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </form>

            {/* Connect Wallet Button */}
            <Button
              onClick={handleConnectWallet}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-sm ${
                isConnected 
                  ? "bg-forest-green text-white hover:bg-forest-green/90 hover:shadow-md" 
                  : "bg-batik-brown text-white hover:bg-batik-brown/90 hover:shadow-md"
              }`}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isConnected ? "Connected" : "Connect Wallet"}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden p-2 hover:bg-gray-100 rounded-xl">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-8">
                  <h2 className="text-xl font-bold text-batik-brown mb-4">Navigation</h2>
                  
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="relative mb-6">
                      <Input
                        type="text"
                        placeholder="Search NFTs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </form>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col space-y-3">
                    <NavLinks />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
