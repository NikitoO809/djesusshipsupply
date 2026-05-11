import { RfqFloatingButton } from "@/components/procurement/rfq/RfqFloatingButton";
import { RfqDrawer } from "@/components/procurement/rfq/RfqDrawer";
import { RfqContactStep } from "@/components/procurement/rfq/RfqContactStep";

export default function ProcurementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <RfqFloatingButton />
      <RfqDrawer />
      <RfqContactStep />
    </>
  );
}
