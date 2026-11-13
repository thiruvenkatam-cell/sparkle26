
import '../styles/loder.css'

export default function Loader() {
  return (
    <div className="loader-screen">
      <video
        className="loader-video"
        src="/sparkle-intro.mp4"
        autoPlay
        muted
        playsInline
      />
    </div>
  )
}
