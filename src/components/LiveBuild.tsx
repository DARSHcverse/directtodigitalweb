"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./LiveBuild.module.css";

/**
 * The homepage demo: pick a business and watch its website get built.
 *
 * The businesses are deliberately generic ("Your Garage") so none can be
 * mistaken for a real client. It is markup and CSS rather than images or
 * video, so it adds almost nothing to the download, and it only cycles while
 * on screen.
 */
const SITES = [
  {
    label: "Garage",
    name: "Your Garage",
    url: "yourgarage.co.uk",
    colours: { bg: "#121519", ink: "#ffffff", panel: "#20262d", accent: "#ff6a2b", onAccent: "#121519" },
    head: "MOTs booked while you work.",
    text: "Pick a time for your MOT, service or repair.",
    cta: "Book your MOT",
    widget: "Next free slots",
    step: "MOT booking added",
    notice: "New booking: Thu 09:30 MOT",
    rows: [["Thu 09:30", "MOT"], ["Thu 11:00", "Service"], ["Fri 08:30", "Brakes"]],
  },
  {
    label: "Plumber",
    name: "Your Plumbing",
    url: "yourplumbing.co.uk",
    colours: { bg: "#e6f4ff", ink: "#06324f", panel: "#ffffff", accent: "#0369a8", onAccent: "#ffffff" },
    head: "Boilers, leaks and bathrooms.",
    text: "Tell us the problem and when suits you.",
    cta: "Request a visit",
    widget: "What do you need?",
    step: "Enquiry form added",
    notice: "New enquiry: boiler repair",
    rows: [["Boiler repair", "This week"], ["Leak", "Urgent"], ["Bathroom", "Quote"]],
  },
  {
    label: "Builder",
    name: "Your Builders",
    url: "yourbuilders.co.uk",
    colours: { bg: "#ffd84d", ink: "#1b1a16", panel: "#fff4bf", accent: "#1b1a16", onAccent: "#ffd84d" },
    head: "Extensions, built properly.",
    text: "See recent projects, then ask for a quote.",
    cta: "Get a quote",
    widget: "Recent projects",
    step: "Project gallery added",
    notice: "New quote request",
    rows: [["Rear extension", "Photos"], ["Loft conversion", "Photos"], ["New kitchen", "Photos"]],
  },
  {
    label: "App idea",
    name: "Your App",
    url: "yourapp.co.uk",
    colours: { bg: "#21124f", ink: "#ffffff", panel: "#33206f", accent: "#8ef5c8", onAccent: "#21124f" },
    head: "Your idea, on every phone.",
    text: "Accounts, payments and alerts, on iPhone and Android.",
    cta: "Get the app",
    widget: "Built in",
    step: "Accounts and payments added",
    notice: "Payment received",
    rows: [["Sign-in", "On"], ["Payments", "On"], ["Push alerts", "On"]],
  },
] as const;

const CYCLE_MS = 7000;

export function LiveBuild() {
  const rootRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef(true);
  const [view, setView] = useState({ active: 0, run: 0 });
  const site = SITES[view.active]!;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.dataset.ready = "true";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let onScreen = true;
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
    });
    observer.observe(root);
    const timer = window.setInterval(() => {
      if (!autoRef.current || !onScreen || document.hidden) return;
      setView((v) => ({ active: (v.active + 1) % SITES.length, run: v.run + 1 }));
    }, CYCLE_MS);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  const colours = {
    "--site-bg": site.colours.bg,
    "--site-ink": site.colours.ink,
    "--site-panel": site.colours.panel,
    "--site-accent": site.colours.accent,
    "--site-on-accent": site.colours.onAccent,
  } as CSSProperties;

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.choosers} role="group" aria-label="Choose a business">
        {SITES.map((s, i) => (
          <button
            key={s.label}
            type="button"
            aria-pressed={i === view.active}
            className={styles.chooser}
            onClick={() => {
              // Once someone chooses, stop changing it under them.
              autoRef.current = false;
              setView((v) => ({ active: i, run: v.run + 1 }));
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Keyed by run, so every change rebuilds and replays from the start. */}
      <div key={view.run} className={styles.stage} style={colours}>
        <div className={styles.log} aria-live="polite">
          {["Layout planned", "Words written", site.step, "Ready for phones", `Live on ${site.url}`].map((line) => (
            <p key={line}><b aria-hidden="true">✓</b>{line}</p>
          ))}
        </div>
        <div className={styles.machine} aria-hidden="true">
          <div className={styles.browser}>
            <div className={styles.bar}><i /><i /><i /><span>{site.url}</span></div>
            <div className={styles.site}>
              <div className={`${styles.brand} ${styles.b1}`}>
                <span>{site.name}</span><small>Services · About · Contact</small>
              </div>
              <div className={styles.copy}>
                <strong className={styles.b2}>{site.head}</strong>
                <p className={styles.b3}>{site.text}</p>
                <span className={`${styles.cta} ${styles.b4}`}>{site.cta}</span>
              </div>
              <div className={`${styles.card} ${styles.b4}`}>
                <span>{site.widget}</span>
                {site.rows.map(([a, b]) => (
                  <div key={a} className={styles.slot}><span>{a}</span><em>{b}</em></div>
                ))}
              </div>
            </div>
            <div className={styles.wire}><div><i /><i /><i /></div><div><i /></div></div>
            <span className={styles.scan} />
          </div>
          <div className={styles.phone}>
            <div className={styles.screen}>
              <small>{site.name}</small>
              <div className={styles.note}>{site.notice}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
