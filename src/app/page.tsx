"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    headline: "Empower Your Investments",
    subtext: "Leverage smart tools, expert insights, and a secure platform to grow your wealth. Join investlp and take control of your financial future with confidence.",
    cta: "Get Started"
  },
  {
    headline: "Grow with Confidence",
    subtext: "Experience transparent investing, real-time analytics, and dedicated support. Your journey to financial freedom starts here.",
    cta: "Start Investing"
  },
  {
    headline: "Join a Thriving Community",
    subtext: "Connect with like-minded investors, share strategies, and achieve your goals together. Invest smarter, not harder.",
    cta: "Join Now"
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// FAQ Accordion Item
function AccordionItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="border border-emerald-100 rounded-xl bg-white/90 shadow p-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
    >
      <button
        className="w-full flex justify-between items-center text-lg font-semibold text-emerald-700 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-expanded={open}
      >
        {q}
        <span className={`ml-2 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden text-gray-700 text-base mt-2"
      >
        {open && <div className="pt-2">{a}</div>}
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [current, setCurrent] = useState(0);
  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((current + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative z-0 flex flex-col justify-center items-center min-h-[70vh] w-full text-center text-white px-4">
        {/* Background Image and Overlay only for Hero */}
        <div className="absolute inset-0 w-full h-full z-[-1]">
          <Image src="/coin-growth-landscape.jpg" alt="Investment growth" fill className="w-full h-full object-cover object-center" priority />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="w-full max-w-3xl mx-auto z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-10"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg">{slides[current].headline}</h1>
              <p className="text-lg md:text-xl mb-8 drop-shadow-lg">{slides[current].subtext}</p>
              <a href="#get-started" className="inline-block px-8 py-3 bg-emerald-600 text-white font-semibold text-lg shadow hover:bg-emerald-700 transition border-0">
                {slides[current].cta}
              </a>
            </motion.div>
          </AnimatePresence>
          {/* Carousel Controls */}
          <div className="flex gap-4 items-center justify-center">
            <button onClick={prevSlide} aria-label="Previous" className="w-3 h-3 rounded-full bg-white/40 hover:bg-white/80 transition" />
            {slides.map((_, idx) => (
              <span key={idx} className={`w-3 h-3 ${current === idx ? 'bg-emerald-600' : 'bg-white/40'} inline-block transition`} />
            ))}
            <button onClick={nextSlide} aria-label="Next" className="w-3 h-3 rounded-full bg-white/40 hover:bg-white/80 transition" />
          </div>
        </div>
      </section>

      
      {/* Why Choose investlp Section */}
      <section className="w-full max-w-5xl mx-auto mt-32 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Why Choose <span className="text-emerald-600">investlp?</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Feature 1 */}
          {[{
            icon: (<svg className="w-10 h-10 mb-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V7l7-4z" /></svg>),
            title: "Secure & Transparent",
            desc: "Your investments are protected with industry-leading security and full transparency at every step."
          }, {
            icon: (<svg className="w-10 h-10 mb-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2" /><circle cx="12" cy="7" r="4" /></svg>),
            title: "Real-Time Analytics",
            desc: "Track your portfolio and market trends with powerful, real-time analytics and insights."
          }, {
            icon: (<svg className="w-10 h-10 mb-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636A9 9 0 115.636 18.364 9 9 0 0118.364 5.636z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.172 14.828a4 4 0 005.656 0" /></svg>),
            title: "Expert Support",
            desc: "Get help from our team of investment experts, available to guide you every step of the way."
          }, {
            icon: (<svg className="w-10 h-10 mb-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="7" height="13" rx="2" /><rect x="14" y="3" width="7" height="17" rx="2" /></svg>),
            title: "Flexible Investment Plans",
            desc: "Choose from a variety of plans tailored to your goals, risk tolerance, and investment style."
          }].map((card) => (
            <motion.div
              key={card.title}
              className="bg-white/90 border border-emerald-100 rounded-xl shadow-2xl p-6 flex flex-col items-center text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
            >
              {card.icon}
              <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </div>

      </section>
      {/* How investlp Works Section */}
      <section className="w-full max-w-5xl mx-auto mt-32 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">How <span className="text-emerald-600">investlp</span> Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-50 mb-4 shadow-md">
              {/* User Icon */}
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M5.5 21a7.5 7.5 0 0113 0" /></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Create Your Account</h3>
            <p className="text-gray-600 text-sm">Sign up in minutes and get started with a secure, personalized dashboard.</p>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-50 mb-4 shadow-md">
              {/* Wallet Icon */}
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 11h.01" /></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Fund Your Wallet</h3>
            <p className="text-gray-600 text-sm">Easily deposit funds using multiple payment options, ready to invest instantly.</p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-50 mb-4 shadow-md">
              {/* Plan Icon */}
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6v6H9z" /></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Choose an Investment Plan</h3>
            <p className="text-gray-600 text-sm">Select from a range of plans tailored to your goals and risk profile.</p>
          </div>
          {/* Step 4 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-50 mb-4 shadow-md">
              {/* Growth Icon */}
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 7h7v7" /></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Track & Grow Your Portfolio</h3>
            <p className="text-gray-600 text-sm">Monitor your investments in real time and watch your wealth grow.</p>
          </div>
        </div>
      </section>

      {/* Emerald Call-to-Action Section */}
      <section className="w-full bg-emerald-600 mt-40 px-4 py-8 ">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-10 min-h-[20rem] md:h-[22rem] pt-4">
          {/* Image Left */}
          <div className="flex-1 flex justify-center items-center h-60 md:h-full">
            <Image src="/invest-hands.jpg" alt="Investing together" width={320} height={320} className="rounded-xl shadow-2xl w-full max-w-xs md:max-w-sm h-full object-cover" />
          </div>
          {/* Text Right */}
          <div className="flex-1 flex flex-col justify-center text-white py-8 md:py-0 md:pr-8 h-full">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Invest with Confidence, Invest with investlp</h2>
            <p className="text-lg mb-6">At investlp, we believe everyone deserves access to smart, secure, and rewarding investment opportunities. Our platform is designed to empower you—whether you&apos;re a beginner or a seasoned investor—with the tools, support, and transparency you need to grow your wealth. Join a thriving community, enjoy expert guidance, and take the next step toward your financial goals today.</p>
            <a href="#get-started" className="inline-block px-8 py-3 bg-white text-emerald-600 font-semibold text-lg shadow rounded hover:bg-gray-100 transition">Get Started Now</a>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="w-full max-w-5xl mx-auto mt-32 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">What Our Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              avatar: "https://randomuser.me/api/portraits/women/44.jpg",
              name: "Jane D.",
              role: "New Investor",
              quote: "investlp made investing easy and stress-free!"
            },
            {
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
              name: "Mark T.",
              role: "Entrepreneur",
              quote: "I love the real-time analytics and support."
            },
            {
              avatar: "https://randomuser.me/api/portraits/women/68.jpg",
              name: "Sarah K.",
              role: "Professional",
              quote: "My portfolio has grown steadily since joining."
            },
            {
              avatar: "https://randomuser.me/api/portraits/men/85.jpg",
              name: "David L.",
              role: "Seasoned Investor",
              quote: "The platform is intuitive and the plans are flexible."
            }
          ].map((t) => (
            <motion.div
              key={t.name}
              className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center text-center border border-gray-100"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: t.name.charCodeAt(0) * 0.15 }}
            >
              <Image src={t.avatar} alt={t.name} width={64} height={64} className="w-16 h-16 rounded-full mb-4 object-cover border-4 border-emerald-100 shadow" />
              <h4 className="font-semibold text-lg mb-1 text-gray-900">{t.name}</h4>
              <span className="text-emerald-600 text-xs mb-2">{t.role}</span>
              <p className="text-gray-700 text-sm italic">&ldquo;{t.quote}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="w-full max-w-3xl mx-auto mt-32 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-600">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "How do I start investing with investlp?",
              a: "Simply create an account, fund your wallet, and choose an investment plan that fits your goals. Our platform guides you every step of the way."
            },
            {
              q: "Is my money safe on this platform?",
              a: "Yes! We use industry-leading security and full transparency. Your funds are protected and you have full control at all times."
            },
            {
              q: "Can I withdraw my funds anytime?",
              a: "Absolutely. You can withdraw your funds at any time, with no hidden fees or lock-in periods."
            },
            {
              q: "What support do you offer?",
              a: "Our expert team is available to help you with any questions or issues, whenever you need us."
            }
          ].map((item, i) => (
            <AccordionItem key={item.q} q={item.q} a={item.a} delay={i * 0.1} />
          ))}
        </div>
      </section>


      {/* Stay Ahead Info Section */}
      <section className="w-full max-w-5xl mx-auto mt-32 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-8">Stay Ahead with investlp</h2>
        <p className="text-lg text-gray-700 mb-12 max-w-2xl">Empower your investing with the latest market updates, expert insights, news, and more. Discover how our expertise keeps you ahead in a changing market.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white/90 border-l-4 border-emerald-600 rounded-xl shadow-lg p-6 flex flex-col gap-3">
            <div className="text-emerald-600 mb-2"><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v9m0 0H7m5 0h5" /></svg></div>
            <h3 className="font-semibold text-lg">Why Trade on the Forex or Currency Markets?</h3>
            <p className="text-gray-700 text-sm">Forex offers direct access to the world’s financial markets and a wealth of opportunities. It’s a unique option for investors seeking global reach and flexibility.</p>
          </div>
          {/* Card 2 */}
          <div className="bg-white/90 border-l-4 border-emerald-600 rounded-xl shadow-lg p-6 flex flex-col gap-3">
            <div className="text-emerald-600 mb-2"><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" /></svg></div>
            <h3 className="font-semibold text-lg">When Can You Trade Forex?</h3>
            <p className="text-gray-700 text-sm">The Forex market is open 24 hours a day, 5 days a week. Build your trading strategy around your lifestyle and seize opportunities anytime.</p>
          </div>
          {/* Card 3 */}
          <div className="bg-white/90 border-l-4 border-emerald-600 rounded-xl shadow-lg p-6 flex flex-col gap-3">
            <div className="text-emerald-600 mb-2"><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2" /><circle cx="12" cy="7" r="4" /></svg></div>
            <h3 className="font-semibold text-lg">Fundamental vs. Technical Analysis</h3>
            <p className="text-gray-700 text-sm">Fundamental analysis looks at economic factors, while technical analysis focuses on price patterns. Most traders prefer technical analysis for its clear entry and exit signals.</p>
          </div>
        </div>
      </section>
      
      {/* Get Started CTA Section */}
      <section className="w-full bg-emerald-600 mt-32 py-16 px-4 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
          <div className="bg-white/10 rounded-full p-4 mb-2">
            {/* Simple SVG Icon */}
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Start Your Investment Journey?</h2>
          <p className="text-lg text-white/90 mb-4">Join thousands of investors growing their wealth with investlp. Sign up in minutes and take control of your financial future.</p>
          <a href="/register" className="inline-block px-10 py-4 bg-white text-emerald-600 font-semibold text-lg shadow hover:bg-gray-100 transition border-0">Get Started Now</a>
        </div>
      </section>
      
    </main>
  );
}
