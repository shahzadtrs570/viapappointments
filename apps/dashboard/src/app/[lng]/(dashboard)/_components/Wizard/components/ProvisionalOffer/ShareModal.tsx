/*eslint-disable*/

import {
  Copy,
  Facebook,
  Link2,
  Mail,
  MessageSquare,
  Twitter,
  X,
} from "lucide-react"
import { toast } from "@package/ui/toast"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import type { ShareModalProps, ShareButtonProps } from "./FormValidation"

function ShareButton({ icon, label, onClick }: ShareButtonProps) {
  return (
    <button
      className="flex flex-col items-center gap-1 rounded-lg p-1 transition-colors hover:bg-muted sm:p-2"
      onClick={onClick}
    >
      <div className="flex size-8 items-center justify-center rounded-full bg-muted sm:size-10">
        {icon}
      </div>
      <span className="text-[10px] text-muted-foreground sm:text-xs">
        {label}
      </span>
    </button>
  )
}

export function ShareModal({ onClose, shareData }: ShareModalProps) {
  const { t } = useClientTranslation(["wizard_provisional_offer"])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-card p-4 shadow-xl sm:p-6">
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <h3 className="text-base font-semibold text-card-foreground sm:text-xl">
            {t("wizard_provisional_offer:shareModal.title")}
          </h3>
          <button
            className="text-muted-foreground hover:text-card-foreground"
            onClick={onClose}
          >
            <X className="size-4 sm:size-5" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-md bg-muted p-2 sm:mb-6">
          <Link2 className="size-4 text-muted-foreground sm:size-5" />
          <input
            readOnly
            className="flex-1 border-none bg-transparent text-sm text-card-foreground focus:outline-none sm:text-base"
            type="text"
            value={window.location.href}
          />
          <button
            className="rounded p-1 hover:bg-background"
            onClick={() => {
              void navigator.clipboard.writeText(window.location.href)
              toast({
                title: t(
                  "wizard_provisional_offer:shareModal.copiedToastTitle"
                ),
                description: t(
                  "wizard_provisional_offer:shareModal.copiedToastDescription"
                ),
              })
            }}
          >
            <Copy className="size-4 text-muted-foreground sm:size-5" />
          </button>
        </div>

        <div>
          <p className="mb-3 text-xs font-medium text-card-foreground sm:mb-4 sm:text-sm">
            {t("wizard_provisional_offer:shareModal.shareUsingTitle")}
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <ShareButton
              icon={<Mail />}
              label={t("wizard_provisional_offer:shareModal.buttons.email")}
              onClick={() =>
                window.open(
                  `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text)}`
                )
              }
            />
            <ShareButton
              icon={<MessageSquare />}
              label={t("wizard_provisional_offer:shareModal.buttons.message")}
              onClick={() =>
                window.open(`sms:?body=${encodeURIComponent(shareData.text)}`)
              }
            />
            <ShareButton
              icon={<Facebook />}
              label={t("wizard_provisional_offer:shareModal.buttons.facebook")}
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`
                )
              }
            />
            <ShareButton
              icon={<Twitter />}
              label={t("wizard_provisional_offer:shareModal.buttons.twitter")}
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}`
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
