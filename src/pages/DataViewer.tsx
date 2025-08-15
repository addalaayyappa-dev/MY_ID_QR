import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, AlertTriangle } from "lucide-react";

const DataViewer = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const encodedData = searchParams.get('data');
    if (encodedData) {
      try {
        const decodedData = decodeURIComponent(encodedData);
        const parsedData = JSON.parse(decodedData);
        setData(parsedData);
      } catch (err) {
        setError("Failed to decode QR data. The QR code may be corrupted or invalid.");
      }
    } else {
      setError("No data found in QR code.");
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="bg-gradient-card border-0 shadow-strong">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-destructive/10 rounded-2xl">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              </div>
              <CardTitle className="text-2xl font-bold">Error Reading QR Code</CardTitle>
              <CardDescription className="text-lg">
                {error}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="bg-gradient-card border-0 shadow-strong">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-gradient-card border-0 shadow-strong">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-primary-light rounded-2xl">
              <Eye className="h-12 w-12 text-primary mx-auto" />
            </div>
            <CardTitle className="text-3xl font-bold">Your Information</CardTitle>
            <CardDescription className="text-lg">
              Scanned from QR Code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-destructive mb-1">Security Notice</p>
                <p className="text-sm text-muted-foreground">
                  This data was stored in plain text format. For sensitive information, use secure QR codes instead.
                </p>
              </div>
            </div>

            {Object.entries(data).map(([category, fields]: [string, any]) => {
              const hasData = Object.values(fields).some((value: any) => value && value.toString().trim() !== "");
              
              if (!hasData) return null;

              return (
                <Card key={category} className="border border-border/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {Object.entries(fields).map(([field, value]: [string, any]) => {
                        if (!value || value.toString().trim() === "") return null;
                        
                        return (
                          <div key={field} className="flex flex-col gap-2 p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            </div>
                            <p className="font-medium text-foreground break-all">
                              {value.toString()}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {Object.values(data).every((category: any) => 
              !Object.values(category).some((value: any) => value && value.toString().trim() !== "")
            ) && (
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Data Found</h3>
                <p className="text-muted-foreground">
                  This QR code appears to be empty or contains no readable information.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataViewer;