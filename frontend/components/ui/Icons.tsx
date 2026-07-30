/**
 * Otter icon set.
 * One visual language: 24x24 viewBox, 1.75 stroke, round caps/joins, currentColor.
 * Decorative by default (aria-hidden) — the labelling belongs on the button.
 */

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

function Svg({
  size = 20,
  className,
  strokeWidth = 1.75,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const ListIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="3.5" cy="6" r="1.25" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="12" r="1.25" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="18" r="1.25" fill="currentColor" stroke="none" />
  </Svg>
);

export const GridIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
  </Svg>
);

export const SunIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
  </Svg>
);

export const MoonIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const PencilIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </Svg>
);

export const TrashIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 6h18M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6M10 11v6M14 11v6M5.5 6l1 13.5A1.5 1.5 0 0 0 8 21h8a1.5 1.5 0 0 0 1.5-1.5L18.5 6" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 2.5}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const ArrowDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Svg>
);

export const FeatherIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20.2 3.8c2 2 2 5.3 0 7.4L12 19.4 4.6 20l.6-7.4 8.2-8.2c2-2 4.8-2.6 6.8-.6Z" />
    <path d="M16 8 4.6 19.4M14.5 12.5H9" />
  </Svg>
);

export const LockIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" />
    <path d="M8 10.5V7a4 4 0 1 1 8 0v3.5" />
    <circle cx="12" cy="15.5" r="1.25" fill="currentColor" stroke="none" />
  </Svg>
);

export const TargetIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

/**
 * The Otter mark — a stylized otter afloat on its back, the way otters
 * actually rest. Built from primitives so it stays crisp at any size.
 */
export function OtterMark({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* water ring the otter floats in */}
      <circle cx="24" cy="24" r="22" fill="currentColor" opacity="0.1" />
      <path
        d="M4 30c4 0 4-2.5 8-2.5s4 2.5 8 2.5 4-2.5 8-2.5 4 2.5 8 2.5 4-2.5 8-2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* ears — small and set wide, the way an otter's sit */}
      <circle cx="14.6" cy="16.2" r="2.5" fill="currentColor" />
      <circle cx="33.4" cy="16.2" r="2.5" fill="currentColor" />

      {/* head — broad and low, wider than it is tall */}
      <path
        d="M24 11.4c7.8 0 13.2 4.8 13.2 10.8 0 6.4-5.6 10.8-13.2 10.8s-13.2-4.4-13.2-10.8c0-6 5.4-10.8 13.2-10.8Z"
        fill="currentColor"
      />

      {/* eyes */}
      <circle cx="18.9" cy="20.2" r="1.75" fill="var(--bg)" />
      <circle cx="29.1" cy="20.2" r="1.75" fill="var(--bg)" />

      {/* muzzle — wide and flat */}
      <ellipse cx="24" cy="26.8" rx="6.4" ry="4" fill="var(--bg)" opacity="0.94" />

      {/* nose + mouth */}
      <path
        d="M24 23.9c1.45 0 2.3.85 2.3 1.7 0 .95-.95 1.6-2.3 1.6s-2.3-.65-2.3-1.6c0-.85.85-1.7 2.3-1.7Z"
        fill="currentColor"
      />
      <path
        d="M24 27.2v1.1M24 28.3c-.85.95-2.5.95-3.2 0M24 28.3c.85.95 2.5.95 3.2 0"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* whiskers */}
      <path
        d="M17.6 25.6h-3.4M17.8 27.6l-3.2.9M30.4 25.6h3.4M30.2 27.6l3.2.9"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
