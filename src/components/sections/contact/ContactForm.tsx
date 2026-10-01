"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { User } from "@phosphor-icons/react/dist/ssr/User";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { ChatCircleText } from "@phosphor-icons/react/dist/ssr/ChatCircleText";
import { PencilSimple } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr/PaperPlaneTilt";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { Copy } from "@phosphor-icons/react/dist/ssr/Copy";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type Field = "name" | "email" | "subject" | "message";
type Values = Record<Field, string>;
type Status = "idle" | "sending" | "sent" | "draft" | "error";
type Mode = "checking" | "api" | "mailto";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (v.name.trim().length < 2) e.name = "Enter your name.";
  if (!v.email.trim()) e.email = "Enter your email address so I can reply.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "This email address looks incomplete. Check it and try again.";
  if (v.subject.length > 150) e.subject = "Keep the subject under 150 characters.";
  if (v.message.trim().length < 10) e.message = "Write a message of at least 10 characters.";
  return e;
}

const fields: { id: Field; label: string; type: string; autoComplete: string; Icon: typeof User; optional?: boolean }[] = [
  { id: "name", label: "Your name", type: "text", autoComplete: "name", Icon: User },
  { id: "email", label: "Your email", type: "email", autoComplete: "email", Icon: EnvelopeSimple },
  { id: "subject", label: "Subject", type: "text", autoComplete: "off", Icon: ChatCircleText, optional: true },
];

export function ContactForm() {
  const id = useId();
  const reduce = useReducedMotion();
  const [values, setValues] = useState<Values>({ name: "", email: "", subject: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [mode, setMode] = useState<Mode>("checking");
  const [copied, setCopied] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Ask the server whether an email service is configured; if not (or unreachable), use the email-draft path.
  useEffect(() => {
    let alive = true;
    fetch("/api/contact", { method: "GET", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { configured: false }))
      .then((d: { configured?: boolean }) => alive && setMode(d.configured ? "api" : "mailto"))
      .catch(() => alive && setMode("mailto"));
    return () => {
      alive = false;
    };
  }, []);

  // client-side validation first; a server message only adds to it (cleared keys must not erase it)
  const errors: Partial<Record<Field, string>> = { ...validate(values) };
  for (const [k, v] of Object.entries(serverErrors) as [Field, string | undefined][]) {
    if (v) errors[k] = v;
  }
  const show = (f: Field) => (touched[f] ? errors[f] : undefined);

  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [f]: e.target.value }));
    setServerErrors((s) => ({ ...s, [f]: undefined }));
    if (status === "error" || status === "draft") setStatus("idle");
  };

  const subjectLine = values.subject.trim() || "Shoot enquiry";
  const bodyText = `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`;
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(bodyText)}`;

  const focusStatus = () => requestAnimationFrame(() => statusRef.current?.focus());

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = validate(values);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(v).length) {
      const first = (["name", "email", "subject", "message"] as Field[]).find((f) => v[f]);
      if (first) document.getElementById(`${id}-${first}`)?.focus();
      return;
    }

    if (mode !== "api") {
      // Honest fallback: hand the message to the visitor's own email app. Nothing is sent from here.
      window.location.href = mailto;
      setStatus("draft");
      focusStatus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypot.current?.value ?? "" }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: Record<Field, string> };
      if (res.ok && data.ok) {
        setSentTo(values.email.trim());
        setStatus("sent");
        setValues({ name: "", email: "", subject: "", message: "" });
        setTouched({});
      } else if (res.status === 501) {
        setMode("mailto");
        setStatus("idle");
      } else if (data.fieldErrors) {
        setServerErrors(data.fieldErrors);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    focusStatus();
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${site.email}\nSubject: ${subjectLine}\n\n${bodyText}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border bg-white py-3 pl-10 pr-3.5 text-[0.95rem] text-ink placeholder:text-[#7a8699] transition-[border-color,box-shadow] duration-200 focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue/15";

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby={`${id}-intro`} className="grid gap-4">
      <div>
        <h2 className="text-[1.45rem] font-[640] tracking-[-0.025em] text-ink">Send a message</h2>
        <p id={`${id}-intro`} className="mt-1 text-[0.9rem] text-ink-2">
          {mode === "api"
            ? "I'll get back to you as soon as possible."
            : "Your message opens as a ready-to-send draft in your email app."}
        </p>
      </div>

      {fields.map((f, i) => (
        <motion.div
          key={f.id}
          className="grid gap-1.5"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.45, delay: 0.2 + i * 0.08 }}
        >
          <label htmlFor={`${id}-${f.id}`} className="text-[0.84rem] font-medium text-ink">
            {f.label}
            {f.optional ? <span className="font-normal text-muted"> (optional)</span> : null}
          </label>
          <div className="relative">
            <f.Icon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
            <input
              id={`${id}-${f.id}`}
              name={f.id}
              type={f.type}
              autoComplete={f.autoComplete}
              value={values[f.id]}
              onChange={set(f.id)}
              onBlur={() => setTouched((t) => ({ ...t, [f.id]: true }))}
              aria-invalid={Boolean(show(f.id))}
              aria-describedby={show(f.id) ? `${id}-${f.id}-err` : undefined}
              required={!f.optional}
              className={cn(inputBase, show(f.id) ? "border-status-critical" : "border-line")}
            />
          </div>
          {show(f.id) ? (
            <p id={`${id}-${f.id}-err`} className="flex items-center gap-1.5 text-[0.8rem] font-medium text-[#b42318]">
              <WarningCircle size={15} weight="fill" aria-hidden />
              {show(f.id)}
            </p>
          ) : null}
        </motion.div>
      ))}

      <motion.div
        className="grid gap-1.5"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.45, delay: 0.44 }}
      >
        <label htmlFor={`${id}-message`} className="text-[0.84rem] font-medium text-ink">
          Your message
        </label>
        <div className="relative">
          <PencilSimple size={18} className="pointer-events-none absolute left-3.5 top-3.5 text-muted" aria-hidden />
          <textarea
            id={`${id}-message`}
            name="message"
            rows={5}
            value={values.message}
            onChange={set("message")}
            onBlur={() => setTouched((t) => ({ ...t, message: true }))}
            aria-invalid={Boolean(show("message"))}
            aria-describedby={show("message") ? `${id}-message-err` : undefined}
            required
            className={cn(inputBase, "resize-y", show("message") ? "border-status-critical" : "border-line")}
          />
        </div>
        {show("message") ? (
          <p id={`${id}-message-err`} className="flex items-center gap-1.5 text-[0.8rem] font-medium text-[#b42318]">
            <WarningCircle size={15} weight="fill" aria-hidden />
            {show("message")}
          </p>
        ) : null}
      </motion.div>

      {/* honeypot for bots; hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input ref={honeypot} id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === "sending" || mode === "checking"}
        className="btn btn-primary mt-1 h-[3.25rem] w-full text-[1rem] disabled:opacity-70"
      >
        {status === "sending" ? (
          <>
            <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Sending
          </>
        ) : (
          <>
            {mode === "api" ? "Send message" : "Open email draft"}
            <PaperPlaneTilt size={18} weight="bold" className="btn-arrow" aria-hidden />
          </>
        )}
      </button>

      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <motion.p
              key="sent"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2.5 rounded-xl border border-[#abefc6] bg-[#ecfdf3] p-3.5 text-[0.88rem] text-[#05603a]"
            >
              <CheckCircle size={20} weight="fill" className="shrink-0" aria-hidden />
              <span>
                <strong>Message sent.</strong> Thank you, I&apos;ll reply to {sentTo}.
              </span>
            </motion.p>
          ) : null}
          {status === "draft" ? (
            <motion.div
              key="draft"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid gap-2.5 rounded-xl border border-line bg-mist p-3.5 text-[0.86rem] text-ink-2"
            >
              <p>
                <strong className="text-ink">Your email app should now show the draft.</strong> Nothing has been sent
                yet: press send there to deliver it. If no draft appeared, email{" "}
                <a className="font-semibold text-blue underline underline-offset-2" href={`mailto:${site.email}`}>
                  {site.email}
                </a>{" "}
                or copy the message.
              </p>
              <button
                type="button"
                onClick={copyMessage}
                className="tap inline-flex h-9 items-center gap-2 self-start rounded-full border border-line bg-white px-3.5 text-[0.8rem] font-medium text-ink hover:border-blue hover:text-blue"
              >
                <Copy size={15} aria-hidden />
                {copied ? "Copied" : "Copy message"}
              </button>
            </motion.div>
          ) : null}
          {status === "error" ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2.5 rounded-xl border border-[#fecdca] bg-[#fef3f2] p-3.5 text-[0.88rem] text-[#912018]"
            >
              <WarningCircle size={20} weight="fill" className="shrink-0" aria-hidden />
              <span>
                <strong>The message could not be sent.</strong> Your text is still here. Try again, or email{" "}
                <a className="font-semibold underline underline-offset-2" href={mailto}>
                  {site.email}
                </a>{" "}
                directly.
              </span>
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}
