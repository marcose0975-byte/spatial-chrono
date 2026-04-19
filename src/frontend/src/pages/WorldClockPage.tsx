import { usePinnedZones } from "@/hooks/use-clock-data";
import { useClockSettings } from "@/hooks/use-clock-settings";
import type { PinnedZone, WorldCity } from "@/types";
import { Globe, MapPin, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── City database ────────────────────────────────────────────────────────────
const WORLD_CITIES: WorldCity[] = [
  {
    id: "new-york",
    cityName: "New York",
    timezone: "America/New_York",
    countryCode: "US",
    offset: 0,
  },
  {
    id: "los-angeles",
    cityName: "Los Angeles",
    timezone: "America/Los_Angeles",
    countryCode: "US",
    offset: 0,
  },
  {
    id: "chicago",
    cityName: "Chicago",
    timezone: "America/Chicago",
    countryCode: "US",
    offset: 0,
  },
  {
    id: "toronto",
    cityName: "Toronto",
    timezone: "America/Toronto",
    countryCode: "CA",
    offset: 0,
  },
  {
    id: "vancouver",
    cityName: "Vancouver",
    timezone: "America/Vancouver",
    countryCode: "CA",
    offset: 0,
  },
  {
    id: "mexico-city",
    cityName: "Mexico City",
    timezone: "America/Mexico_City",
    countryCode: "MX",
    offset: 0,
  },
  {
    id: "sao-paulo",
    cityName: "São Paulo",
    timezone: "America/Sao_Paulo",
    countryCode: "BR",
    offset: 0,
  },
  {
    id: "buenos-aires",
    cityName: "Buenos Aires",
    timezone: "America/Argentina/Buenos_Aires",
    countryCode: "AR",
    offset: 0,
  },
  {
    id: "london",
    cityName: "London",
    timezone: "Europe/London",
    countryCode: "GB",
    offset: 0,
  },
  {
    id: "paris",
    cityName: "Paris",
    timezone: "Europe/Paris",
    countryCode: "FR",
    offset: 0,
  },
  {
    id: "berlin",
    cityName: "Berlin",
    timezone: "Europe/Berlin",
    countryCode: "DE",
    offset: 0,
  },
  {
    id: "rome",
    cityName: "Rome",
    timezone: "Europe/Rome",
    countryCode: "IT",
    offset: 0,
  },
  {
    id: "madrid",
    cityName: "Madrid",
    timezone: "Europe/Madrid",
    countryCode: "ES",
    offset: 0,
  },
  {
    id: "amsterdam",
    cityName: "Amsterdam",
    timezone: "Europe/Amsterdam",
    countryCode: "NL",
    offset: 0,
  },
  {
    id: "istanbul",
    cityName: "Istanbul",
    timezone: "Europe/Istanbul",
    countryCode: "TR",
    offset: 0,
  },
  {
    id: "moscow",
    cityName: "Moscow",
    timezone: "Europe/Moscow",
    countryCode: "RU",
    offset: 0,
  },
  {
    id: "cairo",
    cityName: "Cairo",
    timezone: "Africa/Cairo",
    countryCode: "EG",
    offset: 0,
  },
  {
    id: "nairobi",
    cityName: "Nairobi",
    timezone: "Africa/Nairobi",
    countryCode: "KE",
    offset: 0,
  },
  {
    id: "lagos",
    cityName: "Lagos",
    timezone: "Africa/Lagos",
    countryCode: "NG",
    offset: 0,
  },
  {
    id: "johannesburg",
    cityName: "Johannesburg",
    timezone: "Africa/Johannesburg",
    countryCode: "ZA",
    offset: 0,
  },
  {
    id: "dubai",
    cityName: "Dubai",
    timezone: "Asia/Dubai",
    countryCode: "AE",
    offset: 0,
  },
  {
    id: "mumbai",
    cityName: "Mumbai",
    timezone: "Asia/Kolkata",
    countryCode: "IN",
    offset: 0,
  },
  {
    id: "delhi",
    cityName: "Delhi",
    timezone: "Asia/Kolkata",
    countryCode: "IN",
    offset: 0,
  },
  {
    id: "bangkok",
    cityName: "Bangkok",
    timezone: "Asia/Bangkok",
    countryCode: "TH",
    offset: 0,
  },
  {
    id: "singapore",
    cityName: "Singapore",
    timezone: "Asia/Singapore",
    countryCode: "SG",
    offset: 0,
  },
  {
    id: "hong-kong",
    cityName: "Hong Kong",
    timezone: "Asia/Hong_Kong",
    countryCode: "HK",
    offset: 0,
  },
  {
    id: "tokyo",
    cityName: "Tokyo",
    timezone: "Asia/Tokyo",
    countryCode: "JP",
    offset: 0,
  },
  {
    id: "seoul",
    cityName: "Seoul",
    timezone: "Asia/Seoul",
    countryCode: "KR",
    offset: 0,
  },
  {
    id: "sydney",
    cityName: "Sydney",
    timezone: "Australia/Sydney",
    countryCode: "AU",
    offset: 0,
  },
  {
    id: "auckland",
    cityName: "Auckland",
    timezone: "Pacific/Auckland",
    countryCode: "NZ",
    offset: 0,
  },
];

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  MX: "Mexico",
  BR: "Brazil",
  AR: "Argentina",
  GB: "United Kingdom",
  FR: "France",
  DE: "Germany",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  TR: "Turkey",
  RU: "Russia",
  EG: "Egypt",
  KE: "Kenya",
  NG: "Nigeria",
  ZA: "South Africa",
  AE: "UAE",
  IN: "India",
  TH: "Thailand",
  SG: "Singapore",
  HK: "Hong Kong",
  JP: "Japan",
  KR: "South Korea",
  AU: "Australia",
  NZ: "New Zealand",
};

// ─── Time helpers ─────────────────────────────────────────────────────────────
function getLocalTime(timezone: string, now: Date, use24h: boolean): string {
  try {
    return now.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: !use24h,
    });
  } catch {
    return "--:--:--";
  }
}

function getOffsetString(timezone: string, now: Date): string {
  try {
    const localOffsetMin = -now.getTimezoneOffset();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    }).formatToParts(now);
    const tzName = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    const match = tzName.match(/GMT([+-]\d+(?::\d+)?)?/);
    if (!match) return "";
    const raw = match[1] ?? "+0";
    const sign = raw.startsWith("-") ? -1 : 1;
    const [h, m = "0"] = raw.replace(/[+-]/, "").split(":");
    const cityOffsetMin = sign * (Number.parseInt(h) * 60 + Number.parseInt(m));
    const diffMin = cityOffsetMin - localOffsetMin;
    if (diffMin === 0) return "Local";
    const diffH = Math.round(diffMin / 60);
    return diffH >= 0 ? `+${diffH}h` : `${diffH}h`;
  } catch {
    return "";
  }
}

function isDaytime(timezone: string, now: Date): boolean {
  try {
    const h = Number.parseInt(
      now.toLocaleString("en-US", {
        timeZone: timezone,
        hour: "numeric",
        hour12: false,
      }),
    );
    return h >= 6 && h < 20;
  } catch {
    return true;
  }
}

// ─── City Card ────────────────────────────────────────────────────────────────
interface CityCardProps {
  city: WorldCity;
  isPinned: boolean;
  onPin: () => void;
  onUnpin: () => void;
  now: Date;
  use24h: boolean;
  index: number;
}

function CityCard({
  city,
  isPinned,
  onPin,
  onUnpin,
  now,
  use24h,
  index,
}: CityCardProps) {
  const timeStr = getLocalTime(city.timezone, now, use24h);
  const offsetStr = getOffsetString(city.timezone, now);
  const daytime = isDaytime(city.timezone, now);

  return (
    <motion.li
      data-ocid={`worldclock.item.${index + 1}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{
        duration: 0.28,
        ease: [0.4, 0, 0.2, 1],
        delay: Math.min(index * 0.04, 0.4),
      }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      className={[
        "relative rounded-2xl overflow-hidden list-none",
        "glass glass-rim",
        isPinned ? "ring-1 ring-[oklch(0.75_0.18_220/0.45)] glow-cyan-sm" : "",
      ].join(" ")}
    >
      {/* Top-edge specular */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.1) 60%, transparent)",
        }}
        aria-hidden="true"
      />

      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Day/night indicator */}
        <div
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg select-none"
          style={{
            background: daytime
              ? "oklch(0.75 0.12 85 / 0.18)"
              : "oklch(0.45 0.12 250 / 0.22)",
          }}
          aria-hidden="true"
        >
          {daytime ? "☀️" : "🌙"}
        </div>

        {/* City info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-vibrant-primary font-semibold text-[15px] truncate leading-snug">
              {city.cityName}
            </span>
            {isPinned && (
              <span
                className="shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ background: "oklch(0.75 0.18 220)" }}
                aria-label="Pinned"
              />
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-vibrant-secondary text-xs truncate">
              {COUNTRY_NAMES[city.countryCode] ?? city.countryCode}
            </span>
            {offsetStr && (
              <>
                <span className="text-vibrant-tertiary text-xs">·</span>
                <span className="text-vibrant-tertiary text-xs font-medium tabular-nums">
                  {offsetStr}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Live time */}
        <div className="shrink-0 text-right">
          <span
            className="text-mono-clock text-xl text-vibrant-primary tabular-nums block leading-none"
            aria-live="polite"
            aria-atomic="true"
          >
            {timeStr}
          </span>
        </div>

        {/* Pin / Unpin button */}
        <motion.button
          data-ocid={
            isPinned
              ? `worldclock.unpin_button.${index + 1}`
              : `worldclock.pin_button.${index + 1}`
          }
          onClick={isPinned ? onUnpin : onPin}
          whileTap={{ scale: 0.85 }}
          aria-label={
            isPinned ? `Unpin ${city.cityName}` : `Pin ${city.cityName}`
          }
          className={[
            "shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-smooth",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isPinned ? "bg-[oklch(0.75_0.18_220/0.2)]" : "hover:bg-white/5",
          ].join(" ")}
        >
          <MapPin
            size={15}
            className={isPinned ? "fill-current" : ""}
            style={{
              color: isPinned ? "oklch(0.75 0.18 220)" : "oklch(0.45 0.04 245)",
            }}
          />
        </motion.button>
      </div>
    </motion.li>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WorldClockPage() {
  const { zones, addZone, removeZone } = usePinnedZones();
  const { settings, toggle24Hour } = useClockSettings();
  const [now, setNow] = useState(() => new Date());
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Live clock tick
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pinnedIds = useMemo(() => new Set(zones.map((z) => z.id)), [zones]);

  const filteredCities = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return WORLD_CITIES;
    return WORLD_CITIES.filter(
      (c) =>
        c.cityName.toLowerCase().includes(q) ||
        (COUNTRY_NAMES[c.countryCode] ?? "").toLowerCase().includes(q) ||
        c.countryCode.toLowerCase().includes(q),
    );
  }, [query]);

  const sortedCities = useMemo(() => {
    const pinned = filteredCities.filter((c) => pinnedIds.has(c.id));
    const rest = filteredCities.filter((c) => !pinnedIds.has(c.id));
    return [...pinned, ...rest];
  }, [filteredCities, pinnedIds]);

  function handlePin(city: WorldCity) {
    const zone: PinnedZone = {
      id: city.id,
      cityName: city.cityName,
      timezone: city.timezone,
      countryCode: city.countryCode,
    };
    addZone(zone);
  }

  return (
    <div
      className="flex flex-col min-h-full px-4 pt-6 pb-4"
      data-ocid="worldclock.page"
    >
      {/* ─── Header ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center justify-between mb-5"
        data-ocid="worldclock.section"
      >
        <h1 className="text-vibrant-primary text-2xl font-bold tracking-tight font-display">
          World Clock
        </h1>

        {/* 12/24h toggle */}
        <button
          type="button"
          data-ocid="worldclock.toggle"
          onClick={toggle24Hour}
          aria-label={
            settings.use24HourFormat
              ? "Switch to 12-hour format"
              : "Switch to 24-hour format"
          }
          aria-pressed={settings.use24HourFormat}
          className="relative h-8 rounded-full px-1 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{
            width: 76,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {/* Sliding pill indicator */}
          <motion.div
            animate={{ x: settings.use24HourFormat ? 36 : 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute left-1 top-1 bottom-1 w-8 rounded-full pointer-events-none"
            style={{
              background: "oklch(0.75 0.18 220 / 0.28)",
              border: "1px solid oklch(0.75 0.18 220 / 0.5)",
            }}
          />
          <span className="relative z-10 flex w-full text-xs font-semibold select-none pointer-events-none">
            <span
              className="flex-1 flex items-center justify-center transition-smooth"
              style={{
                color: !settings.use24HourFormat
                  ? "oklch(0.95 0.02 245)"
                  : "oklch(0.42 0.04 245)",
              }}
            >
              12h
            </span>
            <span
              className="flex-1 flex items-center justify-center transition-smooth"
              style={{
                color: settings.use24HourFormat
                  ? "oklch(0.95 0.02 245)"
                  : "oklch(0.42 0.04 245)",
              }}
            >
              24h
            </span>
          </span>
        </button>
      </motion.div>

      {/* ─── Search bar ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.06, ease: [0.4, 0, 0.2, 1] }}
        className="relative mb-4"
      >
        <Globe
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "oklch(0.45 0.04 245)" }}
          aria-hidden="true"
        />
        <input
          ref={searchRef}
          data-ocid="worldclock.search_input"
          type="search"
          placeholder="Search cities or countries…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search world cities"
          className="w-full h-11 pl-10 pr-9 rounded-2xl text-sm text-vibrant-primary placeholder:text-vibrant-tertiary focus:outline-none focus:ring-1 focus:ring-[oklch(0.75_0.18_220/0.55)] transition-smooth"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
          }}
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              aria-label="Clear search"
              data-ocid="worldclock.clear_search_button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-smooth hover:bg-white/10"
              style={{ color: "oklch(0.45 0.04 245)" }}
            >
              <X size={12} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ─── Pinned count hint ──────────────────────────────────── */}
      <AnimatePresence>
        {zones.length > 0 && !query && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-vibrant-tertiary text-xs mb-3 flex items-center gap-1"
          >
            <MapPin size={10} aria-hidden="true" />
            <span>
              {zones.length} {zones.length === 1 ? "city" : "cities"} pinned
            </span>
          </motion.p>
        )}
      </AnimatePresence>

      {/* ─── City list ──────────────────────────────────────────── */}
      <ul className="flex flex-col gap-2.5" data-ocid="worldclock.list">
        <AnimatePresence mode="popLayout" initial={false}>
          {sortedCities.length > 0 ? (
            sortedCities.map((city, i) => (
              <CityCard
                key={city.id}
                city={city}
                isPinned={pinnedIds.has(city.id)}
                onPin={() => handlePin(city)}
                onUnpin={() => removeZone(city.id)}
                now={now}
                use24h={settings.use24HourFormat}
                index={i}
              />
            ))
          ) : (
            <motion.output
              key="empty"
              data-ocid="worldclock.empty_state"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
              aria-live="polite"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.75 0.18 220 / 0.08)",
                  border: "1px solid oklch(0.75 0.18 220 / 0.22)",
                }}
              >
                <Globe size={28} style={{ color: "oklch(0.45 0.04 245)" }} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-vibrant-secondary text-base font-medium">
                  No cities found
                </p>
                <p className="text-vibrant-tertiary text-sm">
                  Try a different city or country name
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuery("")}
                data-ocid="worldclock.empty_clear_button"
                className="text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-2"
                style={{ color: "oklch(0.75 0.18 220)" }}
              >
                Clear search
              </button>
            </motion.output>
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
}
