import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle2, XCircle } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider duration={7000}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="border border-border/80 bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:backdrop-blur-md shadow-lg"
          >
            <div className="flex items-start gap-3 w-full relative">
              <div
                className={
                  (props as any).variant === "destructive"
                    ? "absolute left-0 top-0 h-full w-1 rounded-l bg-[hsl(var(--devfolio-orange))]"
                    : "absolute left-0 top-0 h-full w-1 rounded-l bg-[hsl(var(--devfolio-blue))]"
                }
              />
              <div
                className={
                  (props as any).variant === "destructive"
                    ? "mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--devfolio-orange))]/15 text-[hsl(var(--devfolio-orange))]"
                    : "mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--devfolio-blue))]/15 text-[hsl(var(--devfolio-blue))]"
                }
              >
                {(props as any).variant === "destructive" ? (
                  <XCircle className="h-5 w-5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
              </div>
              <div className="grid gap-1 flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </div>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
