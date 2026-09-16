import { MessageIcon } from './icons'

const WHATSAPP_LINK =
  'https://wa.me/60198373118?text=' +
  encodeURIComponent('Hi! I found something in SugarSafe I wanted to mention:')

export default function FeedbackBubble() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="feedback-bubble"
      aria-label="Found a bug or an error? WhatsApp me"
    >
      <span className="feedback-bubble-icon">
        <MessageIcon width={16} height={16} />
      </span>
    </a>
  )
}
