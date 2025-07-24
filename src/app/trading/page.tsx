"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaChartLine, 
  FaGlobe, 
  FaBitcoin, 
  FaDollarSign, 
  FaShieldAlt, 
  FaClock, 
  FaMobile, 
  FaTools,
  FaGraduationCap,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaPlay
} from 'react-icons/fa';

const tradingSlides = [
  {
    headline: "Trade with Confidence",
    subtext: "Access global markets with advanced tools, real-time data, and expert support. Start your trading journey today.",
    cta: "Start Trading"
  },
  {
    headline: "Advanced Trading Tools",
    subtext: "Professional-grade charts, technical indicators, and automated trading features at your fingertips.",
    cta: "Explore Tools"
  },
  {
    headline: "24/7 Market Access",
    subtext: "Trade Forex, stocks, commodities, and crypto around the clock with our secure platform.",
    cta: "View Markets"
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
      className="border border-[var(--brand)]/20 rounded-xl bg-[var(--card-bg)] shadow p-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
    >
      <button
        className="w-full flex justify-between items-center text-lg font-semibold text-[var(--brand)] focus:outline-none"
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
        className="overflow-hidden text-[var(--foreground)]/80 text-base mt-2"
      >
        {open && <div className="pt-2">{a}</div>}
      </motion.div>
    </motion.div>
  );
}

const tradingInstruments = [
  {
    name: 'Forex',
    icon: FaGlobe,
    short: 'Trade major, minor, and exotic currency pairs.',
    detail: 'Access the world\'s largest financial market with over $6 trillion in daily trading volume. Trade EUR/USD, GBP/JPY, and 50+ currency pairs.',
    spread: 'From 0.1 pips'
  },
  {
    name: 'Stocks',
    icon: FaChartLine,
    short: 'Invest in leading companies worldwide.',
    detail: 'Trade shares of top companies like Apple, Tesla, Amazon, and more. Access US, European, and Asian stock markets.',
    spread: 'Commission-free'
  },
  {
    name: 'Cryptocurrency',
    icon: FaBitcoin,
    short: 'Trade popular digital assets 24/7.',
    detail: 'Trade Bitcoin, Ethereum, Litecoin, and other major cryptocurrencies with tight spreads and advanced security.',
    spread: 'From 0.5%'
  },
  {
    name: 'Commodities',
    icon: FaDollarSign,
    short: 'Gold, oil, silver, and agricultural products.',
    detail: 'Diversify your portfolio with precious metals, energy, and agricultural commodities. Hedge against inflation and market volatility.',
    spread: 'Variable'
  },
];

const marketData = [
  { pair: 'EUR/USD', price: '1.0856', change: '+0.0023', percentage: '+0.21%', trend: 'up' },
  { pair: 'GBP/USD', price: '1.2734', change: '-0.0012', percentage: '-0.09%', trend: 'down' },
  { pair: 'USD/JPY', price: '149.45', change: '+0.67', percentage: '+0.45%', trend: 'up' },
  { pair: 'BTC/USD', price: '43,250', change: '+1,250', percentage: '+2.98%', trend: 'up' },
  { pair: 'ETH/USD', price: '2,645', change: '-45', percentage: '-1.67%', trend: 'down' },
  { pair: 'GOLD', price: '2,032', change: '+8.50', percentage: '+0.42%', trend: 'up' },
];

export default function Trading() {
  const [current, setCurrent] = useState(0);
  const nextSlide = () => setCurrent((current + 1) % tradingSlides.length);
  const prevSlide = () => setCurrent((current - 1 + tradingSlides.length) % tradingSlides.length);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((current + 1) % tradingSlides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <main style={{ background: '[var(--background)]' }} className="min-h-screen">
      {/* Hero Section */}
      <section className="relative z-0 flex flex-col justify-center items-center min-h-[70vh] w-full text-center px-4" style={{ color: 'var(--foreground)' }}>
        <div className="absolute inset-0 w-full h-full z-[-1]" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(58, 141, 222, 0.25) 0%, rgba(10, 15, 26, 0.0) 80%)' }} />
        
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
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg">{tradingSlides[current].headline}</h1>
              <p className="text-lg md:text-xl mb-8 drop-shadow-lg">{tradingSlides[current].subtext}</p>
              <a href="#get-started" className="inline-block px-8 py-3 font-semibold text-lg shadow hover:opacity-90 transition border-0 rounded" style={{ background: 'var(--brand)', color: 'var(--foreground)' }}>
                {tradingSlides[current].cta}
              </a>
            </motion.div>
          </AnimatePresence>
          {/* Carousel Controls */}
          <div className="flex gap-4 items-center justify-center">
            <button onClick={prevSlide} aria-label="Previous" className="w-3 h-3 rounded-full transition" style={{ background: 'rgba(230, 240, 255, 0.4)' }} />
            {tradingSlides.map((_, idx) => (
              <span key={idx} className={`w-3 h-3 inline-block transition`} style={{ background: current === idx ? 'var(--brand)' : 'rgba(230, 240, 255, 0.4)' }} />
            ))}
            <button onClick={nextSlide} aria-label="Next" className="w-3 h-3 rounded-full transition" style={{ background: 'rgba(230, 240, 255, 0.4)' }} />
          </div>
        </div>
      </section>

      {/* Live Market Data Section */}
      <section className="w-full max-w-6xl mx-auto mt-20 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--foreground)' }}>Live Market Prices</h2>
        <div className="rounded-xl shadow-2xl p-6 overflow-x-auto" style={{ background: 'var(--card-bg)', border: '1px solid rgba(0, 64, 128, 0.2)' }}>
          <div className="min-w-[600px]">
            {marketData.map((item, index) => (
              <motion.div
                key={item.pair}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
                style={{ borderColor: 'rgba(0, 64, 128, 0.1)' }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>{item.pair}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-xl" style={{ color: 'var(--foreground)' }}>{item.price}</span>
                  <div className="flex items-center gap-1">
                    {item.trend === 'up' ? (
                      <FaArrowUp className="text-green-500" size={12} />
                    ) : (
                      <FaArrowDown className="text-red-500" size={12} />
                    )}
                    <span className={`font-medium ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {item.change} ({item.percentage})
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Instruments Section */}
      <section className="w-full max-w-6xl mx-auto mt-32 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--brand)' }}>Available Trading Instruments</h2>
        <p className="text-lg mb-12 max-w-2xl mx-auto text-center" style={{ color: 'rgba(230, 240, 255, 0.8)' }}>
          Trade across multiple asset classes with competitive spreads and advanced tools. Diversify your portfolio with our comprehensive market access.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {tradingInstruments.map((instrument) => {
            const Icon = instrument.icon;
            return (
              <motion.div
                key={instrument.name}
                className="rounded-xl shadow-xl p-6 flex flex-col items-start text-left relative overflow-hidden"
                style={{ background: 'var(--card-bg)', border: '1px solid rgba(0, 64, 128, 0.2)' }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
              >
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'var(--shine)' }} />
                <div className="flex items-center gap-4 mb-4 z-10">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ background: 'rgba(0, 64, 128, 0.2)' }}>
                    <Icon style={{ color: 'var(--brand)' }} size={24} />
                  </span>
                  <h3 className="font-semibold text-xl" style={{ color: 'var(--foreground)' }}>{instrument.name}</h3>
                </div>
                <div className="z-10 space-y-3">
                  <p className="font-medium" style={{ color: 'rgba(230, 240, 255, 0.9)' }}>{instrument.short}</p>
                  <p className="text-sm" style={{ color: 'rgba(230, 240, 255, 0.7)' }}>{instrument.detail}</p>
                  <div className="pt-2">
                    <span className="text-xs font-semibold" style={{ color: 'var(--brand)' }}>Spreads: {instrument.spread}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trading Features Section */}
      <section className="w-full max-w-5xl mx-auto mt-32 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--foreground)' }}>Why Choose Our Trading Platform?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[{
            icon: <FaTools className="text-4xl mb-4" style={{ color: 'var(--brand)' }} />,
            title: "Advanced Tools",
            desc: "Professional charting, technical indicators, and automated trading features for serious traders."
          }, {
            icon: <FaClock className="text-4xl mb-4" style={{ color: 'var(--brand)' }} />,
            title: "24/7 Trading",
            desc: "Access global markets around the clock with our reliable and fast execution platform."
          }, {
            icon: <FaShieldAlt className="text-4xl mb-4" style={{ color: 'var(--brand)' }} />,
            title: "Secure & Regulated",
            desc: "Your funds are protected with industry-leading security and regulatory compliance."
          }, {
            icon: <FaMobile className="text-4xl mb-4" style={{ color: 'var(--brand)' }} />,
            title: "Mobile Trading",
            desc: "Trade on-the-go with our intuitive mobile app, available for iOS and Android devices."
          }, {
            icon: <FaGraduationCap className="text-4xl mb-4" style={{ color: 'var(--brand)' }} />,
            title: "Educational Resources",
            desc: "Learn from experts with our comprehensive trading courses, webinars, and market analysis."
          }, {
            icon: <FaUsers className="text-4xl mb-4" style={{ color: 'var(--brand)' }} />,
            title: "24/7 Support",
            desc: "Get help when you need it with our dedicated customer support team available around the clock."
          }].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="rounded-xl shadow-2xl p-6 flex flex-col items-center text-center relative overflow-hidden"
              style={{ background: 'var(--card-bg)', border: '1px solid rgba(0, 64, 128, 0.2)' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'var(--shine)' }} />
              {feature.icon}
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--foreground)' }}>{feature.title}</h3>
              <p className="text-sm" style={{ color: 'rgba(230, 240, 255, 0.8)' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How to Start Trading Section */}
      <section className="w-full max-w-5xl mx-auto mt-32 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--foreground)' }}>How to Start <span style={{ color: 'var(--brand)' }}>Trading</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Create Account",
              desc: "Sign up and verify your identity in minutes with our streamlined onboarding process.",
              icon: <svg className="w-8 h-8" style={{ color: 'var(--brand)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M5.5 21a7.5 7.5 0 0113 0" /></svg>
            },
            {
              step: "02", 
              title: "Fund Account",
              desc: "Deposit funds using bank transfer, credit card, or e-wallet. Minimum deposit starts at $100.",
              icon: <svg className="w-8 h-8" style={{ color: 'var(--brand)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 11h.01" /></svg>
            },
            {
              step: "03",
              title: "Choose Platform",
              desc: "Select from our web trader, mobile app, or professional MT5 platform based on your needs.",
              icon: <svg className="w-8 h-8" style={{ color: 'var(--brand)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6v6H9z" /></svg>
            },
            {
              step: "04",
              title: "Start Trading",
              desc: "Begin trading with as little as $1. Use our risk management tools to protect your capital.",
              icon: <svg className="w-8 h-8" style={{ color: 'var(--brand)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 7h7v7" /></svg>
            }
          ].map((step, index) => (
            <motion.div
              key={step.step}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4 shadow-md relative" style={{ background: 'rgba(0, 64, 128, 0.1)' }}>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--brand)', color: 'var(--foreground)' }}>
                  {step.step}
                </span>
                {step.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--foreground)' }}>{step.title}</h3>
              <p className="text-sm" style={{ color: 'rgba(230, 240, 255, 0.8)' }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trading Education CTA Section */}
      <section className="w-full mt-40 px-4 py-8" style={{ background: 'var(--brand)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-10 min-h-[20rem] md:h-[22rem] pt-4">
          {/* Icon Left */}
          <div className="flex-1 flex justify-center items-center h-60 md:h-full">
            <div className="w-80 h-80 flex items-center justify-center rounded-xl shadow-2xl" style={{ background: 'rgba(230, 240, 255, 0.1)' }}>
              <FaPlay style={{ color: 'var(--foreground)' }} size={80} />
            </div>
          </div>
          {/* Text Right */}
          <div className="flex-1 flex flex-col justify-center py-8 md:py-0 md:pr-8 h-full" style={{ color: 'var(--foreground)' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Learn to Trade Like a Pro</h2>
            <p className="text-lg mb-6">Access our comprehensive trading education center with video tutorials, live webinars, market analysis, and expert strategies. Whether you&apos;re a beginner or experienced trader, we have resources to help you succeed.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#education" className="inline-block px-8 py-3 font-semibold text-lg shadow rounded transition" style={{ background: 'var(--foreground)', color: 'var(--brand)' }}>
                Start Learning
              </a>
              <a href="#demo" className="inline-block px-8 py-3 font-semibold text-lg shadow rounded transition border-2" style={{ borderColor: 'var(--foreground)', color: 'var(--foreground)', background: 'transparent' }}>
                Try Demo Account
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Management Section */}
      <section className="w-full max-w-5xl mx-auto mt-32 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: 'var(--brand)' }}>Risk Management Tools</h2>
        <p className="text-lg mb-12 max-w-2xl" style={{ color: 'rgba(230, 240, 255, 0.8)' }}>
          Protect your capital with our comprehensive risk management features designed to help you trade responsibly and manage your exposure.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Stop Loss Orders",
              desc: "Automatically close positions when they reach a predetermined loss level to limit your downside risk.",
              icon: <FaShieldAlt style={{ color: 'var(--brand)' }} size={24} />
            },
            {
              title: "Take Profit Orders", 
              desc: "Lock in profits by automatically closing positions when they reach your target profit level.",
              icon: <FaArrowUp style={{ color: 'var(--brand)' }} size={24} />
            },
            {
              title: "Negative Balance Protection",
              desc: "Never lose more than your account balance with our negative balance protection feature.",
              icon: <FaShieldAlt style={{ color: 'var(--brand)' }} size={24} />
            }
          ].map((tool, index) => (
            <motion.div
              key={tool.title}
              className="border-l-4 rounded-xl shadow-lg p-6 flex flex-col gap-3"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--brand)' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="mb-2">{tool.icon}</div>
              <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>{tool.title}</h3>
              <p className="text-sm" style={{ color: 'rgba(230, 240, 255, 0.8)' }}>{tool.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-3xl mx-auto mt-32 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'var(--brand)' }}>Trading FAQ</h2>
        <div className="space-y-4">
          {[
            {
              q: "What is the minimum deposit to start trading?",
              a: "You can start trading with as little as $100. However, we recommend starting with at least $500 to have better risk management options."
            },
            {
              q: "Are there any trading fees?",
              a: "We charge competitive spreads on all instruments. There are no hidden fees or commissions. You only pay the spread when you trade."
            },
            {
              q: "Can I practice trading before investing real money?",
              a: "Yes! We offer a free demo account with $10,000 virtual money so you can practice trading without any risk."
            },
            {
              q: "What trading platforms do you offer?",
              a: "We offer a web-based platform, mobile apps for iOS and Android, and MetaTrader 5 for advanced traders."
            },
            {
              q: "How fast are trade executions?",
              a: "Our average execution speed is under 30 milliseconds, ensuring you get the best possible prices for your trades."
            }
          ].map((item, i) => (
            <AccordionItem key={item.q} q={item.q} a={item.a} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* Get Started CTA Section */}
      <section className="w-full mt-32 py-16 px-4 flex flex-col items-center justify-center text-center" style={{ background: 'var(--brand)' }}>
        <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
          <div className="rounded-full p-4 mb-2" style={{ background: 'rgba(230, 240, 255, 0.1)' }}>
            <svg className="w-12 h-12" style={{ color: 'var(--foreground)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 7h7v7" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--foreground)' }}>Ready to Start Trading?</h2>
          <p className="text-lg mb-4" style={{ color: 'rgba(230, 240, 255, 0.9)' }}>
            Join thousands of traders who trust our platform. Open your account today and start your trading journey with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/register" className="inline-block px-10 py-4 font-semibold text-lg shadow transition border-0" style={{ background: 'var(--foreground)', color: 'var(--brand)' }}>
              Open Live Account
            </a>
            <a href="/demo" className="inline-block px-10 py-4 font-semibold text-lg shadow transition border-2" style={{ borderColor: 'var(--foreground)', color: 'var(--foreground)', background: 'transparent' }}>
              Try Demo Account
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}