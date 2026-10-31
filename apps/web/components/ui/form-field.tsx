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
        'mt-1.5 flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in-50 slide-in-from-top-1 duration-150',
        className
      )}
      {...props}
    >
      <AlertCircle className="size-3.5 shrink-0" />
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
    <div className={cn('flex flex-col gap-1.5', className)} {...props}>
      {label && (
        <label className="flex items-center gap-1 text-sm font-medium text-foreground">
          <span>
            {label}
            {required && <span className="ml-0.5 text-destructive">*</span>}
          </span>
        </label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      <FieldError error={error} />
    </div>
  );
}