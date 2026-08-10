import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { CertificateForm } from "@/components/admin/forms/certificate-form";

export default function NewCertificatePage() {
  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/certificates">
          <ChevronLeft className="h-4 w-4" />
          Back to certificates
        </Link>
      </Button>
      <AdminPageHeader title="New certificate" />
      <CertificateForm />
    </div>
  );
}
