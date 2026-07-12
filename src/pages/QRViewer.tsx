import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Shield, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const QRViewer = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("view-secure-qr", {
        body: { uuid, pin },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const decrypted = data?.data;
      if (!decrypted) {
        throw new Error("No data returned from secure function.");
      }

      const encoded = encodeURIComponent(JSON.stringify(JSON.parse(decrypted)));
      navigate(`/view?data=${encoded}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid PIN or expired QR";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="container mx-auto max-w-md">
        <Card className="bg-gradient-card border-0 shadow-strong">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-secondary-accent/10 rounded-2xl">
              <Lock className="h-12 w-12 text-secondary-accent mx-auto" />
            </div>
            <CardTitle className="text-2xl font-bold">Access Your Information</CardTitle>
            <CardDescription>
              Enter your 4-digit PIN to decrypt and view your secure data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
              <Shield className="h-5 w-5 text-secondary-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-secondary-accent mb-1">Secure Access</p>
                <p className="text-sm text-muted-foreground">ID: {uuid}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="pin">4-Digit PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                  placeholder="Enter your PIN"
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              <Button
                type="submit"
                variant="secure"
                size="lg"
                disabled={pin.length !== 4 || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>Verifying...</>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Access My Information
                  </>
                )}
              </Button>
            </form>


            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                This feature is now live with Supabase Edge Functions. Your data is encrypted and securely retrieved using your PIN.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRViewer;
