"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaUsers, FaShieldAlt, FaChartLine, FaGlobe, FaHandshake, FaLightbulb, FaHeart } from 'react-icons/fa';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stats = [
  { number: "50K+", label: "Active Users", icon: FaUsers },
  { number: "$2.5B+", label: "Assets Under Management", icon: FaChartLine },
  { number: "150+", label: "Countries Served", icon: FaGlobe },
  { number: "99.9%", label: "Uptime", icon: FaShieldAlt }
];

const values = [
  {
    icon: FaShieldAlt,
    title: "Integrity & Transparency",
    description: "We believe in complete transparency in all our operations. Every decision, every fee, and every process is clearly communicated to our clients."
  },
  {
    icon: FaHandshake,
    title: "Client-Centric Approach",
    description: "Your success is our success. We put our clients first, providing personalized solutions and dedicated support throughout your investment journey."
  },
  {
    icon: FaLightbulb,
    title: "Innovation & Excellence",
    description: "We continuously innovate our platform and services to provide you with cutting-edge tools and the best possible investment experience."
  },
  {
    icon: FaHeart,
    title: "Education & Empowerment",
    description: "We believe knowledge is power. Our comprehensive educational resources empower you to make informed investment decisions."
  }
];

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    bio: "Former Wall Street executive with 15+ years in investment banking and asset management.",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Michael Chen",
    role: "CTO",
    bio: "Technology leader with expertise in fintech, blockchain, and secure financial platforms.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Investment Strategy",
    bio: "CFA charterholder with deep expertise in portfolio management and risk assessment.",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    name: "David Thompson",
    role: "Head of Compliance",
    bio: "Regulatory expert ensuring our platform meets the highest standards of financial security.",
    image: "https://randomuser.me/api/portraits/men/85.jpg"
  }
];

export default function About() {
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
            About <span className="text-[var(--brand)]">investlp</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-[var(--foreground)]/80 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We are dedicated to empowering investors with smart tools, expert insights, and a secure platform. Our mission is to help you grow your wealth and achieve your financial goals with confidence.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="w-full max-w-5xl mx-auto mt-32 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
          >
            <h2 className="text-3xl font-bold mb-6 text-[var(--brand)]">Our Mission</h2>
            <p className="text-lg text-[var(--foreground)]/80 mb-6">
              To make investing accessible, transparent, and rewarding for everyone. We believe that financial success should not be limited to the wealthy or financially educated.
            </p>
            <p className="text-[var(--foreground)]/70">
              By providing cutting-edge technology, comprehensive education, and personalized support, we empower individuals from all walks of life to take control of their financial future.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-[var(--brand)]">Our Vision</h2>
            <p className="text-lg text-[var(--foreground)]/80 mb-6">
              To become the world&apos;s most trusted and innovative investment platform, democratizing access to wealth-building opportunities for millions of people worldwide.
            </p>
            <p className="text-[var(--foreground)]/70">
              We envision a future where everyone has the tools, knowledge, and confidence to build lasting wealth through intelligent investing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="w-full max-w-6xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Trusted by <span className="text-[var(--brand)]">Millions</span> Worldwide
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-[var(--brand)]/20">
                  <Icon className="text-[var(--brand)]" size={32} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-[var(--brand)] mb-2">{stat.number}</div>
                <div className="text-[var(--foreground)]/80">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full max-w-6xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our <span className="text-[var(--brand)]">Core Values</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-2xl p-8 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                transition={{ delay: index * 0.1 }}
              >
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'var(--shine)' }} />
                <div className="flex items-center gap-4 mb-6 z-10">
                  <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--brand)]/20">
                    <Icon className="text-[var(--brand)]" size={32} />
                  </span>
                  <h3 className="font-semibold text-2xl text-[var(--foreground)]">{value.title}</h3>
                </div>
                <p className="text-[var(--foreground)]/80 text-lg z-10">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full max-w-6xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Meet Our <span className="text-[var(--brand)]">Leadership Team</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-xl p-6 text-center relative overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'var(--shine)' }} />
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[var(--brand)]/20 z-10">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-xl mb-2 text-[var(--foreground)] z-10">{member.name}</h3>
              <p className="text-[var(--brand)] text-sm mb-3 z-10">{member.role}</p>
              <p className="text-[var(--foreground)]/70 text-sm z-10">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Company History Section */}
      <section className="w-full max-w-5xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our <span className="text-[var(--brand)]">Journey</span>
        </motion.h2>
        <div className="space-y-8">
          {[
            { year: "2018", title: "Foundation", description: "investlp was founded with a vision to democratize investment opportunities." },
            { year: "2019", title: "First Launch", description: "Launched our first investment platform with basic trading capabilities." },
            { year: "2020", title: "Growth", description: "Reached 10,000 users and expanded to multiple markets." },
            { year: "2021", title: "Innovation", description: "Introduced AI-powered investment recommendations and advanced analytics." },
            { year: "2022", title: "Expansion", description: "Expanded to 50+ countries and launched mobile applications." },
            { year: "2023", title: "Leadership", description: "Became a market leader with over 50,000 active users worldwide." },
            { year: "2024", title: "Future", description: "Continuing to innovate and expand our global reach." }
          ].map((milestone, index) => (
            <motion.div
              key={milestone.year}
              className="flex items-start gap-6"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[var(--brand)]/20 flex-shrink-0">
                <span className="text-[var(--brand)] font-bold text-lg">{milestone.year}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[var(--foreground)]">{milestone.title}</h3>
                <p className="text-[var(--foreground)]/80">{milestone.description}</p>
              </div>
            </motion.div>
          ))}
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
            Join the <span className="text-[var(--foreground)]/90">investlp</span> Family
          </motion.h2>
          <motion.p 
            className="text-lg mb-8 text-[var(--foreground)]/90"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Be part of our mission to democratize investing and help millions achieve financial freedom.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a href="/register" className="inline-block px-8 py-3 bg-[var(--foreground)] text-[var(--brand)] font-semibold text-lg shadow rounded hover:bg-[var(--foreground)]/90 transition">
              Get Started Today
            </a>
            <a href="/contact" className="inline-block px-8 py-3 border-2 border-[var(--foreground)] text-[var(--foreground)] font-semibold text-lg rounded hover:bg-[var(--foreground)]/10 transition">
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 