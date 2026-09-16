function base(props) {
  return {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    width: 22,
    height: 22,
    'aria-hidden': 'true',
    ...props,
  }
}

export function ScanIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 8a2 2 0 0 1 2-2h1.2l.9-1.5A1 1 0 0 1 9 4h6a1 1 0 0 1 .9.5L16.8 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  )
}

export function HistoryIcon(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  )
}

export function GlucoseIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 3c3.5 4 6 7.6 6 10.5A6 6 0 0 1 6 13.5C6 10.6 8.5 7 12 3Z" />
    </svg>
  )
}

export function AboutIcon(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function NoticeIcon(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="8" x2="12" y2="12.5" />
      <circle cx="12" cy="15.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function CheckIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

export function BackIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

export function ShieldIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5l6.5 2.6v5c0 4.4-2.8 7.7-6.5 9.4-3.7-1.7-6.5-5-6.5-9.4v-5L12 3.5Z" />
    </svg>
  )
}

export function SwapIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M6 8h11l-3-3" />
      <path d="M18 16H7l3 3" />
    </svg>
  )
}

export function PencilIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 20l1-4L16.5 4.5a1.5 1.5 0 0 1 2.1 0l.9.9a1.5 1.5 0 0 1 0 2.1L8 19l-4 1Z" />
    </svg>
  )
}

export function LightbulbIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4.9 1 .9 1.7V16h5.2v-.4c0-.7.3-1.3.9-1.7A6 6 0 0 0 12 3Z" />
    </svg>
  )
}

export function BookmarkIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M6 4h12v16l-6-4-6 4Z" />
    </svg>
  )
}

export function TrashIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M5 7h14" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M7 7l1 13h8l1-13" />
    </svg>
  )
}

export function WalkIcon(props) {
  return (
    <svg {...base(props)}>
      <circle cx="13.2" cy="4.3" r="1.6" fill="currentColor" stroke="none" />
      <path d="M11 9l-1.5 4 2 1.5-.8 6.5" />
      <path d="M11 9l3 .5 2.5 2.5" />
      <path d="M13.5 15l2.5 1.5 1.5 3.5" />
      <path d="M9.5 13l-3 1.5-1 3" />
    </svg>
  )
}

export function ChevronIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function DownloadIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 4v11" />
      <path d="M7.5 11.5L12 16l4.5-4.5" />
      <path d="M5 19.5h14" />
    </svg>
  )
}

export function UploadIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 16V5" />
      <path d="M7.5 9.5L12 5l4.5 4.5" />
      <path d="M5 19.5h14" />
    </svg>
  )
}

export function SettingsIcon(props) {
  return (
    <svg {...base(props)}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <circle cx="9" cy="7" r="2.2" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="15" cy="12" r="2.2" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <circle cx="11" cy="17" r="2.2" />
    </svg>
  )
}

export function MessageIcon(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 5.5h16v11H9l-4 3.5v-3.5H4z" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="13" x2="13" y2="13" />
    </svg>
  )
}

export function ProfileIcon(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8.3" r="3.3" />
      <path d="M5.2 20c1-3.7 4.1-5.8 6.8-5.8s5.8 2.1 6.8 5.8" />
    </svg>
  )
}
