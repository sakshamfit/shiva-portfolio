import { SquaresFour } from "@phosphor-icons/react/dist/ssr/SquaresFour";
import { Package } from "@phosphor-icons/react/dist/ssr/Package";
import { Truck } from "@phosphor-icons/react/dist/ssr/Truck";
import { Handshake } from "@phosphor-icons/react/dist/ssr/Handshake";
import { ChartLineUp } from "@phosphor-icons/react/dist/ssr/ChartLineUp";
import { Gear } from "@phosphor-icons/react/dist/ssr/Gear";
import Image from "next/image";
import { MINI_WORLD_PORTS, MINI_WORLD_SRC, MINI_WORLD_VIEWBOX } from "@/content/geo/mini-world.generated";
import styles from "./skills.module.css";

const routes: [keyof typeof MINI_WORLD_PORTS, keyof typeof MINI_WORLD_PORTS][] = [
  ["gorakhpur", "varanasi"],
  ["gorakhpur", "lucknow"],
  ["gorakhpur", "patna"],
  ["gorakhpur", "ayodhya"],
  ["gorakhpur", "kushinagar"],
];

const arc = (a: readonly number[], b: readonly number[]) => {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2 - Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.25;
  return `M${a[0]},${a[1]}Q${mx.toFixed(0)},${my.toFixed(0)} ${b[0]},${b[1]}`;
};

// demonstration values (the screen says so)
const kpis = [
  { label: "Flights this season", value: "128", delta: "↑ 12%" },
  { label: "Delivered on time", value: "96.2%", delta: "↑ 3.1%" },
  { label: "Batteries in rotation", value: "18", delta: "→ steady" },
  { label: "Window forecast accuracy", value: "91%", delta: "↑ 1.8%" },
];
const forecast = [34, 40, 37, 46, 52, 49, 58, 63, 61, 70, 76, 82];
const levels = [
  { label: "Props", v: 78 },
  { label: "Batteries", v: 64 },
  { label: "Cards", v: 52 },
  { label: "Filters", v: 38 },
];

/** Static dashboard rendered inside the CSS laptop. Decorative (aria-hidden); demo values. */
export function LaptopScreen() {
  const nav = [SquaresFour, Package, Handshake, Truck, ChartLineUp, Gear];
  return (
    <div className={styles.screenUi} aria-hidden>
      <aside className={styles.screenNav}>
        <span className={styles.screenLogo} />
        {nav.map((Icon, i) => (
          <span key={i} className={i === 0 ? styles.navOn : styles.navItem}>
            <Icon size={11} weight={i === 0 ? "fill" : "regular"} />
          </span>
        ))}
      </aside>
      <div className={styles.screenMain}>
        <div className={styles.screenTop}>
          <span className={styles.screenTitle}>Flight &amp; Kit Control Room</span>
          <span className={styles.screenPill}>Demo data</span>
        </div>
        <div className={`${styles.screenMap} relative`}>
          <Image src={MINI_WORLD_SRC} alt="" fill unoptimized className="object-contain p-[0.8cqi]" />
          <svg viewBox={`0 0 ${MINI_WORLD_VIEWBOX.width} ${MINI_WORLD_VIEWBOX.height}`} className="absolute inset-0 h-full w-full p-[0.8cqi]">
            {routes.map(([a, b]) => (
              <path
                key={`${a}-${b}`}
                d={arc(MINI_WORLD_PORTS[a], MINI_WORLD_PORTS[b])}
                fill="none"
                stroke="#145fe5"
                strokeWidth="0.9"
                strokeOpacity="0.55"
                className={styles.route}
              />
            ))}
            {Object.values(MINI_WORLD_PORTS).map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2.2" fill="#0b3d91" />
            ))}
          </svg>
        </div>
        <div className={styles.screenKpis}>
          {kpis.map((k) => (
            <div key={k.label} className={styles.screenKpi}>
              <span className={styles.kpiLabel}>{k.label}</span>
              <span className={styles.kpiValue}>{k.value}</span>
              <span className={styles.kpiDelta}>{k.delta}</span>
            </div>
          ))}
        </div>
        <div className={styles.screenCharts}>
          <div className={styles.screenCard}>
            <span className={styles.kpiLabel}>Battery plan, next 12 shoots</span>
            <div className={styles.bars}>
              {forecast.map((v, i) => (
                <span key={i} style={{ height: `${v}%`, ["--i" as string]: i }} />
              ))}
            </div>
          </div>
          <div className={styles.screenCard}>
            <span className={styles.kpiLabel}>Kit stock</span>
            <div className={styles.hbars}>
              {levels.map((l, i) => (
                <div key={l.label} className={styles.hbar}>
                  <span>{l.label}</span>
                  <span className={styles.hbarTrack}>
                    <span style={{ width: `${l.v}%`, ["--i" as string]: i }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
