"use client";

import { motion } from "framer-motion";
import { FaGraduationCap, FaBook, FaChartLine, FaUsers, FaClock, FaStar, FaDownload, FaVideo, FaFileAlt, FaGlobe, FaBitcoin, FaDollarSign, FaShieldAlt } from 'react-icons/fa';

const courses = [
  {
    title: "Investment Fundamentals",
    level: "Beginner",
    duration: "4 hours",
    rating: 4.8,
    students: "2,450",
    description: "Learn the basics of investing, risk management, and portfolio building.",
    topics: ["Investment Basics", "Risk & Return", "Diversification", "Market Analysis"],
    icon: FaGraduationCap,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Advanced Trading Strategies",
    level: "Intermediate",
    duration: "6 hours",
    rating: 4.9,
    students: "1,890",
    description: "Master advanced trading techniques and risk management strategies.",
    topics: ["Technical Analysis", "Risk Management", "Trading Psychology", "Strategy Development"],
    icon: FaChartLine,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Cryptocurrency Mastery",
    level: "Intermediate",
    duration: "5 hours",
    rating: 4.7,
    students: "3,120",
    description: "Understand blockchain technology and crypto trading fundamentals.",
    topics: ["Blockchain Basics", "Crypto Trading", "DeFi", "Security"],
    icon: FaBitcoin,
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Forex Trading Essentials",
    level: "Beginner",
    duration: "5 hours",
    rating: 4.6,
    students: "1,980",
    description: "Master the world's largest financial market with expert guidance.",
    topics: ["Currency Pairs", "Market Analysis", "Risk Management", "Trading Tools"],
    icon: FaGlobe,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Portfolio Management",
    level: "Advanced",
    duration: "8 hours",
    rating: 4.9,
    students: "1,250",
    description: "Learn professional portfolio management and optimization techniques.",
    topics: ["Asset Allocation", "Rebalancing", "Performance Analysis", "Tax Optimization"],
    icon: FaShieldAlt,
    color: "from-indigo-500 to-blue-500"
  },
  {
    title: "Options & Derivatives",
    level: "Advanced",
    duration: "7 hours",
    rating: 4.8,
    students: "980",
    description: "Master complex financial instruments and hedging strategies.",
    topics: ["Options Basics", "Strategies", "Risk Assessment", "Advanced Techniques"],
    icon: FaDollarSign,
    color: "from-yellow-500 to-orange-500"
  }
];

const webinars = [
  {
    title: "Market Outlook 2024",
    date: "Dec 15, 2024",
    time: "2:00 PM EST",
    speaker: "Dr. Sarah Johnson",
    topic: "Economic Trends & Investment Opportunities",
    attendees: "1,200+",
    status: "Upcoming"
  },
  {
    title: "Crypto Winter Survival Guide",
    date: "Dec 20, 2024",
    time: "3:00 PM EST",
    speaker: "Mike Chen",
    topic: "Navigating Volatile Markets",
    attendees: "850+",
    status: "Upcoming"
  },
  {
    title: "Risk Management Masterclass",
    date: "Dec 10, 2024",
    time: "1:00 PM EST",
    speaker: "Emily Rodriguez",
    topic: "Protecting Your Capital",
    attendees: "650+",
    status: "Completed"
  }
];

const resources = [
  {
    title: "Investment Glossary",
    type: "PDF Guide",
    description: "Comprehensive glossary of investment terms and concepts.",
    icon: FaBook,
    downloads: "5,200+"
  },
  {
    title: "Risk Assessment Tool",
    type: "Interactive Tool",
    description: "Evaluate your risk tolerance and investment profile.",
    icon: FaChartLine,
    downloads: "3,800+"
  },
  {
    title: "Market Analysis Templates",
    type: "Excel Sheets",
    description: "Professional templates for market analysis and research.",
    icon: FaFileAlt,
    downloads: "2,900+"
  },
  {
    title: "Trading Journal",
    type: "Digital Journal",
    description: "Track your trades and analyze your performance.",
    icon: FaDownload,
    downloads: "4,100+"
  }
];

export default function Education() {
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
            Learn to <span className="text-[var(--brand)]">Invest</span> Like a Pro
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-[var(--foreground)]/80 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Access comprehensive courses, live webinars, and expert resources to build your investment knowledge and skills.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a href="#courses" className="inline-block px-8 py-3 bg-[var(--brand)] text-[var(--foreground)] font-semibold text-lg shadow rounded hover:opacity-90 transition">
              Explore Courses
            </a>
            <a href="#webinars" className="inline-block px-8 py-3 border-2 border-[var(--brand)] text-[var(--brand)] font-semibold text-lg rounded hover:bg-[var(--brand)]/10 transition">
              Join Webinars
            </a>
          </motion.div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="w-full max-w-6xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Choose Your <span className="text-[var(--brand)]">Learning Path</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Beginner",
              description: "Start your investment journey with fundamental concepts and basic strategies.",
              duration: "2-3 months",
              courses: 4,
              icon: FaGraduationCap
            },
            {
              title: "Intermediate",
              description: "Build on your foundation with advanced techniques and practical applications.",
              duration: "3-4 months",
              courses: 6,
              icon: FaChartLine
            },
            {
              title: "Advanced",
              description: "Master complex strategies and become a sophisticated investor.",
              duration: "4-6 months",
              courses: 8,
              icon: FaUsers
            }
          ].map((path, index) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={path.title}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-2xl p-8 text-center relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'var(--shine)' }} />
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-[var(--brand)]/20 z-10">
                  <Icon className="text-[var(--brand)]" size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[var(--foreground)] z-10">{path.title}</h3>
                <p className="text-[var(--foreground)]/80 mb-6 z-10">{path.description}</p>
                <div className="space-y-2 text-sm z-10">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Duration:</span>
                    <span className="text-[var(--brand)]">{path.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/60">Courses:</span>
                    <span className="text-[var(--brand)]">{path.courses}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section id="courses" className="w-full max-w-6xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Featured <span className="text-[var(--brand)]">Courses</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={course.title}
                className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-2xl overflow-hidden relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'var(--shine)' }} />
                <div className={`h-32 bg-gradient-to-r ${course.color} flex items-center justify-center z-10`}>
                  <Icon className="text-white" size={48} />
                </div>
                <div className="p-6 z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--brand)]/20 text-[var(--brand)]">
                      {course.level}
                    </span>
                    <span className="text-[var(--foreground)]/60 text-sm flex items-center gap-1">
                      <FaClock size={12} />
                      {course.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[var(--foreground)]">{course.title}</h3>
                  <p className="text-[var(--foreground)]/80 mb-4">{course.description}</p>
                  <div className="space-y-3 mb-6">
                    {course.topics.slice(0, 3).map((topic, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-[var(--foreground)]/70">
                        <div className="w-2 h-2 rounded-full bg-[var(--brand)]" />
                        {topic}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FaStar className="text-yellow-500" size={16} />
                      <span className="text-[var(--foreground)] font-semibold">{course.rating}</span>
                    </div>
                    <span className="text-[var(--foreground)]/60 text-sm">{course.students} students</span>
                  </div>
                  <button className="w-full py-3 bg-[var(--brand)] text-[var(--foreground)] font-semibold rounded-lg hover:opacity-90 transition">
                    Enroll Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Live Webinars Section */}
      <section id="webinars" className="w-full max-w-6xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Live <span className="text-[var(--brand)]">Webinars</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {webinars.map((webinar, index) => (
            <motion.div
              key={webinar.title}
              className="bg-[var(--card-bg)] border border-[var(--brand)]/20 rounded-xl shadow-2xl p-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'var(--shine)' }} />
              <div className="flex items-center gap-3 mb-4 z-10">
                <div className="w-12 h-12 rounded-full bg-[var(--brand)]/20 flex items-center justify-center">
                  <FaVideo className="text-[var(--brand)]" size={20} />
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    webinar.status === 'Upcoming' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {webinar.status}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--foreground)] z-10">{webinar.title}</h3>
              <p className="text-[var(--foreground)]/80 mb-4 z-10">{webinar.topic}</p>
              <div className="space-y-2 mb-6 text-sm z-10">
                <div className="flex items-center gap-2 text-[var(--foreground)]/70">
                  <FaUsers size={14} />
                  <span>{webinar.attendees} attendees</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--foreground)]/70">
                  <FaClock size={14} />
                  <span>{webinar.date} at {webinar.time}</span>
                </div>
                <div className="text-[var(--brand)] font-medium">Speaker: {webinar.speaker}</div>
              </div>
              <button className="w-full py-3 bg-[var(--brand)] text-[var(--foreground)] font-semibold rounded-lg hover:opacity-90 transition z-10">
                {webinar.status === 'Upcoming' ? 'Register Now' : 'Watch Recording'}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Free Resources Section */}
      <section className="w-full max-w-6xl mx-auto mt-32 px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-[var(--foreground)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Free <span className="text-[var(--brand)]">Resources</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={resource.title}
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
                <h3 className="font-semibold text-lg mb-2 text-[var(--foreground)] z-10">{resource.title}</h3>
                <p className="text-[var(--foreground)]/60 text-sm mb-3 z-10">{resource.type}</p>
                <p className="text-[var(--foreground)]/80 text-sm mb-4 z-10">{resource.description}</p>
                <div className="text-[var(--brand)] text-xs mb-4 z-10">{resource.downloads} downloads</div>
                <button className="w-full py-2 bg-[var(--brand)] text-[var(--foreground)] font-semibold rounded-lg hover:opacity-90 transition z-10">
                  Download
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Learning Community Section */}
      <section className="w-full bg-[var(--brand)] mt-32 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 text-[var(--foreground)]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Join Our <span className="text-[var(--foreground)]/90">Learning Community</span>
          </motion.h2>
          <motion.p 
            className="text-lg mb-8 text-[var(--foreground)]/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connect with fellow investors, share insights, and learn from each other in our vibrant community.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a href="/register" className="inline-block px-8 py-3 bg-[var(--foreground)] text-[var(--brand)] font-semibold text-lg shadow rounded hover:bg-[var(--foreground)]/90 transition">
              Join Community
            </a>
            <a href="/discord" className="inline-block px-8 py-3 border-2 border-[var(--foreground)] text-[var(--foreground)] font-semibold text-lg rounded hover:bg-[var(--foreground)]/10 transition">
              Discord Server
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 