import type { LucideIcon } from "lucide-react";
import { Stagger, StaggerItem } from "./FadeIn";

export interface ContactChannel {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

interface ContactChannelsProps {
  channels: ContactChannel[];
}

function ChannelWrapper({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  if (href) {
    return (
      <a href={href} className="block group h-full">
        {children}
      </a>
    );
  }
  return <div className="block h-full">{children}</div>;
}

export function ContactChannels({ channels }: ContactChannelsProps) {
  return (
    <Stagger className="grid gap-5 md:grid-cols-2">
      {channels.map((c, i) => {
        const Icon = c.icon;
        return (
          <StaggerItem key={i}>
            <ChannelWrapper href={c.href}>
              <div className="flex items-start gap-5 p-7 rounded-sm bg-cream/40 border border-navy/8 hover:border-gold/50 transition-colors h-full">
                <span className="inline-flex items-center justify-center h-12 w-12 rounded-sm bg-navy text-gold shrink-0">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gold-dark font-medium mb-1.5">
                    {c.label}
                  </p>
                  <p className="font-serif text-lg text-navy leading-snug break-words group-hover:text-navy-dark transition-colors">
                    {c.value}
                  </p>
                </div>
              </div>
            </ChannelWrapper>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
