import { useState, useRef, useCallback, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { registerPartner } from "../api/client";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const USE_CASES = [
  {
    title: "Restaurants",
    img: "/onboarding/usecase-restaurant.jpg",
    desc: "Accept reservations and payments from AI.",
    cta: "Book a table for two tonight near me",
    steps: [
      { label: "Finds availability", value: "Sunday Caf\u00e9 \u00b7 Table for 2 \u00b7 11:30 AM" },
      { label: "Books and pays", value: "Reservation confirmed" },
      { label: "Finalizes", value: "Added to your calendar" },
    ],
  },
  {
    title: "Gyms & fitness studios",
    img: "/onboarding/usecase-gym.png",
    desc: "Fill classes and manage bookings through AI.",
    cta: "Book a yoga class tomorrow morning",
    steps: [
      { label: "Finds availability", value: "Yoga class \u00b7 Tomorrow \u00b7 9:00 AM" },
      { label: "Books and pays", value: "Reservation confirmed" },
      { label: "Finalizes", value: "Added to your calendar" },
    ],
  },
  {
    title: "Wellness & beauty",
    img: "/onboarding/usecase-wellness.jpg",
    desc: "Turn availability into confirmed appointments.",
    cta: "Find a massage nearby tonight",
    steps: [
      { label: "Finds availability", value: "Serenity Spa \u00b7 Massage \u00b7 7:00 PM" },
      { label: "Books and pays", value: "Appointment confirmed" },
      { label: "Finalizes", value: "Added to your calendar" },
    ],
  },
  {
    title: "Sports venues",
    img: "/onboarding/usecase-sports.jpg",
    desc: "Make courts and facilities bookable in real time.",
    cta: "Reserve a tennis court at 7 PM",
    steps: [
      { label: "Finds availability", value: "Tennis court \u00b7 Today \u00b7 7:00 PM" },
      { label: "Books and pays", value: "Appointment confirmed" },
      { label: "Finalizes", value: "Added to your calendar" },
    ],
  },
  {
    title: "Events & venues",
    img: "/onboarding/usecase-events.jpg",
    desc: "Sell tickets through AI assistants.",
    cta: "Find live music tonight near me",
    steps: [
      { label: "Finds availability", value: "Live jazz at Blue Note \u00b7 8:00 PM" },
      { label: "Books and pays", value: "Appointment confirmed" },
      { label: "Finalizes", value: "Added to your calendar" },
    ],
  },
];

const TAB_LABELS = [
  { label: "Restaurants", icon: "/onboarding/icon-cutlery.svg" },
  { label: "Gyms & fitness", icon: "/onboarding/icon-dumbbell.svg" },
  { label: "Wellness & beauty", icon: "/onboarding/icon-yinyang.svg" },
  { label: "Sports venues", icon: "/onboarding/icon-flag.svg" },
  { label: "Events & venues", icon: "/onboarding/icon-ticket.svg" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Landing() {
  const navigate = useNavigate();

  /* ---- Use-case tab state ---- */
  const [activeTab, setActiveTab] = useState(0);
  const [ucTitle, setUcTitle] = useState(USE_CASES[0].title);
  const [ucDesc, setUcDesc] = useState(USE_CASES[0].desc);
  const [ucCta, setUcCta] = useState(USE_CASES[0].cta);
  const [ucSteps, setUcSteps] = useState(USE_CASES[0].steps);
  const [textVisible, setTextVisible] = useState(true);

  const imgCurRef = useRef<HTMLImageElement>(null);
  const imgNextRef = useRef<HTMLImageElement>(null);

  /* ---- Signup state ---- */
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  /* ---- Tab switch (mirrors vanilla JS switchTab) ---- */
  const switchTab = useCallback(
    (index: number) => {
      if (index === activeTab) return;
      setActiveTab(index);

      const uc = USE_CASES[index];
      const imgCur = imgCurRef.current;
      const imgNext = imgNextRef.current;

      // 1) Fade out text
      setTextVisible(false);

      // 2) Slide images
      if (imgCur && imgNext) {
        imgNext.src = uc.img;
        imgNext.style.transition = "none";
        imgNext.style.transform = "translateX(100%)";
        void imgNext.offsetWidth; // force reflow

        imgCur.style.transition = "transform 0.45s ease-in-out";
        imgNext.style.transition = "transform 0.45s ease-in-out";
        imgCur.style.transform = "translateX(-100%)";
        imgNext.style.transform = "translateX(0)";
      }

      // 3) After text fade (250ms), update content + fade in
      setTimeout(() => {
        setUcTitle(uc.title);
        setUcDesc(uc.desc);
        setUcCta(uc.cta);
        setUcSteps(uc.steps);
        setTextVisible(true);
      }, 250);

      // 4) After slide (500ms), reset images
      setTimeout(() => {
        if (imgCur && imgNext) {
          imgCur.style.transition = "none";
          imgCur.src = uc.img;
          imgCur.style.transform = "translateX(0)";
          imgNext.style.transition = "none";
          imgNext.style.transform = "translateX(100%)";
        }
      }, 500);
    },
    [activeTab],
  );

  /* ---- Email signup ---- */
  const showEmailForm = () => {
    setShowForm(true);
    setTimeout(() => emailRef.current?.focus(), 0);
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value ?? "";
    setErrorMsg("");
    setLoading(true);

    try {
      const data = await registerPartner(email);
      navigate(`/${data.partner.id}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong.";
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  /* ---- Render ---- */
  return (
    <div style={{ backgroundColor: "#fff7e8", color: "#000" }}>
      {/* ==================== HEADER ==================== */}
      <header style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{ padding: "24px 0" }}
          className="flex items-center justify-between"
        >
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src="/onboarding/header-logo.svg"
              alt="What'sDo"
              style={{
                width: "219.767px",
                height: 21,
                transform: "scaleX(-1)",
                display: "block",
              }}
            />
          </a>
          {/* Nav */}
          <div className="flex items-center" style={{ gap: 20 }}>
            <div className="flex" style={{ gap: 20 }}>
              <a
                href="#"
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#000",
                  textDecoration: "none",
                }}
              >
                Developers
              </a>
              <a
                href="#"
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#000",
                  textDecoration: "none",
                }}
              >
                Business
              </a>
              <a
                href="#"
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#000",
                  textDecoration: "none",
                }}
              >
                About us
              </a>
              <a
                href="#"
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#000",
                  textDecoration: "none",
                }}
              >
                Docs
              </a>
            </div>
            <div className="flex" style={{ gap: 8 }}>
              <a
                href="#"
                className="btn btn-outline"
                style={{
                  border: "1px solid #000",
                  background: "transparent",
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#000",
                  textDecoration: "none",
                  borderRadius: 0,
                  display: "inline-block",
                }}
              >
                Sign in
              </a>
              <a
                href="#signup"
                className="btn"
                style={{
                  backgroundColor: "#000",
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff7e8",
                  textDecoration: "none",
                  borderRadius: 0,
                  display: "inline-block",
                }}
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== HERO ==================== */}
      <section style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Text content */}
        <div style={{ paddingTop: 80, textAlign: "center" }}>
          <h1
            className="font-alpina"
            style={{
              fontWeight: 500,
              fontSize: 72,
              lineHeight: "72px",
              color: "#000",
            }}
          >
            Get booked by AI.
          </h1>
          <p
            style={{
              marginTop: 24,
              fontSize: 20,
              lineHeight: "28px",
              opacity: 0.6,
              fontWeight: 400,
            }}
          >
            A new source of bookings and payments.
          </p>
          <div
            className="flex items-center justify-center"
            style={{ marginTop: 48, gap: 16 }}
          >
            <a
              href="#signup"
              className="btn"
              style={{
                backgroundColor: "#000",
                color: "#ededed",
                padding: "8px 24px",
                fontSize: 16,
                lineHeight: "24px",
                fontWeight: 500,
                textDecoration: "none",
                borderRadius: 0,
                display: "inline-block",
              }}
            >
              Get started
            </a>
            <a
              href="#how-it-works"
              className="btn btn-outline"
              style={{
                border: "1px solid #000",
                color: "#000",
                background: "transparent",
                padding: "8px 24px",
                fontSize: 16,
                lineHeight: "24px",
                fontWeight: 600,
                textDecoration: "none",
                borderRadius: 0,
                display: "inline-block",
              }}
            >
              How it works
            </a>
          </div>
        </div>

        {/* Hero Image Container */}
        <div
          style={{
            marginTop: 60,
            height: 552,
            backgroundColor: "#daa67f",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src="/onboarding/hero-restaurant.jpg"
            alt="Restaurant scene"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 90%",
            }}
          />

          {/* RECEIPT CARD (torn bottom via SVG mask) */}
          <div
            style={{
              position: "absolute",
              left: "calc(50% + 144px)",
              top: "50%",
              transform: "translate(-50%, -50%) rotate(4.88deg)",
              background: "#ebddd3",
              width: 272,
              padding: 24,
              zIndex: 10,
              WebkitMaskImage: "url(/onboarding/receipt-mask.svg)",
              maskImage: "url(/onboarding/receipt-mask.svg)",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 11, fontWeight: "bold", margin: 0 }}>
                Briole
              </p>
              <p style={{ fontSize: 9, margin: "2px 0 0 0" }}>
                Italian Restaurant
              </p>
              <p style={{ fontSize: 9, margin: "2px 0 0 0" }}>New York, NY</p>
              <p style={{ fontSize: 9, margin: "8px 0" }}>
                Tue July 22, 2026&nbsp;&nbsp;&nbsp;8:41 PM
              </p>
              <div
                style={{
                  borderTop: "1px dashed rgba(0,0,0,0.3)",
                  margin: "8px 0",
                }}
              />
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
              }}
            >
              <div
                className="flex justify-between"
                style={{ margin: "4px 0" }}
              >
                <span>Burrata with tomatoes</span>
                <span>24.00</span>
              </div>
              <div
                className="flex justify-between"
                style={{ margin: "4px 0" }}
              >
                <span>Truffle pasta</span>
                <span>38.00</span>
              </div>
              <div
                className="flex justify-between"
                style={{ margin: "4px 0" }}
              >
                <span>Grilled seabass</span>
                <span>46.00</span>
              </div>
              <div
                className="flex justify-between"
                style={{ margin: "4px 0" }}
              >
                <span>Tiramisu</span>
                <span>18.00</span>
              </div>
              <div
                style={{
                  borderTop: "1px dashed rgba(0,0,0,0.3)",
                  margin: "8px 0",
                }}
              />
              <div
                className="flex justify-between"
                style={{ margin: "4px 0" }}
              >
                <span>Subtotal</span>
                <span>126.00</span>
              </div>
              <div
                className="flex justify-between"
                style={{ margin: "4px 0" }}
              >
                <span>NY Sales Tax (8.875%)</span>
                <span>11.18</span>
              </div>
              <div
                className="flex justify-between"
                style={{ margin: "4px 0" }}
              >
                <span>Service</span>
                <span>22.00</span>
              </div>
              <div
                style={{
                  borderTop: "1px dashed rgba(0,0,0,0.3)",
                  margin: "8px 0",
                }}
              />
              <div
                className="flex justify-between"
                style={{
                  margin: "4px 0",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                <span>Total</span>
                <span>159.18</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 9 }}>
                <p style={{ margin: "2px 0" }}>Payment Method: CREDIT</p>
                <p style={{ margin: "2px 0" }}>
                  Transaction ID: #NYC6F9A21
                </p>
                <p style={{ margin: "2px 0" }}>Terminal ID: ****7421</p>
                <p style={{ margin: "2px 0" }}>Merchant ID: ****3098</p>
              </div>
              <div
                style={{
                  borderTop: "1px dashed rgba(0,0,0,0.3)",
                  margin: "8px 0",
                }}
              />
              <p
                style={{
                  textAlign: "center",
                  marginTop: 8,
                  fontSize: 9,
                }}
              >
                Thank you for dining with us.
              </p>
            </div>
          </div>

          {/* RESERVATION CARD */}
          <div
            style={{
              position: "absolute",
              left: "calc(50% - 109.5px)",
              top: "calc(50% - 20.73px)",
              transform: "translate(-50%, -50%)",
              background: "#fff7e8",
              borderRadius: 16,
              boxShadow: "0 4px 26px rgba(0,0,0,0.25)",
              padding: 16,
              width: 379,
              zIndex: 10,
            }}
          >
            {/* Pill badge */}
            <div
              style={{
                background: "#e8e1d3",
                borderRadius: 999,
                padding: "8px 12px",
                display: "inline-block",
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 500 }}>
                Book a table at Briole
              </span>
            </div>
            {/* Bottom row */}
            <div
              className="flex justify-between items-center"
              style={{ marginTop: 16 }}
            >
              <div
                className="flex items-center"
                style={{ gap: 16, opacity: 0.5 }}
              >
                <img
                  src="/onboarding/icon-globe.svg"
                  alt=""
                  width={24}
                  height={24}
                />
                <img
                  src="/onboarding/icon-plus-circle.svg"
                  alt=""
                  width={24}
                  height={24}
                />
              </div>
              <div className="flex items-center" style={{ gap: 12 }}>
                <img
                  src="/onboarding/icon-mic.svg"
                  alt=""
                  width={24}
                  height={24}
                />
                <img
                  src="/onboarding/icon-arrow-circle.svg"
                  alt=""
                  width={36}
                  height={36}
                  style={{ transform: "rotate(90deg)" }}
                />
              </div>
            </div>
          </div>

          {/* CONFIRMATION BADGE */}
          <div
            style={{
              position: "absolute",
              left: "calc(50% - 119px)",
              top: "337.77px",
              transform: "translateX(-50%)",
              background: "#d4deca",
              borderRadius: 999,
              padding: "8px 12px 8px 8px",
              zIndex: 10,
            }}
            className="flex items-center"
          >
            <div style={{ gap: 8 }} className="flex items-center">
              <img
                src="/onboarding/icon-check-confirmed.svg"
                alt=""
                width={24}
                height={24}
              />
              <span style={{ fontSize: 16, fontWeight: 500 }}>
                Reservation confirmed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== NUMBERS ==================== */}
      <section style={{ padding: "72px 0" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 32px",
            gap: 64,
          }}
          className="flex items-center"
        >
          {/* Divider */}
          <div
            style={{
              width: 1,
              background: "rgba(0,0,0,0.15)",
              alignSelf: "stretch",
            }}
          />
          {/* Stat 1 */}
          <div style={{ flex: 1, padding: "0 32px", textAlign: "left" }}>
            <p
              className="font-alpina"
              style={{ fontWeight: 500, fontSize: 60, lineHeight: "72px" }}
            >
              1B+
            </p>
            <p
              style={{
                fontSize: 16,
                lineHeight: "24px",
                opacity: 0.8,
                marginTop: 12,
              }}
            >
              people using AI for services
            </p>
          </div>
          {/* Divider */}
          <div
            style={{
              width: 1,
              background: "rgba(0,0,0,0.15)",
              alignSelf: "stretch",
            }}
          />
          {/* Stat 2 */}
          <div style={{ flex: 1, padding: "0 32px", textAlign: "left" }}>
            <p
              className="font-alpina"
              style={{ fontWeight: 500, fontSize: 60, lineHeight: "72px" }}
            >
              100M+
            </p>
            <p
              style={{
                fontSize: 16,
                lineHeight: "24px",
                opacity: 0.8,
                marginTop: 12,
              }}
            >
              service queries through AI daily
            </p>
          </div>
          {/* Divider */}
          <div
            style={{
              width: 1,
              background: "rgba(0,0,0,0.15)",
              alignSelf: "stretch",
            }}
          />
          {/* Stat 3 */}
          <div style={{ flex: 1, padding: "0 32px", textAlign: "left" }}>
            <p
              className="font-alpina"
              style={{ fontWeight: 500, fontSize: 60, lineHeight: "72px" }}
            >
              $15T+
            </p>
            <p
              style={{
                fontSize: 16,
                lineHeight: "24px",
                opacity: 0.8,
                marginTop: 12,
              }}
            >
              global service transactions
            </p>
          </div>
          {/* Divider */}
          <div
            style={{
              width: 1,
              background: "rgba(0,0,0,0.15)",
              alignSelf: "stretch",
            }}
          />
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section
        id="how-it-works"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}
      >
        <div className="flex items-center" style={{ gap: 64 }}>
          {/* Left Column: Interface Video */}
          <div
            style={{
              flex: 1,
              background: "#ede6d8",
              height: 590,
              overflow: "hidden",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <video
              src="/onboarding/interface-preview.mp4"
              autoPlay
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          {/* Right Column: Steps */}
          <div style={{ flex: 1 }}>
            <h2
              className="font-alpina"
              style={{ fontWeight: 500, fontSize: 48, lineHeight: "60px" }}
            >
              How it works for your business
            </h2>
            <div className="flex" style={{ marginTop: 60, gap: 36 }}>
              {/* Left sub-column: Numbered bullets */}
              <div
                className="flex flex-col items-center"
                style={{ gap: 16, alignSelf: "stretch" }}
              >
                {/* Bullet 01 */}
                <div
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                    borderRadius: 6,
                    padding: "6px 16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      lineHeight: "24px",
                      textAlign: "center",
                      width: 22,
                      display: "inline-block",
                    }}
                  >
                    01
                  </span>
                </div>
                {/* Connector 01-02 */}
                <div
                  style={{
                    width: 1,
                    height: 52,
                    background: "rgba(0,0,0,0.15)",
                  }}
                />
                {/* Bullet 02 */}
                <div
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                    borderRadius: 6,
                    padding: "6px 16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      lineHeight: "24px",
                      textAlign: "center",
                      width: 22,
                      display: "inline-block",
                    }}
                  >
                    02
                  </span>
                </div>
                {/* Connector 02-03 */}
                <div
                  style={{
                    width: 1,
                    height: 76,
                    background: "rgba(0,0,0,0.15)",
                  }}
                />
                {/* Bullet 03 */}
                <div
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                    borderRadius: 6,
                    padding: "6px 16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      lineHeight: "24px",
                      textAlign: "center",
                      width: 22,
                      display: "inline-block",
                    }}
                  >
                    03
                  </span>
                </div>
              </div>
              {/* Right sub-column: Step content */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 48,
                }}
              >
                {/* Step 1 */}
                <div style={{ paddingRight: 64 }}>
                  <h3
                    style={{
                      fontSize: 24,
                      lineHeight: "36px",
                      fontWeight: 400,
                    }}
                  >
                    Customer makes a request
                  </h3>
                  <p
                    style={{
                      fontSize: 16,
                      lineHeight: "24px",
                      opacity: 0.6,
                      marginTop: 12,
                    }}
                  >
                    A user asks an AI assistant to book a service.
                  </p>
                </div>
                {/* Step 2 */}
                <div>
                  <h3
                    style={{
                      fontSize: 24,
                      lineHeight: "36px",
                      fontWeight: 400,
                    }}
                  >
                    Availability is resolved
                  </h3>
                  <p
                    style={{
                      fontSize: 16,
                      lineHeight: "24px",
                      opacity: 0.6,
                      marginTop: 12,
                    }}
                  >
                    Availability, pricing, and capacity are checked in real time.
                  </p>
                </div>
                {/* Step 3 */}
                <div>
                  <h3
                    style={{
                      fontSize: 24,
                      lineHeight: "36px",
                      fontWeight: 400,
                    }}
                  >
                    Booking and payment completed
                  </h3>
                  <p
                    style={{
                      fontSize: 16,
                      lineHeight: "24px",
                      opacity: 0.6,
                      marginTop: 12,
                    }}
                  >
                    The reservation is confirmed and payment is processed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BOOKABLE BY AI ==================== */}
      <section
        style={{
          maxWidth: 1200,
          margin: "72px auto 0",
          padding: "0 32px",
        }}
      >
        <div
          style={{ position: "relative", overflow: "hidden", height: 728 }}
        >
          {/* Background image */}
          <img
            src="/onboarding/bookable-restaurant.jpg"
            alt=""
            loading="lazy"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.2)",
            }}
          />
          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1001,
              margin: "0 auto",
              padding: "100px 32px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Decorative barcode pattern */}
            <div style={{ width: "100%", height: 2, marginBottom: 24 }}>
              <img
                src="/onboarding/bookable-dots.svg"
                alt=""
                style={{ width: "100%", height: 2, display: "block" }}
              />
            </div>
            <h2
              className="font-alpina"
              style={{
                fontWeight: 400,
                fontSize: 60,
                lineHeight: "72px",
                color: "#fff",
              }}
            >
              Your business, bookable by AI.
            </h2>
            {/* 3 text columns with dividers */}
            <div className="flex" style={{ marginTop: 48, gap: 36 }}>
              {/* Column 1 */}
              <div style={{ flex: 1, textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: 20,
                    lineHeight: "28px",
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  New customer channel
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: "24px",
                    color: "#fff",
                    marginTop: 12,
                  }}
                >
                  Get discovered by AI assistants planning real-world actions.
                </p>
              </div>
              {/* Divider */}
              <div
                style={{
                  width: 1,
                  background: "rgba(255,255,255,0.3)",
                  alignSelf: "stretch",
                }}
              />
              {/* Column 2 */}
              <div style={{ flex: 1, textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: 20,
                    lineHeight: "28px",
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  Bookings and payments
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: "24px",
                    color: "#fff",
                    marginTop: 12,
                  }}
                >
                  AI agents reserve and pay for services instantly.
                </p>
              </div>
              {/* Divider */}
              <div
                style={{
                  width: 1,
                  background: "rgba(255,255,255,0.3)",
                  alignSelf: "stretch",
                }}
              />
              {/* Column 3 */}
              <div style={{ flex: 1, textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: 20,
                    lineHeight: "28px",
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  Real-time availability
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: "24px",
                    color: "#fff",
                    marginTop: 12,
                  }}
                >
                  Availability and pricing stay up to date automatically.
                </p>
              </div>
            </div>
            {/* Button */}
            <div style={{ marginTop: 60 }}>
              <a
                href="#signup"
                className="btn btn-light"
                style={{
                  background: "#fff7e8",
                  color: "#000",
                  padding: "8px 24px",
                  fontSize: 16,
                  lineHeight: "24px",
                  fontWeight: 500,
                  textDecoration: "none",
                  borderRadius: 0,
                  display: "inline-block",
                }}
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== USE CASES ==================== */}
      <section
        style={{
          padding: "72px 0",
          maxWidth: 1200,
          margin: "0 auto",
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              fontWeight: 400,
              margin: 0,
            }}
          >
            USE CASES
          </p>
          <h2
            className="font-alpina"
            style={{
              fontWeight: 500,
              fontSize: 48,
              lineHeight: "60px",
              margin: 0,
            }}
          >
            Built for every service business.
          </h2>
        </div>

        {/* Tabs */}
        <div
          className="flex flex-wrap"
          style={{
            marginTop: 53,
            gap: 4,
            padding: 4,
            borderRadius: 99,
            justifyContent: "center",
          }}
        >
          {TAB_LABELS.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => switchTab(i)}
              className={`use-case-tab${i === activeTab ? " active" : ""}`}
              style={{
                borderRadius: 99,
                padding: "12px 20px",
                fontSize: 16,
                lineHeight: "24px",
                fontWeight: 400,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: i === activeTab ? "#fff7e8" : "#f4eddf",
                border: i === activeTab ? "1px solid #000" : "none",
                color: "#000",
                opacity: i === activeTab ? 1 : 0.5,
              }}
            >
              <img src={tab.icon} alt="" width={24} height={24} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex" style={{ marginTop: 53 }}>
          {/* Left: Image */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              minHeight: 400,
              position: "relative",
            }}
          >
            <img
              ref={imgCurRef}
              src="/onboarding/hero-restaurant.jpg"
              alt=""
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                inset: 0,
                transition: "transform 0.45s ease-in-out",
              }}
            />
            <img
              ref={imgNextRef}
              src=""
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                inset: 0,
                transform: "translateX(100%)",
                transition: "transform 0.45s ease-in-out",
              }}
            />
          </div>
          {/* Right: Content card */}
          <div style={{ flex: 1, background: "#ede6d8", padding: 36 }}>
            <h3
              className="uc-text-fade"
              style={{
                fontSize: 24,
                lineHeight: "36px",
                fontWeight: 600,
                opacity: textVisible ? 1 : 0,
              }}
            >
              {ucTitle}
            </h3>
            <p
              className="uc-text-fade"
              style={{
                fontSize: 16,
                lineHeight: "24px",
                opacity: textVisible ? 0.8 : 0,
                marginTop: 12,
              }}
            >
              {ucDesc}
            </p>
            {/* Decorative divider */}
            <div
              style={{
                height: 1,
                margin: "36px 0",
                position: "relative",
                overflow: "hidden",
                mixBlendMode: "darken",
              }}
            >
              <img
                src="/onboarding/usecase-divider.gif"
                alt=""
                style={{
                  position: "absolute",
                  height: "32710%",
                  left: "-6.82%",
                  top: "-15555%",
                  width: "113.58%",
                  maxWidth: "none",
                  pointerEvents: "none",
                }}
              />
            </div>
            {/* CTA pill */}
            <div
              className="uc-text-fade"
              style={{
                background: "#100f0f",
                color: "#fff7e8",
                borderRadius: 999,
                padding: "8px 16px",
                fontSize: 16,
                lineHeight: "24px",
                fontWeight: 400,
                display: "inline-block",
                opacity: textVisible ? 1 : 0,
              }}
            >
              {ucCta}
            </div>
            {/* Step indicators */}
            <div
              className="flex uc-text-fade"
              style={{
                gap: 16,
                paddingTop: 12,
                marginTop: 16,
                opacity: textVisible ? 1 : 0,
              }}
            >
              {/* Left: step-icons SVG */}
              <div style={{ flexShrink: 0 }}>
                <img
                  src="/onboarding/step-icons.svg"
                  alt=""
                  width={24}
                  height={169}
                />
              </div>
              {/* Right: step text */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}
              >
                {ucSteps.map((step, i) => (
                  <div key={i}>
                    <p
                      style={{
                        fontSize: 12,
                        lineHeight: "24px",
                        opacity: 0.6,
                        margin: 0,
                      }}
                    >
                      {step.label}
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        lineHeight: "24px",
                        margin: 0,
                      }}
                    >
                      {step.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Bottom decorative divider */}
            <div
              style={{
                height: 1,
                marginTop: 36,
                position: "relative",
                overflow: "hidden",
                mixBlendMode: "darken",
              }}
            >
              <img
                src="/onboarding/usecase-divider.gif"
                alt=""
                style={{
                  position: "absolute",
                  height: "32710%",
                  left: "-6.82%",
                  top: "-15555%",
                  width: "113.58%",
                  maxWidth: "none",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PLATFORM ==================== */}
      <section
        style={{
          padding: "72px 0",
          maxWidth: 1200,
          margin: "0 auto",
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        <div
          className="flex"
          style={{ gap: 32, alignItems: "start" }}
        >
          {/* Left column */}
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                fontWeight: 400,
                margin: 0,
              }}
            >
              PLATFORM
            </p>
            <h2
              className="font-alpina"
              style={{ fontSize: 48, lineHeight: "60px", marginTop: 8 }}
            >
              Infrastructure for
              <br />
              AI execution
            </h2>
          </div>
          {/* Right column */}
          <div style={{ flex: 1 }}>
            {/* Feature 1 */}
            <div
              className="flex"
              style={{ gap: 16, alignItems: "start" }}
            >
              <div
                style={{
                  width: 24,
                  height: 32,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src="/onboarding/icon-security.svg"
                  width={24}
                  height={24}
                  alt=""
                />
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: 20,
                    lineHeight: "28px",
                    fontWeight: 600,
                  }}
                >
                  Secure payments
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: "24px",
                    opacity: 0.6,
                    marginTop: 12,
                  }}
                >
                  Financial-grade security for every transaction.
                </p>
              </div>
            </div>
            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "rgba(0,0,0,0.1)",
                margin: "24px 0",
              }}
            />
            {/* Feature 2 */}
            <div
              className="flex"
              style={{ gap: 16, alignItems: "start" }}
            >
              <div
                style={{
                  width: 24,
                  height: 32,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src="/onboarding/icon-availability.svg"
                  width={24}
                  height={24}
                  alt=""
                />
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: 20,
                    lineHeight: "28px",
                    fontWeight: 600,
                  }}
                >
                  Live availability and pricing
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: "24px",
                    opacity: 0.6,
                    marginTop: 12,
                  }}
                >
                  Always up to date across all services.
                </p>
              </div>
            </div>
            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "rgba(0,0,0,0.1)",
                margin: "24px 0",
              }}
            />
            {/* Feature 3 */}
            <div
              className="flex"
              style={{ gap: 16, alignItems: "start" }}
            >
              <div
                style={{
                  width: 24,
                  height: 32,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src="/onboarding/icon-api.svg"
                  width={24}
                  height={24}
                  alt=""
                />
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: 20,
                    lineHeight: "28px",
                    fontWeight: 600,
                  }}
                >
                  Agent-ready API
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: "24px",
                    opacity: 0.6,
                    marginTop: 12,
                  }}
                >
                  Designed for AI agents to integrate and act.
                </p>
              </div>
            </div>
            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "rgba(0,0,0,0.1)",
                margin: "24px 0",
              }}
            />
            {/* Feature 4 */}
            <div
              className="flex"
              style={{ gap: 16, alignItems: "start" }}
            >
              <div
                style={{
                  width: 24,
                  height: 32,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src="/onboarding/icon-network.svg"
                  width={24}
                  height={24}
                  alt=""
                />
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: 20,
                    lineHeight: "28px",
                    fontWeight: 600,
                  }}
                >
                  Global execution network
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: "24px",
                    opacity: 0.6,
                    marginTop: 12,
                  }}
                >
                  Operate locally, scale globally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA / SIGNUP ==================== */}
      <section
        id="signup"
        style={{
          backgroundColor: "#3e423c",
          maxWidth: 1200,
          margin: "72px auto 0",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='8' height='8' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='4' cy='4' r='0.7' fill='rgba(255,246,229,0.09)'/%3E%3C/svg%3E\")",
          backgroundSize: "8px 8px",
        }}
      >
        <div
          style={{
            maxWidth: 1014,
            margin: "0 auto",
            padding: "144px 32px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              fontWeight: 400,
              color: "#fff6e5",
              margin: "0 0 8px 0",
            }}
          >
            JOIN OUR NETWORK
          </p>
          <h2
            className="font-alpina"
            style={{ fontSize: 48, lineHeight: "60px", color: "#fff6e5" }}
          >
            Let AI agents book, order, and pay for your services.
          </h2>

          {/* Signup interaction */}
          <div
            style={{
              marginTop: 72,
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {/* Button wrapper */}
            {!showForm && !loading && (
              <div>
                <button
                  className="btn btn-light"
                  onClick={showEmailForm}
                  style={{
                    background: "#fff7e8",
                    color: "#000",
                    padding: "8px 24px",
                    fontSize: 16,
                    fontWeight: 500,
                    border: "none",
                    borderRadius: 0,
                    cursor: "pointer",
                  }}
                >
                  Get started
                </button>
              </div>
            )}

            {/* Form */}
            {showForm && !loading && (
              <form onSubmit={handleSignup}>
                <div className="flex" style={{ gap: 8 }}>
                  <input
                    ref={emailRef}
                    type="email"
                    name="email"
                    required
                    placeholder="you@yourbusiness.com"
                    style={{
                      flex: 1,
                      padding: "8px 16px",
                      fontSize: 16,
                      lineHeight: "24px",
                      background: "#fff",
                      border: "none",
                      borderRadius: 0,
                      outline: "none",
                      color: "#000",
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-light"
                    style={{
                      background: "#fff7e8",
                      color: "#000",
                      padding: "8px 24px",
                      fontSize: 16,
                      lineHeight: "24px",
                      fontWeight: 500,
                      border: "none",
                      borderRadius: 0,
                      cursor: "pointer",
                    }}
                  >
                    Submit
                  </button>
                </div>
                {errorMsg && (
                  <p
                    style={{
                      marginTop: 12,
                      color: "#f87171",
                      fontSize: 14,
                    }}
                  >
                    {errorMsg}
                  </p>
                )}
              </form>
            )}

            {/* Loader */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "8px 0",
                }}
              >
                <span
                  className="animate-spinner"
                  style={{
                    display: "inline-block",
                    width: "1rem",
                    height: "1rem",
                    border: "2px solid rgba(255,247,232,0.3)",
                    borderTopColor: "#fff7e8",
                    borderRadius: "50%",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer style={{ padding: "48px 0" }}>
        <div
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}
          className="flex justify-between"
        >
          {/* Left side */}
          <div>
            <img
              src="/onboarding/footer-logo.svg"
              alt="WhatsDo"
              style={{ width: 61, height: 16 }}
            />
            <p style={{ marginTop: 16, fontSize: 12, color: "#000" }}>
              &copy; 2026 Whats&apos;Do. Built for the architectural monolith.
            </p>
          </div>
          {/* Right side */}
          <div className="flex" style={{ gap: 32 }}>
            {/* Company */}
            <div style={{ width: 173 }}>
              <p
                style={{
                  fontSize: 14,
                  color: "#000",
                  margin: "0 0 8px 0",
                }}
              >
                Company
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <a
                  href="#"
                  style={{
                    fontSize: 14,
                    color: "#000",
                    opacity: 0.5,
                    textDecoration: "none",
                  }}
                >
                  Careers
                </a>
                <a
                  href="#"
                  style={{
                    fontSize: 14,
                    color: "#000",
                    opacity: 0.5,
                    textDecoration: "none",
                  }}
                >
                  Changelog
                </a>
                <a
                  href="#"
                  style={{
                    fontSize: 14,
                    color: "#000",
                    opacity: 0.5,
                    textDecoration: "none",
                  }}
                >
                  Contact
                </a>
                <a
                  href="#"
                  style={{
                    fontSize: 14,
                    color: "#000",
                    opacity: 0.5,
                    textDecoration: "none",
                  }}
                >
                  Documentation
                </a>
              </div>
            </div>
            {/* Legal */}
            <div style={{ width: 173 }}>
              <p
                style={{
                  fontSize: 14,
                  color: "#000",
                  margin: "0 0 8px 0",
                }}
              >
                Legal
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <a
                  href="#"
                  style={{
                    fontSize: 14,
                    color: "#000",
                    opacity: 0.5,
                    textDecoration: "none",
                  }}
                >
                  Cookie Policy
                </a>
                <a
                  href="#"
                  style={{
                    fontSize: 14,
                    color: "#000",
                    opacity: 0.5,
                    textDecoration: "none",
                  }}
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  style={{
                    fontSize: 14,
                    color: "#000",
                    opacity: 0.5,
                    textDecoration: "none",
                  }}
                >
                  Terms of Service
                </a>
              </div>
            </div>
            {/* Social */}
            <div style={{ width: 173 }}>
              <p
                style={{
                  fontSize: 14,
                  color: "#000",
                  margin: "0 0 8px 0",
                }}
              >
                Social
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <a
                  href="#"
                  style={{
                    fontSize: 14,
                    color: "#000",
                    opacity: 0.5,
                    textDecoration: "none",
                  }}
                >
                  X
                </a>
                <a
                  href="#"
                  style={{
                    fontSize: 14,
                    color: "#000",
                    opacity: 0.5,
                    textDecoration: "none",
                  }}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
