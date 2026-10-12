"use client";

import { useTheme } from "next-themes";
import {
  Toaster as Sonner,
  type ToasterProps,
} from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast !border !border-slate-200 !bg-white !text-slate-900 !shadow-[0_8px_30px_rgba(15,23,42,0.12)]",
          title:
            "!text-sm !font-semibold !text-slate-900",
          description:
            "!mt-1 !text-xs !leading-5 !text-slate-500",
          closeButton:
            "!border-slate-200 !bg-white !text-slate-400 hover:!bg-slate-50 hover:!text-slate-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };