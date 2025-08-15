import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SecureQRForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    pin: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter a 4-digit PIN.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const response = await supabase.functions.invoke('create-secure-qr', {
        body: {
          data: { fullName: formData.fullName },
          pin: formData.pin,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data?.uuid) {
        throw new Error('Invalid response from server');
      }
      
      // Navigate to QR display with the UUID
      navigate(`/qr/${response.data.uuid}`);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create secure QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <Card className="bg-gradient-card border-0 shadow-strong">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-secondary-accent/10 rounded-2xl">
              <Shield className="h-12 w-12 text-secondary-accent mx-auto" />
            </div>
            <CardTitle className="text-3xl font-bold">Secure QR Code Generator</CardTitle>
            <CardDescription className="text-lg">
              Generate an encrypted, password-protected QR code for sensitive information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
              <Lock className="h-5 w-5 text-secondary-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-secondary-accent mb-1">Maximum Security</p>
                <p className="text-sm text-muted-foreground">
                  Your data will be encrypted with AES 256-bit encryption and protected with your PIN. 
                  The QR code will only contain a secure link to access your encrypted data.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="pin">4-Digit PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  value={formData.pin}
                  onChange={(e) => setFormData(prev => ({ ...prev, pin: e.target.value }))}
                  maxLength={4}
                  pattern="[0-9]{4}"
                  placeholder="Enter 4-digit PIN"
                  className="text-center text-2xl tracking-widest"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This PIN will be required to view your information
                </p>
              </div>

              <Button 
                type="submit"
                variant="secure"
                size="lg"
                disabled={formData.fullName.trim() === "" || formData.pin.length !== 4}
                className="w-full"
              >
                <Lock className="h-4 w-4 mr-2" />
                Generate Secure QR Code
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecureQRForm;