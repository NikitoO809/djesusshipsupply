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
  variant?: "default" | "editorial";
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

export function ContactChannels({ channels, variant = "default" }: ContactChannelsProps) {
  if (variant === "editorial") {
    return (
      <Stagger className="grid gap-5 md:grid-cols-2">
        {channels.map((c, i) => {
          const Icon = c.icon;
          return (
            <StaggerItem key={i}>
              <ChannelWrapper href={c.href}>
                <div className="group h-full rounded-[2rem] p-1.5 bg-cream/60 ring-1 ring-navy/10 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_20px_50px_-30px_rgba(10,37,64,0.18)] transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_30px_70px_-30px_rgba(10,37,64,0.28)]">
                  <div className="h-full flex items-start gap-5 rounded-[calc(2rem-0.375rem)] bg-white p-7 md:p-8">
                    <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-navy text-gold ring-4 ring-cream shrink-0 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-gold group-hover:text-navy">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-2.5">
                        <span className="font-mono text-[10px] text-gold-dark tracking-[0.2em]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.22em] text-navy/55 font-medium">
                          {c.label}
                        </span>
                      </div>
                      <p className="font-serif text-lg md:text-xl text-navy leading-snug tracking-tight break-words">
                        {c.value}
                      </p>
                    </div>
                  </div>
                </div>
              </ChannelWrapper>
            </StaggerItem>
          );
        })}
      </Stagger>
    );
  }

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
