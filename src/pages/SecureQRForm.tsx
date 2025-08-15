import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, ArrowLeft, Shield, Lock, QrCode, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";

interface FormData {
  // Foundational & Biometric
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  
  // Primary Government Identifiers
  aadhaarNumber: string;
  panNumber: string;
  voterIdNumber: string;
  passportNumber: string;
  drivingLicenseNumber: string;
  rationCardNumber: string;
  birthCertificateNumber: string;
  
  // Financial
  bankAccountNumbers: string;
  ifscCodes: string;
  creditCardNumber: string;
  debitCardNumber: string;
  
  // Educational & Professional
  educationalCertificates: string;
  universityRollNumbers: string;
  professionalLicenses: string;
  employmentRecords: string;
  
  // Health & Medical
  bloodGroup: string;
  
  // Residential & Communication
  permanentAddress: string;
  presentAddress: string;
  mobileNumbers: string;
  emailAddress: string;
  
  // Other Identifiers
  marriageCertificate: string;
  vehicleRegistrationNumber: string;
  lifeInsurancePolicyNumber: string;
  
  // Security
  pin: string;
}

const SecureQRForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    gender: "",
    aadhaarNumber: "",
    panNumber: "",
    voterIdNumber: "",
    passportNumber: "",
    drivingLicenseNumber: "",
    rationCardNumber: "",
    birthCertificateNumber: "",
    bankAccountNumbers: "",
    ifscCodes: "",
    creditCardNumber: "",
    debitCardNumber: "",
    educationalCertificates: "",
    universityRollNumbers: "",
    professionalLicenses: "",
    employmentRecords: "",
    bloodGroup: "",
    permanentAddress: "",
    presentAddress: "",
    mobileNumbers: "",
    emailAddress: "",
    marriageCertificate: "",
    vehicleRegistrationNumber: "",
    lifeInsurancePolicyNumber: "",
    pin: "",
  });

  const [openSections, setOpenSections] = useState({
    foundational: true,
    government: false,
    financial: false,
    educational: false,
    health: false,
    residential: false,
    other: false,
    security: false,
  });

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSecureQRCode = async () => {
    if (formData.pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter a 4-digit PIN.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Create structured data (excluding PIN)
      const { pin, ...dataWithoutPin } = formData;
      const structuredData = {
        "Foundational & Biometric": {
          "Full Name": dataWithoutPin.fullName,
          "Date of Birth": dataWithoutPin.dateOfBirth,
          "Place of Birth": dataWithoutPin.placeOfBirth,
          "Gender": dataWithoutPin.gender,
        },
        "Government Identifiers": {
          "Aadhaar Number": dataWithoutPin.aadhaarNumber,
          "PAN Number": dataWithoutPin.panNumber,
          "Voter ID": dataWithoutPin.voterIdNumber,
          "Passport Number": dataWithoutPin.passportNumber,
          "Driving License": dataWithoutPin.drivingLicenseNumber,
          "Ration Card": dataWithoutPin.rationCardNumber,
          "Birth Certificate": dataWithoutPin.birthCertificateNumber,
        },
        "Financial Information": {
          "Bank Account Numbers": dataWithoutPin.bankAccountNumbers,
          "IFSC Codes": dataWithoutPin.ifscCodes,
          "Credit Card": dataWithoutPin.creditCardNumber,
          "Debit Card": dataWithoutPin.debitCardNumber,
        },
        "Educational & Professional": {
          "Educational Certificates": dataWithoutPin.educationalCertificates,
          "University Roll Numbers": dataWithoutPin.universityRollNumbers,
          "Professional Licenses": dataWithoutPin.professionalLicenses,
          "Employment Records": dataWithoutPin.employmentRecords,
        },
        "Health Information": {
          "Blood Group": dataWithoutPin.bloodGroup,
        },
        "Contact Information": {
          "Permanent Address": dataWithoutPin.permanentAddress,
          "Present Address": dataWithoutPin.presentAddress,
          "Mobile Numbers": dataWithoutPin.mobileNumbers,
          "Email Address": dataWithoutPin.emailAddress,
        },
        "Other Identifiers": {
          "Marriage Certificate": dataWithoutPin.marriageCertificate,
          "Vehicle Registration": dataWithoutPin.vehicleRegistrationNumber,
          "Life Insurance Policy": dataWithoutPin.lifeInsurancePolicyNumber,
        }
      };

      const { supabase } = await import("@/integrations/supabase/client");
      
      const response = await supabase.functions.invoke('create-secure-qr', {
        body: {
          data: structuredData,
          pin: formData.pin,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data?.uuid) {
        throw new Error('Invalid response from server');
      }
      
      // Generate QR code with the secure URL
      const currentDomain = window.location.origin;
      const secureUrl = `${currentDomain}/qr/${response.data.uuid}`;
      
      const qrDataUrl = await QRCode.toDataURL(secureUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      });

      setQrCodeDataUrl(qrDataUrl);
      
      toast({
        title: "Secure QR Code Generated!",
        description: "Your password-protected QR code has been created successfully.",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create secure QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = 'myid-secure-qr.png';
      link.href = qrCodeDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Downloaded!",
        description: "Secure QR code has been downloaded to your device.",
      });
    }
  };

  if (qrCodeDataUrl) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setQrCodeDataUrl("")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Form
            </Button>
          </div>

          <Card className="bg-gradient-card border-0 shadow-strong">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-secondary-accent/10 rounded-2xl">
                <Shield className="h-12 w-12 text-secondary-accent mx-auto" />
              </div>
              <CardTitle className="text-2xl font-bold">Your Secure QR Code</CardTitle>
              <CardDescription>
                Scan this QR code and enter your PIN to access your encrypted information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                <Lock className="h-5 w-5 text-secondary-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-secondary-accent mb-1">Maximum Security</p>
                  <p className="text-sm text-muted-foreground">
                    Your data is encrypted with AES 256-bit encryption and protected with your PIN.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-2xl shadow-medium">
                  <img src={qrCodeDataUrl} alt="Generated Secure QR Code" className="w-80 h-80" />
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="secure" 
                  size="lg" 
                  onClick={downloadQRCode}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Generate Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="container mx-auto max-w-4xl">
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
              Fill in your information and set a PIN to generate an encrypted, password-protected QR code.
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

            {/* Foundational & Biometric Data */}
            <Collapsible open={openSections.foundational} onOpenChange={() => toggleSection('foundational')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                  <span className="text-lg font-semibold">Foundational & Biometric Data</span>
                  {openSections.foundational ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="placeOfBirth">Place of Birth</Label>
                    <Input
                      id="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                      placeholder="City, State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Input
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      placeholder="Male/Female/Other"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Primary Government Identifiers */}
            <Collapsible open={openSections.government} onOpenChange={() => toggleSection('government')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                  <span className="text-lg font-semibold">Primary Government Identifiers</span>
                  {openSections.government ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                    <Input
                      id="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                      placeholder="Enter your Aadhaar number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange('panNumber', e.target.value)}
                      placeholder="Enter your PAN number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="voterIdNumber">Voter ID Number</Label>
                    <Input
                      id="voterIdNumber"
                      value={formData.voterIdNumber}
                      onChange={(e) => handleInputChange('voterIdNumber', e.target.value)}
                      placeholder="Enter your Voter ID number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passportNumber">Passport Number</Label>
                    <Input
                      id="passportNumber"
                      value={formData.passportNumber}
                      onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                      placeholder="Enter your Passport number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="drivingLicenseNumber">Driving License Number</Label>
                    <Input
                      id="drivingLicenseNumber"
                      value={formData.drivingLicenseNumber}
                      onChange={(e) => handleInputChange('drivingLicenseNumber', e.target.value)}
                      placeholder="Enter your Driving License number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rationCardNumber">Ration Card Number</Label>
                    <Input
                      id="rationCardNumber"
                      value={formData.rationCardNumber}
                      onChange={(e) => handleInputChange('rationCardNumber', e.target.value)}
                      placeholder="Enter your Ration Card number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthCertificateNumber">Birth Certificate Number</Label>
                    <Input
                      id="birthCertificateNumber"
                      value={formData.birthCertificateNumber}
                      onChange={(e) => handleInputChange('birthCertificateNumber', e.target.value)}
                      placeholder="Enter your Birth Certificate number"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Financial and Economic Data */}
            <Collapsible open={openSections.financial} onOpenChange={() => toggleSection('financial')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                  <span className="text-lg font-semibold">Financial and Economic Data</span>
                  {openSections.financial ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankAccountNumbers">Bank Account Number(s)</Label>
                    <Textarea
                      id="bankAccountNumbers"
                      value={formData.bankAccountNumbers}
                      onChange={(e) => handleInputChange('bankAccountNumbers', e.target.value)}
                      placeholder="Enter your Bank Account Number(s), separated by commas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifscCodes">IFSC Codes</Label>
                    <Textarea
                      id="ifscCodes"
                      value={formData.ifscCodes}
                      onChange={(e) => handleInputChange('ifscCodes', e.target.value)}
                      placeholder="Enter your IFSC Codes, separated by commas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="creditCardNumber">Credit Card Number</Label>
                    <Input
                      id="creditCardNumber"
                      value={formData.creditCardNumber}
                      onChange={(e) => handleInputChange('creditCardNumber', e.target.value)}
                      placeholder="Enter your Credit Card number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="debitCardNumber">Debit Card Number</Label>
                    <Input
                      id="debitCardNumber"
                      value={formData.debitCardNumber}
                      onChange={(e) => handleInputChange('debitCardNumber', e.target.value)}
                      placeholder="Enter your Debit Card number"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Educational & Professional Data */}
            <Collapsible open={openSections.educational} onOpenChange={() => toggleSection('educational')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                  <span className="text-lg font-semibold">Educational & Professional Data</span>
                  {openSections.educational ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="educationalCertificates">Educational Certificates</Label>
                    <Textarea
                      id="educationalCertificates"
                      value={formData.educationalCertificates}
                      onChange={(e) => handleInputChange('educationalCertificates', e.target.value)}
                      placeholder="Enter your Educational Certificate details"
                    />
                  </div>
                  <div>
                    <Label htmlFor="universityRollNumbers">University Roll Numbers</Label>
                    <Textarea
                      id="universityRollNumbers"
                      value={formData.universityRollNumbers}
                      onChange={(e) => handleInputChange('universityRollNumbers', e.target.value)}
                      placeholder="Enter your University Roll Numbers"
                    />
                  </div>
                  <div>
                    <Label htmlFor="professionalLicenses">Professional Licenses</Label>
                    <Textarea
                      id="professionalLicenses"
                      value={formData.professionalLicenses}
                      onChange={(e) => handleInputChange('professionalLicenses', e.target.value)}
                      placeholder="Enter your Professional License details"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employmentRecords">Employment Records</Label>
                    <Textarea
                      id="employmentRecords"
                      value={formData.employmentRecords}
                      onChange={(e) => handleInputChange('employmentRecords', e.target.value)}
                      placeholder="Enter your Employment Record details"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Health Information */}
            <Collapsible open={openSections.health} onOpenChange={() => toggleSection('health')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                  <span className="text-lg font-semibold">Health Information</span>
                  {openSections.health ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Input
                      id="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                      placeholder="A+, B+, O+, AB+, etc."
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Contact Information */}
            <Collapsible open={openSections.residential} onOpenChange={() => toggleSection('residential')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                  <span className="text-lg font-semibold">Contact Information</span>
                  {openSections.residential ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="permanentAddress">Permanent Address</Label>
                    <Textarea
                      id="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                      placeholder="Enter your permanent address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="presentAddress">Present Address</Label>
                    <Textarea
                      id="presentAddress"
                      value={formData.presentAddress}
                      onChange={(e) => handleInputChange('presentAddress', e.target.value)}
                      placeholder="Enter your present address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobileNumbers">Mobile Numbers</Label>
                    <Input
                      id="mobileNumbers"
                      value={formData.mobileNumbers}
                      onChange={(e) => handleInputChange('mobileNumbers', e.target.value)}
                      placeholder="Enter your mobile numbers, separated by commas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Input
                      id="emailAddress"
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Other Identifiers */}
            <Collapsible open={openSections.other} onOpenChange={() => toggleSection('other')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                  <span className="text-lg font-semibold">Other Identifiers</span>
                  {openSections.other ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="marriageCertificate">Marriage Certificate</Label>
                    <Input
                      id="marriageCertificate"
                      value={formData.marriageCertificate}
                      onChange={(e) => handleInputChange('marriageCertificate', e.target.value)}
                      placeholder="Enter your Marriage Certificate details"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleRegistrationNumber">Vehicle Registration Number</Label>
                    <Input
                      id="vehicleRegistrationNumber"
                      value={formData.vehicleRegistrationNumber}
                      onChange={(e) => handleInputChange('vehicleRegistrationNumber', e.target.value)}
                      placeholder="Enter your Vehicle Registration number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lifeInsurancePolicyNumber">Life Insurance Policy Number</Label>
                    <Input
                      id="lifeInsurancePolicyNumber"
                      value={formData.lifeInsurancePolicyNumber}
                      onChange={(e) => handleInputChange('lifeInsurancePolicyNumber', e.target.value)}
                      placeholder="Enter your Life Insurance Policy number"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Security Section */}
            <Collapsible open={openSections.security} onOpenChange={() => toggleSection('security')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto bg-secondary-accent/10 border border-secondary-accent/20">
                  <span className="text-lg font-semibold text-secondary-accent">Security Settings</span>
                  {openSections.security ? <ChevronUp className="text-secondary-accent" /> : <ChevronDown className="text-secondary-accent" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4">
                <div className="flex items-start gap-3 p-4 bg-secondary-accent/10 rounded-lg border border-secondary-accent/20">
                  <Lock className="h-5 w-5 text-secondary-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-secondary-accent mb-1">Set Your Security PIN</p>
                    <p className="text-sm text-muted-foreground">
                      This 4-digit PIN will be required to view your information when the QR code is scanned.
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="pin">4-Digit PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    value={formData.pin}
                    onChange={(e) => handleInputChange('pin', e.target.value)}
                    maxLength={4}
                    pattern="[0-9]{4}"
                    placeholder="Enter 4-digit PIN"
                    className="text-center text-2xl tracking-widest"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This PIN will be required to access your information
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Button 
              onClick={generateSecureQRCode}
              variant="secure"
              size="lg"
              disabled={isGenerating || formData.pin.length !== 4}
              className="w-full"
            >
              <Lock className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate Secure QR Code"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecureQRForm;