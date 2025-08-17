"use client";

import { motion } from "framer-motion";
import { FaDesktop, FaMobile, FaGlobe, FaShieldAlt, FaChartLine, FaTools, FaClock, FaUsers, FaStar, FaCheck, FaTimes } from 'react-icons/fa';

const platforms = [
  {
    name: "Web Trader",
    type: "Browser-based",
    description: "Access our powerful trading platform directly from any web browser. No downloads required.",
    features: ["Real-time charts", "Advanced indicators", "One-click trading", "Portfolio overview"],
    pros: ["No installation", "Cross-platform", "Always updated", "Lightweight"],
    cons: ["Requires internet", "Limited offline access"],
    icon: FaGlobe,
    rating: 4.8,
    users: "25K+"
  },
  {
    name: "Mobile App",
    type: "iOS & Android",
    description: "Trade on-the-go with our intuitive mobile application designed for mobile devices.",
    features: ["Touch-optimized", "Push notifications", "Biometric login", "Quick trade execution"],
    pros: ["Portable", "Fast access", "Notifications", "Secure"],
    cons: ["Smaller screen", "Limited features"],
    icon: FaMobile,
    rating: 4.9,
    users: "35K+"
  },
  {
    name: "MetaTrader 5",
    type: "Professional",
    description: "Industry-standard platform with advanced charting and automated trading capabilities.",
    features: ["Expert Advisors", "Custom indicators", "Multi-timeframe", "Backtesting"],
    pros: ["Professional tools", "Automation", "Extensive features", "Industry standard"],
    cons: ["Complex interface", "Steep learning curve"],
    icon: FaDesktop,
    rating: 4.7,
    users: "15K+"
  },
  {
    name: "Desktop App",
    type: "Windows & Mac",
    description: "Full-featured desktop application with enhanced performance and offline capabilities.",
    features: ["Advanced charts", "Multiple monitors", "Fast execution", "Offline analysis"],
    pros: ["Full features", "Fast performance", "Offline access", "Multi-monitor"],
    cons: ["Installation required", "Platform specific"],
    icon: FaDesktop,
    rating: 4.6,
    users: "20K+"
  }
];

const features = [
  {
    title: "Real-Time Data",
    description: "Get live market prices, charts, and news updates with minimal latency.",
    icon: FaClock
  },
  {
    title: "Advanced Charting",
    description: "Professional-grade charts with 100+ technical indicators and drawing tools.",
    icon: FaChartLine
  },
  {
    title: "Risk Management",
    description: "Built-in stop-loss, take-profit, and position sizing tools.",
    icon: FaShieldAlt
  },
  {
    title: "Multi-Device Sync",
    description: "Seamlessly switch between devices with synchronized settings and data.",
    icon: FaUsers
  },
  {
    title: "One-Click Trading",
    description: "Execute trades instantly with customizable quick trade buttons.",
    icon: FaTools
  },
  {
    title: "Mobile Optimization",
    description: "Fully responsive design that works perfectly on all screen sizes.",
    icon: FaMobile
  }
];

const systemRequirements = {
  web: {
    title: "Web Trader Requirements",
    requirements: [
      "Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)",
      "Internet connection (minimum 1 Mbps)",
      "JavaScript enabled",
      "Minimum 4GB RAM",
      "Any operating system"
    ]
  },
  mobile: {
    title: "Mobile App Requirements",
    requirements: [
      "iOS 13.0 or later / Android 8.0 or later",
      "Minimum 2GB RAM",
      "500MB free storage",
      "Internet connection (3G or better)",
      "Touch screen device"
    ]
  },
  desktop: {
    title: "Desktop App Requirements",
    requirements: [
      "Windows 10/11 or macOS 10.15+",
      "Minimum 8GB RAM",
      "2GB free storage",
      "Internet connection (5 Mbps recommended)",
      "1920x1080 minimum resolution"
    ]
  }
};

export default function Platforms() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero Section */}
      <section className="relative z-0 flex flex-col justify-center items-center min-h-[70vh] w-full text-center px-4 pt-20">
        <div className="absolute inset-0 w-full h-full z-[-1]" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(58, 141, 222, 0.25) 0%, rgba(10, 15, 26, 0.0) 80%)' }} />
        <div className="w-full max-w-4xl mx-auto z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold mb-6 text-[var(--foreground)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Trading <span className="text-[var(--brand)]">Platforms</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-[var(--foreground)]/80 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Choose from our range of powerful trading platforms designed for every device and experience level.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a href="#platforms" className="inline-block px-8 py-3 bg-[var(--brand)] text-[var(--foreground)] font-semibold text-lg shadow rounded hover:opacity-90 transition">
              Explore Platforms
            </a>
            <a href="#download" className="inline-block px-8 py-3 border-2 border-[var(--brand)] text-[var(--brand)] font-semibold text-lg rounded hover:bg-[var(--brand)]/10 transition">
              Download Now
            </a>
          </motion.div>
        </div>
      </section>

      {/* Platform Overview Section */}
      <section id="platforms" className="w-full max-w-6xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Choose Your <span className="text-[var(--brand)]">Platform</span>
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <motion.div
                key={platform.name}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-2xl p-8 relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'var(--shine)' }} />
                <div className="flex items-start justify-between mb-6 z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--brand)]/20 flex items-center justify-center">
                      <Icon className="text-[var(--brand)]" size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--foreground)]">{platform.name}</h3>
                      <p className="text-[var(--brand)] font-medium">{platform.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <FaStar className="text-yellow-500" size={16} />
                      <span className="font-semibold">{platform.rating}</span>
                    </div>
                    <span className="text-sm text-[var(--foreground)]/60">{platform.users} users</span>
                  </div>
                </div>
                
                <p className="text-[var(--foreground)]/80 mb-6 z-10">{platform.description}</p>
                
                <div className="mb-6 z-10">
                  <h4 className="font-semibold text-[var(--foreground)] mb-3">Key Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {platform.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-[var(--foreground)]/70">
                        <FaCheck className="text-green-500" size={12} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 z-10">
                  <div>
                    <h4 className="font-semibold text-green-500 mb-2">Pros:</h4>
                    <div className="space-y-1">
                      {platform.pros.map((pro, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-[var(--foreground)]/80">
                          <FaCheck className="text-green-500" size={10} />
                          {pro}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-500 mb-2">Cons:</h4>
                    <div className="space-y-1">
                      {platform.cons.map((con, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-[var(--foreground)]/80">
                          <FaTimes className="text-red-500" size={10} />
                          {con}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-[var(--brand)] text-[var(--foreground)] font-semibold rounded-lg hover:opacity-90 transition z-10">
                  {platform.type === "Browser-based" ? "Launch Platform" : "Download Platform"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="w-full max-w-6xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Platform <span className="text-[var(--brand)]">Features</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 text-center relative overflow-hidden hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'var(--shine)' }} />
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-[var(--brand)]/20 z-10">
                  <Icon className="text-[var(--brand)]" size={28} />
                </div>
                <h3 className="font-semibold text-lg mb-3 text-[var(--foreground)] z-10">{feature.title}</h3>
                <p className="text-[var(--foreground)]/80 text-sm z-10">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* System Requirements Section */}
      <section className="w-full max-w-6xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          System <span className="text-[var(--brand)]">Requirements</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(systemRequirements).map(([key, req], index) => (
            <motion.div
              key={key}
              className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4 text-[var(--brand)]">{req.title}</h3>
              <ul className="space-y-2">
                {req.requirements.map((requirement, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[var(--foreground)]/80">
                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" size={12} />
                    {requirement}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="w-full bg-[var(--brand)] mt-32 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 text-[var(--foreground)]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to <span className="text-[var(--foreground)]/90">Start Trading</span>?
          </motion.h2>
          <motion.p 
            className="text-lg mb-8 text-[var(--foreground)]/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Download your preferred platform and start trading in minutes. All platforms are free to use.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a href="/web-trader" className="inline-block px-8 py-3 bg-[var(--foreground)] text-[var(--brand)] font-semibold text-lg shadow rounded hover:bg-[var(--foreground)]/90 transition">
              Launch Web Trader
            </a>
            <a href="/mobile-app" className="inline-block px-8 py-3 border-2 border-[var(--foreground)] text-[var(--foreground)] font-semibold text-lg rounded hover:bg-[var(--foreground)]/10 transition">
              Download Mobile App
            </a>
            <a href="/desktop-app" className="inline-block px-8 py-3 border-2 border-[var(--foreground)] text-[var(--foreground)] font-semibold text-lg rounded hover:bg-[var(--foreground)]/10 transition">
              Download Desktop
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 