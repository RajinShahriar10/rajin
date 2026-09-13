import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { SectionEmpty } from "@/components/shared/section-empty";
import { CardCarousel } from "@/components/shared/card-carousel";
import {
  CertificateCard,
  type CertificateCardData,
} from "@/components/public/certificates/certificate-card";

export function CertificatesSection({
  certificates,
}: {
  certificates: CertificateCardData[];
}) {
  if (certificates.length === 0) {
    return (
      <section id="certificates" className="section-edge scroll-mt-24 py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Credentials" title="Certificates" />
          <Reveal className="mt-10">
            <SectionEmpty
              title="No certificates yet"
              description="Credentials I earn will be listed here."
            />
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="section-edge scroll-mt-24 py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Credentials"
          title="Certificates"
          description="Certifications and credentials I have earned."
        />

        <Reveal className="mt-14">
          <CardCarousel
            label="Certificates"
            previousLabel="Previous certificate"
            nextLabel="Next certificate"
          >
            {certificates.map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </CardCarousel>
        </Reveal>

        <div className="mt-10 text-center">
          <Link
            href="/certificates"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
          >
            View all certificates
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}