"use client";

import Image from "next/image";
import Link from "next/link";

type DhanarkLogoVariant =
  | "full"
  | "mark"
  | "wordmark";

interface DhanarkLogoProps {
  variant?: DhanarkLogoVariant;
  href?: string | null;
  className?: string;
  priority?: boolean;
}

const logoSources: Record<DhanarkLogoVariant, string> = {
  full: "/brand/dhanark-full.png",
  mark: "/brand/dhanark-mark.png",
  wordmark: "/brand/dhanark-full.png",
};

const logoDimensions: Record<
  DhanarkLogoVariant,
  { width: number; height: number }
> = {
  full: {
    width: 500,
    height: 150,
  },
  mark: {
    width: 150,
    height: 150,
  },
  wordmark: {
    width: 500,
    height: 150,
  },
};

export default function DhanarkLogo({
  variant = "full",
  href = "/",
  className = "",
  priority = false,
}: DhanarkLogoProps) {
  const dimensions = logoDimensions[variant];

  const image = (
    <Image
      src={logoSources[variant]}
      alt="Dhanark"
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      draggable={false}
      sizes={
        variant === "mark"
          ? "48px"
          : "(max-width: 640px) 180px, 240px"
      }
      className={`block max-w-full object-contain ${className}`}
    />
  );

  if (!href) {
    return image;
  }

  return (
    <Link
      href={href}
      aria-label="Dhanark home"
      className="inline-flex w-fit shrink-0 items-center"
    >
      {image}
    </Link>
  );
}