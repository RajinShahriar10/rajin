import { Mail, MapPin, Phone } from "lucide-react";
import { getSiteData } from "@/lib/data/site";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { ContactForm } from "@/components/public/contact/contact-form";
import { SocialIcon } from "@/components/shared/social-icon";

export async function generateMetadata() {
  return buildMetadata({ title: "Contact", path: "/contact" });
}

type Channel = {
  label: string;
  value: string;
  href: string | null;
  icon: typeof Mail;
};

export default async function ContactPage() {
  const { profile, settings, socialLinks } = await getSiteData();

  const email = settings.contact_email?.trim() || profile?.email || "";
  const phone = settings.contact_phone?.trim() || profile?.phone || "";
  const location =
    settings.contact_location?.trim() || profile?.location || "";

  const channels: Channel[] = [
    email
      ? { label: "Email", value: email, href: `mailto:${email}`, icon: Mail }
      : null,
    phone
      ? {
          label: "Phone",
          value: phone,
          href: `tel:${phone.replace(/[^+\d]/g, "")}`,
          icon: Phone,
        }
      : null,
    location
      ? { label: "Location", value: location, href: null, icon: MapPin }
      : null,
  ].filter(Boolean) as Channel[];

  const socialByPlatform = new Map(
    socialLinks.map((link) => [link.platform, link]),
  );
  const featured = ["linkedin", "github"]
    .map((platform) => socialByPlatform.get(platform))
    .filter((link) => Boolean(link)) as Array<(typeof socialLinks)[number]>;
  const others = socialLinks.filter(
    (link) => !featured.some((f) => f.id === link.id),
  );

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk"
        description="Have a project, a role or just a question? Start a conversation and I'll get back to you."
      />

      <section className="container-page pb-24 pt-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
          <Reveal>
            <div className="flex flex-col gap-6">
              <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                I&apos;m open to new opportunities, freelance work and
                collaborations. Whether it&apos;s a project, a question or just
                saying hello — the best way to reach me is a direct message
                below.
              </p>

              <div className="space-y-4">
                {channels.map((channel) => {
                  const Inner = (
                    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-accent-soft">
                        <channel.icon className="h-4 w-4 text-primary" />
                      </span>
                      <div className="min-w-0">
                        <p className="tech-label">{channel.label}</p>
                        <p className="mt-1 truncate text-sm font-medium text-foreground">
                          {channel.value}
                        </p>
                      </div>
                    </div>
                  );
                  return channel.href ? (
                    <a key={channel.label} href={channel.href} className="block">
                      {Inner}
                    </a>
                  ) : (
                    <div key={channel.label}>{Inner}</div>
                  );
                })}
              </div>

              {featured.length > 0 ? (
                <div>
                  <p className="tech-label mb-3">Professional profiles</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {featured.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-accent-soft">
                          <SocialIcon platform={link.platform} className="h-4 w-4 text-primary" />
                        </span>
                        <span className="min-w-0">
                          <p className="tech-label">{link.label || link.platform}</p>
                          <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                            {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                          </p>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              {others.length > 0 ? (
                <div>
                  <p className="tech-label mb-3">Find me online</p>
                  <div className="flex flex-wrap gap-2">
                    {others.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label || link.platform}
                        className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <SocialIcon platform={link.platform} className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
