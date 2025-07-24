import React from 'react';

export default function About() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-[var(--brand)]">About Us</h1>
        <p className="mb-6 text-lg text-[var(--foreground)]/80">We are dedicated to empowering investors with smart tools, expert insights, and a secure platform. Our mission is to help you grow your wealth and achieve your financial goals with confidence.</p>
        <h2 className="text-2xl font-semibold mb-2 text-[var(--brand)]">Our Mission</h2>
        <p className="mb-4 text-[var(--foreground)]/80">To make investing accessible, transparent, and rewarding for everyone.</p>
        <h2 className="text-2xl font-semibold mb-2 text-[var(--brand)]">Our Values</h2>
        <ul className="list-disc pl-6 text-[var(--foreground)]/80">
          <li>Integrity & Transparency</li>
          <li>Client-Centric Approach</li>
          <li>Innovation & Excellence</li>
          <li>Education & Empowerment</li>
        </ul>
      </div>
    </main>
  );
} 