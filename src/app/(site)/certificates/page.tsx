import { getCertificates } from "@/lib/data/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { SectionEmpty } from "@/components/shared/section-empty";
import { CertificateCard } from "@/components/public/certificates/certificate-card";

export async function generateMetadata() {
  return buildMetadata({ title: "Certificates", path: "/certificates" });
}

export default async function CertificatesPage() {
  const certificates = await getCertificates();

  return (
    <>
      <PageHeader
        eyebrow="Credentials"
        title="Certificates"
        description="Certifications and credentials earned along the way."
      />
      <section className="container-page pb-24 pt-10">
        {certificates.length === 0 ? (
          <SectionEmpty
            title="No certificates yet"
            description="Credentials I earn will be listed here."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert, i) => (
              <Reveal key={cert.id} delay={(i % 3) * 0.07}>
                <CertificateCard certificate={cert} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}