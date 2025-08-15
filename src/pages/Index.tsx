import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Lock, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16 pt-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              MyID QR
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed">
            Your Secure Digital ID
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Generate QR codes for your personal identification documents with two secure options
          </p>
        </div>

        {/* Options Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Basic QR Option */}
          <Card className="bg-gradient-card border-0 shadow-strong hover:shadow-glow transition-smooth group cursor-pointer transform hover:scale-105">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 bg-primary-light rounded-2xl group-hover:bg-primary/10 transition-smooth">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Basic (Offline) QR Code
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                For quick access to all ID numbers. Works anywhere, no internet needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3 p-4 bg-primary-light rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-destructive mb-1">Warning</p>
                  <p className="text-sm text-muted-foreground">
                    Data is stored in plain text and is not secure. Only use for non-sensitive information.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-accent" />
                  <span className="text-sm">Works offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-accent" />
                  <span className="text-sm">Instant access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-accent" />
                  <span className="text-sm">No registration required</span>
                </div>
              </div>

              <Button 
                variant="basic"
                size="lg"
                className="w-full py-6"
                onClick={() => navigate('/basic')}
              >
                Generate Basic QR Code
              </Button>
            </CardContent>
          </Card>

          {/* Secure QR Option */}
          <Card className="bg-gradient-card border-0 shadow-strong hover:shadow-glow transition-smooth group cursor-pointer transform hover:scale-105">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 bg-secondary-accent/10 rounded-2xl group-hover:bg-secondary-accent/20 transition-smooth">
                <Lock className="h-12 w-12 text-secondary-accent" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Secure (Password-Protected) QR Code
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                For sensitive ID numbers. Requires PIN and internet to view. Data is encrypted and protected.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                <Shield className="h-5 w-5 text-secondary-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-secondary-accent mb-1">Secure</p>
                  <p className="text-sm text-muted-foreground">
                    AES 256-bit encryption with PIN protection for maximum security.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-accent" />
                  <span className="text-sm">AES 256-bit encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-accent" />
                  <span className="text-sm">PIN protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-accent" />
                  <span className="text-sm">Cloud-secured storage</span>
                </div>
              </div>

              <Button 
                variant="secure"
                size="lg"
                className="w-full py-6"
                onClick={() => navigate('/secure')}
              >
                Generate Secure QR Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trust Section */}
        <div className="text-center mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">
            Built for Trust & Security
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <Shield className="h-8 w-8 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Secure by Design</h3>
              <p className="text-white/80 text-sm">
                Industry-standard encryption and security practices protect your data.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <FileText className="h-8 w-8 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Easy to Use</h3>
              <p className="text-white/80 text-sm">
                Simple forms and clear instructions make it accessible for everyone.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <Lock className="h-8 w-8 text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Your Choice</h3>
              <p className="text-white/80 text-sm">
                Choose between convenience or maximum security based on your needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;