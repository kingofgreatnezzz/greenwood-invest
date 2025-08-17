"use client";

import { motion } from "framer-motion";
import { FaGift, FaUsers, FaStar, FaCheck, FaArrowRight, FaPercent, FaDollarSign, FaTrophy, FaRocket, FaShieldAlt, FaChartLine } from 'react-icons/fa';

const currentPromotions = [
  {
    title: "Welcome Bonus",
    subtitle: "New User Special",
    description: "Get a 100% bonus on your first deposit up to $1,000. Start your investment journey with double the capital.",
    bonus: "100%",
    maxAmount: "$1,000",
    requirements: ["Minimum deposit: $100", "Valid for 30 days", "No hidden fees"],
    icon: FaGift,
    color: "from-blue-500 to-cyan-500",
    validUntil: "Dec 31, 2024",
    status: "Active"
  },
  {
    title: "Referral Program",
    subtitle: "Earn While You Grow",
    description: "Invite friends and earn up to $500 for each successful referral. Both you and your friend get bonuses.",
    bonus: "$500",
    maxAmount: "per referral",
    requirements: ["Friend must deposit $100+", "Account verification required", "30-day holding period"],
    icon: FaUsers,
    color: "from-green-500 to-emerald-500",
    validUntil: "Ongoing",
    status: "Active"
  },
  {
    title: "Loyalty Rewards",
    subtitle: "VIP Benefits",
    description: "Earn points for every trade and unlock exclusive benefits, lower fees, and premium support.",
    bonus: "Up to 50%",
    maxAmount: "fee reduction",
    requirements: ["Active trading account", "Minimum 6 months", "Tier-based rewards"],
    icon: FaStar,
    color: "from-purple-500 to-pink-500",
    validUntil: "Ongoing",
    status: "Active"
  }
];

const seasonalOffers = [
  {
    title: "Holiday Trading Contest",
    description: "Trade during the holiday season and compete for prizes worth over $50,000.",
    prize: "$50,000+",
    duration: "Dec 1 - Dec 31",
    participants: "2,500+",
    icon: FaTrophy,
    status: "Registration Open"
  },
  {
    title: "New Year Special",
    description: "Start 2025 with exclusive bonuses and reduced fees for all new investments.",
    bonus: "25% off fees",
    duration: "Jan 1 - Jan 31",
    participants: "All Users",
    icon: FaRocket,
    status: "Coming Soon"
  },
  {
    title: "Spring Trading Challenge",
    description: "Spring into action with our seasonal trading challenge and win amazing rewards.",
    prize: "$25,000+",
    duration: "Mar 1 - Mar 31",
    participants: "1,000+",
    icon: FaChartLine,
    status: "Coming Soon"
  }
];

const bonusTypes = [
  {
    title: "Deposit Bonus",
    description: "Get extra funds when you make a deposit",
    percentage: "Up to 100%",
    icon: FaPercent
  },
  {
    title: "No Deposit Bonus",
    description: "Start trading with free bonus funds",
    amount: "$50 - $200",
    icon: FaGift
  },
  {
    title: "Cashback Bonus",
    description: "Earn money back on your trading fees",
    percentage: "Up to 30%",
    icon: FaDollarSign
  },
  {
    title: "Risk-Free Trading",
    description: "Practice with virtual money before real trading",
    amount: "$10,000",
    icon: FaShieldAlt
  }
];

export default function Promotions() {
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
            Exclusive <span className="text-[var(--brand)]">Promotions</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-[var(--foreground)]/80 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover amazing bonuses, rewards, and special offers designed to boost your investment journey.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a href="#current" className="inline-block px-8 py-3 bg-[var(--brand)] text-[var(--foreground)] font-semibold text-lg shadow rounded hover:opacity-90 transition">
              View Offers
            </a>
            <a href="/register" className="inline-block px-8 py-3 border-2 border-[var(--brand)] text-[var(--brand)] font-semibold text-lg rounded hover:bg-[var(--brand)]/10 transition">
              Claim Bonus
            </a>
          </motion.div>
        </div>
      </section>

      {/* Current Promotions Section */}
      <section id="current" className="w-full max-w-6xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Current <span className="text-[var(--brand)]">Promotions</span>
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {currentPromotions.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <motion.div
                key={promo.title}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-2xl overflow-hidden relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'var(--shine)' }} />
                <div className={`h-32 bg-gradient-to-r ${promo.color} flex items-center justify-center relative`}>
                  <Icon className="text-white" size={48} />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      promo.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {promo.status}
                    </span>
                  </div>
                </div>
                <div className="p-6 z-10">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2 text-[var(--foreground)]">{promo.title}</h3>
                    <p className="text-[var(--brand)] font-medium mb-2">{promo.subtitle}</p>
                    <p className="text-[var(--foreground)]/80 text-sm">{promo.description}</p>
                  </div>
                  
                  <div className="bg-[var(--brand)]/10 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[var(--brand)] mb-1">{promo.bonus}</div>
                      <div className="text-sm text-[var(--foreground)]/80">Up to {promo.maxAmount}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-[var(--foreground)] mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {promo.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-[var(--foreground)]/70">
                          <FaCheck className="text-green-500" size={12} />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm">
                    <span className="text-[var(--foreground)]/60">Valid until:</span>
                    <span className="text-[var(--brand)] font-medium">{promo.validUntil}</span>
                  </div>

                  <button className="w-full py-3 bg-[var(--brand)] text-[var(--foreground)] font-semibold rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2">
                    Claim Offer <FaArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Bonus Types Section */}
      <section className="w-full max-w-6xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Types of <span className="text-[var(--brand)]">Bonuses</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bonusTypes.map((bonus, index) => {
            const Icon = bonus.icon;
            return (
              <motion.div
                key={bonus.title}
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
                <h3 className="font-semibold text-lg mb-3 text-[var(--foreground)] z-10">{bonus.title}</h3>
                <p className="text-[var(--foreground)]/80 text-sm mb-4 z-10">{bonus.description}</p>
                <div className="text-[var(--brand)] font-bold text-lg z-10">
                  {bonus.percentage || bonus.amount}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Seasonal Offers Section */}
      <section className="w-full max-w-6xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Seasonal <span className="text-[var(--brand)]">Offers</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {seasonalOffers.map((offer, index) => {
            const Icon = offer.icon;
            return (
              <motion.div
                key={offer.title}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'var(--shine)' }} />
                <div className="flex items-center gap-4 mb-4 z-10">
                  <div className="w-16 h-16 rounded-full bg-[var(--brand)]/20 flex items-center justify-center">
                    <Icon className="text-[var(--brand)]" size={28} />
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      offer.status === 'Registration Open' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {offer.status}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[var(--foreground)] z-10">{offer.title}</h3>
                <p className="text-[var(--foreground)]/80 mb-4 z-10">{offer.description}</p>
                <div className="space-y-2 mb-6 text-sm z-10">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Prize:</span>
                    <span className="text-[var(--brand)] font-semibold">{offer.prize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Duration:</span>
                    <span className="text-[var(--foreground)]/80">{offer.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Participants:</span>
                    <span className="text-[var(--foreground)]/80">{offer.participants}</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-[var(--brand)] text-[var(--foreground)] font-semibold rounded-lg hover:opacity-90 transition z-10">
                  {offer.status === 'Registration Open' ? 'Register Now' : 'Get Notified'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How to Claim Section */}
      <section className="w-full max-w-5xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How to <span className="text-[var(--brand)]">Claim</span> Your Bonus
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Create Account",
              description: "Sign up for a free account and complete verification",
              icon: FaUsers
            },
            {
              step: "02",
              title: "Choose Offer",
              description: "Select the promotion you want to claim",
              icon: FaGift
            },
            {
              step: "03",
              title: "Meet Requirements",
              description: "Complete the required conditions for the bonus",
              icon: FaCheck
            },
            {
              step: "04",
              title: "Get Bonus",
              description: "Receive your bonus funds instantly",
              icon: FaStar
            }
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-20 h-20 flex items-center justify-center rounded-full mb-4 shadow-md relative bg-[var(--brand)]/10">
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-[var(--brand)] text-[var(--foreground)]">
                    {step.step}
                  </span>
                  <Icon className="text-[var(--brand)]" size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[var(--foreground)]">{step.title}</h3>
                <p className="text-sm text-[var(--foreground)]/80">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-[var(--brand)] mt-32 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 text-[var(--foreground)]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Don&apos;t Miss Out on <span className="text-[var(--foreground)]/90">Amazing Offers</span>
          </motion.h2>
          <motion.p 
            className="text-lg mb-8 text-[var(--foreground)]/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of investors who are already benefiting from our exclusive promotions and bonuses.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a href="/register" className="inline-block px-8 py-3 bg-[var(--foreground)] text-[var(--brand)] font-semibold text-lg shadow rounded hover:bg-[var(--foreground)]/90 transition">
              Claim Your Bonus
            </a>
            <a href="/contact" className="inline-block px-8 py-3 border-2 border-[var(--foreground)] text-[var(--foreground)] font-semibold text-lg rounded hover:bg-[var(--foreground)]/10 transition">
              Contact Support
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 