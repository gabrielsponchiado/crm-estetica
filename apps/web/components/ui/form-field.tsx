'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string | null;
}

export function FieldError({ error, className, ...props }: FieldErrorProps) {
  if (!error) return null;

  return (
    <p
      className={cn(
        'text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-1 duration-150',
        className
      )}
      {...props}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span>{error}</span>
    </p>
  );
}

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  error?: string | null;
  description?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  required,
  error,
  description,
  children,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5 flex flex-col', className)} {...props}>
      {label && (
        <label className="text-xs font-semibold text-foreground/80 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-destructive">*</span>}
          </span>
        </label>
      )}
      {children}
      {description && !error && (
        <p className="text-[11px] text-muted-foreground leading-tight">{description}</p>
      )}
      <FieldError error={error} />
    </div>
  );
}
