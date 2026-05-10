import { RfqProvider } from "@/components/procurement/rfq/RfqContext";
import { RfqFloatingButton } from "@/components/procurement/rfq/RfqFloatingButton";
import { RfqDrawer } from "@/components/procurement/rfq/RfqDrawer";
import { RfqContactStep } from "@/components/procurement/rfq/RfqContactStep";

export default function ProcurementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RfqProvider>
      {children}
      <RfqFloatingButton />
      <RfqDrawer />
      <RfqContactStep />
    </RfqProvider>
  );
}
