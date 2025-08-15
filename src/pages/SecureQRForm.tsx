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
    
    // Show message about Supabase requirement
    toast({
      title: "Backend Required",
      description: "To implement secure QR codes with encryption, please connect to Supabase first.",
    });
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

            <div className="text-center p-8 bg-muted/50 rounded-lg">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Backend Integration Required</h3>
              <p className="text-muted-foreground mb-4">
                To implement secure QR codes with encryption and cloud storage, this app needs to be connected to a backend database.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Lovable has a native integration with Supabase that provides:
              </p>
              <ul className="text-sm text-muted-foreground text-left max-w-md mx-auto space-y-2 mb-6">
                <li>• Secure database storage</li>
                <li>• User authentication</li>
                <li>• Data encryption</li>
                <li>• PIN verification</li>
                <li>• Cloud-based QR code access</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Click on the green Supabase button at the top right of the interface to connect to Supabase and enable secure QR code generation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecureQRForm;