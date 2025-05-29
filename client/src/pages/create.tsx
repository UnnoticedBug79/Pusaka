import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Coins, Store, CheckCircle } from "lucide-react";
import { insertNftSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const createNftSchema = insertNftSchema.extend({
  price: z.string().min(1, "Price is required"),
});

type CreateNftForm = z.infer<typeof createNftSchema>;

export default function Create() {
  const [currentStep, setCurrentStep] = useState(1);
  const [previewImage, setPreviewImage] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateNftForm>({
    resolver: zodResolver(createNftSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      price: "",
      category: "batik",
      currency: "ICP",
      creatorId: 1, // Mock creator ID
      ownerId: 1,   // Mock owner ID
      isListed: true,
    },
  });

  const createNftMutation = useMutation({
    mutationFn: async (data: CreateNftForm) => {
      const response = await apiRequest("POST", "/api/nfts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nfts"] });
      toast({
        title: "NFT Created Successfully!",
        description: "Your traditional craft is now available as an NFT on the ICP blockchain.",
      });
      setCurrentStep(4); // Success step
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: "Unable to create NFT. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateNftForm) => {
    setCurrentStep(3); // Processing step
    setTimeout(() => {
      createNftMutation.mutate(data);
    }, 2000); // Simulate blockchain processing time
  };

  const handleImageUrlChange = (url: string) => {
    form.setValue("image", url);
    setPreviewImage(url);
  };

  const steps = [
    { number: 1, title: "Upload Artwork", icon: Upload },
    { number: 2, title: "Set Details", icon: Coins },
    { number: 3, title: "Processing", icon: Store },
    { number: 4, title: "Complete", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Create Your NFT
          </h1>
          <p className="text-xl text-gray-600">
            Transform your traditional Indonesian craft into a digital collectible
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full border-2 
                      ${isActive ? 'bg-batik-brown border-batik-brown text-white' : 
                        isCompleted ? 'bg-forest-green border-forest-green text-white' : 
                        'bg-white border-gray-300 text-gray-500'}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <div className={`text-sm font-medium ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-px mx-4 ${isCompleted ? 'bg-forest-green' : 'bg-gray-300'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-batik-brown">
              {currentStep === 1 && "Upload Your Traditional Craft"}
              {currentStep === 2 && "Set NFT Details & Pricing"}
              {currentStep === 3 && "Minting Your NFT"}
              {currentStep === 4 && "NFT Created Successfully!"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="image-url" className="text-base font-medium">
                    Artwork Image URL
                  </Label>
                  <Input
                    id="image-url"
                    type="url"
                    placeholder="https://example.com/your-artwork.jpg"
                    value={form.watch("image")}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Provide a URL to your traditional craft image. Recommended size: 600x600px or larger.
                  </p>
                </div>

                {previewImage && (
                  <div className="text-center">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-64 h-64 object-cover rounded-lg mx-auto border-2 border-gray-200"
                      onError={() => setPreviewImage("")}
                    />
                  </div>
                )}

                <div className="flex justify-center">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!form.watch("image")}
                    className="bg-batik-brown text-white px-8 py-3"
                  >
                    Continue to Details
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">NFT Name *</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      placeholder="e.g., Megamendung Batik #001"
                      className="mt-2"
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={form.watch("category")} onValueChange={(value) => form.setValue("category", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="batik">Batik</SelectItem>
                        <SelectItem value="wood_sculpture">Wood Sculpture</SelectItem>
                        <SelectItem value="textile">Textile</SelectItem>
                        <SelectItem value="mask">Traditional Mask</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Describe your traditional craft, its cultural significance, and creation process..."
                    rows={4}
                    className="mt-2"
                  />
                  {form.formState.errors.description && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <div className="relative mt-2">
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        {...form.register("price")}
                        placeholder="0.00"
                        className="pr-16"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 text-sm">ICP</span>
                      </div>
                    </div>
                    {form.formState.errors.price && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.price.message}</p>
                    )}
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="submit"
                      className="bg-batik-brown text-white px-8 py-3 w-full"
                      disabled={createNftMutation.isPending}
                    >
                      Create NFT
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {currentStep === 3 && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-batik-brown mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Minting Your NFT</h3>
                <p className="text-gray-600">
                  Processing your traditional craft on the ICP blockchain...
                </p>
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading metadata...</span>
                    <span className="text-forest-green">✓</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span>Creating token...</span>
                    <div className="animate-pulse">⏳</div>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2 opacity-50">
                    <span>Confirming transaction...</span>
                    <span>⏳</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">NFT Created Successfully!</h3>
                <p className="text-gray-600 mb-6">
                  Your traditional craft is now available as an NFT on the ICP blockchain.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <div className="font-medium">{form.watch("name")}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <div className="font-medium">{form.watch("price")} ICP</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <div className="font-medium capitalize">{form.watch("category").replace('_', ' ')}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <div className="font-medium text-forest-green">Listed</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => window.location.href = '/explore'}
                    className="bg-batik-brown text-white px-8 py-3 w-full"
                  >
                    View in Marketplace
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setCurrentStep(1);
                      form.reset();
                      setPreviewImage("");
                    }}
                    className="w-full"
                  >
                    Create Another NFT
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Section */}
        {currentStep <= 2 && (
          <div className="mt-8 bg-warm-cream rounded-lg p-6">
            <h3 className="font-semibold text-batik-brown mb-4">Tips for Creating Successful NFTs:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Use high-quality images that showcase your craft's intricate details</li>
              <li>• Include cultural context and traditional techniques in your description</li>
              <li>• Research similar NFTs to price competitively</li>
              <li>• Tell the story behind your traditional craft to attract collectors</li>
              <li>• Consider creating a series or collection for better discoverability</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
