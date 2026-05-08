import Image from "next/image";

type Variant = "default" | "white";
type Size = "sm" | "md" | "lg";
type Shape = "wordmark" | "mark";

interface LogoProps {
  variant?: Variant;
  size?: Size;
  shape?: Shape;
  className?: string;
  priority?: boolean;
}

const WORDMARK_DIMS: Record<Size, { width: number; height: number }> = {
  sm: { width: 150, height: 40 },
  md: { width: 210, height: 56 },
  lg: { width: 300, height: 80 },
};

const MARK_DIMS: Record<Size, { width: number; height: number }> = {
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 80, height: 80 },
};

export function Logo({
  variant = "default",
  size = "md",
  shape = "wordmark",
  className,
  priority = false,
}: LogoProps) {
  const isMark = shape === "mark";
  const isWhite = variant === "white";

  const src = isMark
    ? isWhite
      ? "/logo-mark-white.svg"
      : "/logo-mark.svg"
    : isWhite
      ? "/logo-white.svg"
      : "/logo.svg";

  const { width, height } = isMark ? MARK_DIMS[size] : WORDMARK_DIMS[size];

  return (
    <Image
      src={src}
      alt="De Jesús Ship Supply"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}

export default Logo;
