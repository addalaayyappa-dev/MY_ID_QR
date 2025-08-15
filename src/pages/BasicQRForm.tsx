import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, ArrowLeft, QrCode, Download, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { useToast } from "@/hooks/use-toast";

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
}

const BasicQRForm = () => {
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
  });

  const [openSections, setOpenSections] = useState({
    foundational: true,
    government: false,
    financial: false,
    educational: false,
    health: false,
    residential: false,
    other: false,
  });

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // Create structured data
      const structuredData = {
        "Foundational & Biometric": {
          "Full Name": formData.fullName,
          "Date of Birth": formData.dateOfBirth,
          "Place of Birth": formData.placeOfBirth,
          "Gender": formData.gender,
        },
        "Government Identifiers": {
          "Aadhaar Number": formData.aadhaarNumber,
          "PAN Number": formData.panNumber,
          "Voter ID": formData.voterIdNumber,
          "Passport Number": formData.passportNumber,
          "Driving License": formData.drivingLicenseNumber,
          "Ration Card": formData.rationCardNumber,
          "Birth Certificate": formData.birthCertificateNumber,
        },
        "Financial Information": {
          "Bank Account Numbers": formData.bankAccountNumbers,
          "IFSC Codes": formData.ifscCodes,
          "Credit Card": formData.creditCardNumber,
          "Debit Card": formData.debitCardNumber,
        },
        "Educational & Professional": {
          "Educational Certificates": formData.educationalCertificates,
          "University Roll Numbers": formData.universityRollNumbers,
          "Professional Licenses": formData.professionalLicenses,
          "Employment Records": formData.employmentRecords,
        },
        "Health Information": {
          "Blood Group": formData.bloodGroup,
        },
        "Contact Information": {
          "Permanent Address": formData.permanentAddress,
          "Present Address": formData.presentAddress,
          "Mobile Numbers": formData.mobileNumbers,
          "Email Address": formData.emailAddress,
        },
        "Other Identifiers": {
          "Marriage Certificate": formData.marriageCertificate,
          "Vehicle Registration": formData.vehicleRegistrationNumber,
          "Life Insurance Policy": formData.lifeInsurancePolicyNumber,
        }
      };

      // Convert to JSON string
      const dataString = JSON.stringify(structuredData);
      
      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(dataString, {
        width: 400,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      });

      setQrCodeDataUrl(qrDataUrl);
      
      toast({
        title: "QR Code Generated!",
        description: "Your basic QR code has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = 'myid-basic-qr.png';
      link.href = qrCodeDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Downloaded!",
        description: "QR code has been downloaded to your device.",
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
              <CardTitle className="text-2xl font-bold">Your Basic QR Code</CardTitle>
              <CardDescription>
                Scan this QR code to access your information. Remember, this data is not encrypted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-destructive mb-1">Security Warning</p>
                  <p className="text-sm text-muted-foreground">
                    This QR code contains your data in plain text. Anyone who scans it can access your information.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-2xl shadow-medium">
                  <img src={qrCodeDataUrl} alt="Generated QR Code" className="w-80 h-80" />
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="default" 
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
            <CardTitle className="text-3xl font-bold">Basic QR Code Generator</CardTitle>
            <CardDescription className="text-lg">
              Fill in your information to generate an offline QR code. All fields are optional.
            </CardDescription>
            
            <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20 mt-4">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-destructive mb-1">Security Warning</p>
                <p className="text-sm text-muted-foreground">
                  This QR code will store your data in plain text. Do not use this option for sensitive information.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
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
                      placeholder="Enter the corresponding IFSC Codes, separated by commas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="creditCardNumber">Credit Card Number</Label>
                    <Input
                      id="creditCardNumber"
                      value={formData.creditCardNumber}
                      onChange={(e) => handleInputChange('creditCardNumber', e.target.value)}
                      placeholder="Enter your Credit Card Number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="debitCardNumber">Debit Card Number</Label>
                    <Input
                      id="debitCardNumber"
                      value={formData.debitCardNumber}
                      onChange={(e) => handleInputChange('debitCardNumber', e.target.value)}
                      placeholder="Enter your Debit Card Number"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Educational and Professional Data */}
            <Collapsible open={openSections.educational} onOpenChange={() => toggleSection('educational')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                  <span className="text-lg font-semibold">Educational and Professional Data</span>
                  {openSections.educational ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4">
                <div className="grid md:grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="educationalCertificates">Educational Certificates</Label>
                    <Textarea
                      id="educationalCertificates"
                      value={formData.educationalCertificates}
                      onChange={(e) => handleInputChange('educationalCertificates', e.target.value)}
                      placeholder="Enter details about your Educational Certificates"
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
                      placeholder="Enter details about your Professional Licenses"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employmentRecords">Employment Records</Label>
                    <Textarea
                      id="employmentRecords"
                      value={formData.employmentRecords}
                      onChange={(e) => handleInputChange('employmentRecords', e.target.value)}
                      placeholder="Enter details about your Employment Records"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Health and Medical Data */}
            <Collapsible open={openSections.health} onOpenChange={() => toggleSection('health')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                  <span className="text-lg font-semibold">Health and Medical Data</span>
                  {openSections.health ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4">
                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Input
                    id="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                    placeholder="Enter your Blood Group"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Residential and Communication Data */}
            <Collapsible open={openSections.residential} onOpenChange={() => toggleSection('residential')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                  <span className="text-lg font-semibold">Residential and Communication Data</span>
                  {openSections.residential ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 p-4">
                <div className="grid md:grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="permanentAddress">Permanent Address</Label>
                    <Textarea
                      id="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                      placeholder="Enter your Permanent Address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="presentAddress">Present Address</Label>
                    <Textarea
                      id="presentAddress"
                      value={formData.presentAddress}
                      onChange={(e) => handleInputChange('presentAddress', e.target.value)}
                      placeholder="Enter your Present Address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobileNumbers">Mobile Phone Number(s)</Label>
                    <Textarea
                      id="mobileNumbers"
                      value={formData.mobileNumbers}
                      onChange={(e) => handleInputChange('mobileNumbers', e.target.value)}
                      placeholder="Enter your Mobile Phone Number(s), separated by commas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Input
                      id="emailAddress"
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                      placeholder="Enter your Email Address"
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
                <div className="grid md:grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="marriageCertificate">Marriage Certificate</Label>
                    <Input
                      id="marriageCertificate"
                      value={formData.marriageCertificate}
                      onChange={(e) => handleInputChange('marriageCertificate', e.target.value)}
                      placeholder="Enter your Marriage Certificate Number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleRegistrationNumber">Vehicle Registration Number</Label>
                    <Input
                      id="vehicleRegistrationNumber"
                      value={formData.vehicleRegistrationNumber}
                      onChange={(e) => handleInputChange('vehicleRegistrationNumber', e.target.value)}
                      placeholder="Enter your Vehicle Registration Number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lifeInsurancePolicyNumber">Life Insurance Policy Number</Label>
                    <Input
                      id="lifeInsurancePolicyNumber"
                      value={formData.lifeInsurancePolicyNumber}
                      onChange={(e) => handleInputChange('lifeInsurancePolicyNumber', e.target.value)}
                      placeholder="Enter your Life Insurance Policy Number"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="pt-6">
              <Button 
                variant="basic"
                size="lg"
                onClick={generateQRCode}
                disabled={isGenerating || !formData.fullName}
                className="w-full py-6"
              >
                {isGenerating ? (
                  <>Generating QR Code...</>
                ) : (
                  <>
                    <QrCode className="h-5 w-5 mr-2" />
                    Generate Basic QR Code
                  </>
                )}
              </Button>
              {!formData.fullName && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Please enter at least your full name to generate a QR code
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BasicQRForm;
