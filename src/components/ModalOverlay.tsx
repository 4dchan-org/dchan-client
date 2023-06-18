import { AbuseCard, FAQCard, Overlay, RulesCard } from ".";
import { useModal } from "src/hooks";

export function ModalOverlay() {
  const [open, setOpen] = useModal();

  return open !== false ? (
    <Overlay onExit={() => setOpen(false)}>
      {
        {
          abuse: <AbuseCard />,
          rules: <RulesCard />,
          faq: <FAQCard />,
        }[open]
      }
    </Overlay>
  ) : null;
}
