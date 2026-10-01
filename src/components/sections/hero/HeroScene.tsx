import Image from "next/image";
import styles from "./hero.module.css";

/**
 * The landing scene: an aerial photograph of the city at golden hour, with a tone layer and a
 * vignette over it so white type reads comfortably at every size. The parallax (10-18px) is a
 * CSS scroll-driven animation, so the opening screen needs no animation JavaScript; browsers
 * without scroll timelines simply show it still.
 */
export function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10" aria-hidden>
      <div className={`${styles.skyPar} absolute inset-0`}>
        <div className={`${styles.sky} absolute inset-[-3%]`}>
          <Image src="/images/hero/sky.jpg" alt="" fill priority sizes="100vw" quality={80} className="object-cover" />
        </div>
      </div>

      {/* tone: deepens the open sky toward the brand blue so white type reads comfortably */}
      <div className={`${styles.scrim} absolute inset-0`} />

      <div className={`${styles.vignette} absolute inset-0`} />
    </div>
  );
}
