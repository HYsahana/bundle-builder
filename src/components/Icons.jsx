// Step 1: Security Camera
export function CameraIcon({ className = '' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Camera body */}
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

// Step 2: Shield (Plan)
export function ShieldIcon({ className = '' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

// Step 3: Sensor (wifi / signal waves)
export function SensorIcon({ className = '' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Outer arc */}
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      {/* Middle arc */}
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      {/* Inner arc */}
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      {/* Dot */}
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Step 4: Extras / Protection (lock)
export function ProtectionIcon({ className = '' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Review Panel: Wyze-style shield badge for plan
export function PlanShieldIcon({ className = '' }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className={className}
    >
      {/* Shield shape */}
      <path
        d="M14 2L4 6.5V13c0 6.5 6 11.5 10 13 4-1.5 10-6.5 10-13V6.5L14 2z"
        fill="#4F2FD6"
      />
      {/* "W" mark inside shield */}
      <text
        x="14"
        y="17"
        fontSize="7"
        fontWeight="900"
        fontFamily="sans-serif"
        fill="#ffffff"
        textAnchor="middle"
        letterSpacing="-0.3px"
      >
        W
      </text>
    </svg>
  );
}

// Chevron up (for open accordion steps)
export function ArrowUpIcon({ className = '' }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="#4F2FD6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="2 9 7 4 12 9" />
    </svg>
  );
}

// Chevron down (for closed accordion steps)
export function ArrowDownIcon({ className = '' }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="#4F2FD6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="2 5 7 10 12 5" />
    </svg>
  );
}

// Shipping truck icon
export function ShippingIcon({ className = '' }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0d9488"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Truck cabin */}
      <rect x="1" y="3" width="15" height="13" rx="1" />
      {/* Trailer */}
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      {/* Wheels */}
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
