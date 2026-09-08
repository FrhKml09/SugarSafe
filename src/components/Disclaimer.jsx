import { NoticeIcon } from './icons'

export default function Disclaimer() {
  return (
    <div className="disclaimer" role="alert" aria-live="polite">
      <span className="disclaimer-icon">
        <NoticeIcon width={17} height={17} />
      </span>
      <p>
        This is an estimated nutrition guide only. It is not a medical diagnosis,
        blood-glucose measurement, or treatment recommendation. Always consult a
        qualified healthcare professional for medical advice.
      </p>
    </div>
  )
}
