'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const contactDetails = [
  {
    icon: Phone,
    label: 'Call Us',
    value: '+91 98765 43210',
    sub: 'Mon – Sat, 10am – 7pm',
    href: 'tel:+919876543210',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'care@gbjjewellers.com',
    sub: 'We reply within 24 hours',
    href: 'mailto:care@gbjjewellers.com',
  },
  {
    icon: MapPin,
    label: 'Visit Us',
    value: 'Nawa City, Nagaur',
    sub: 'Rajasthan, India',
    href: 'https://maps.google.com/?q=Nawa+City+Nagaur+Rajasthan',
  },
  {
    icon: Clock,
    label: 'Store Hours',
    value: '10:00 AM – 7:00 PM',
    sub: 'Monday through Saturday',
    href: null,
  },
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return;
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section id="contact" className="bg-bg py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-primary-hover mb-3">
            Get In Touch
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-text mb-3">
            We&apos;d Love to Hear From You
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            Whether you have a custom order in mind or a question about our jewellery,
            our team is here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — Contact Cards */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            {contactDetails.map(({ icon: Icon, label, value, sub, href }) => {
              const Wrapper = href ? 'a' : 'div';
              const wrapperProps = href
                ? { href, target: '_blank', rel: 'noopener noreferrer' }
                : {};

              return (
                <Wrapper
                  key={label}
                  {...wrapperProps}
                  className="group flex items-start gap-5 bg-card p-5 border border-border
                    hover:border-primary dark:hover:border-primary-hover transition-all duration-300"
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0
                                group-hover:scale-110 transition-transform duration-300"
                    style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}
                  >
                    <Icon size={16} className="text-on-dark" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-primary-hover font-semibold mb-0.5">
                      {label}
                    </p>
                    <p className="text-text font-medium text-sm">{value}</p>
                    <p className="text-muted text-xs mt-0.5">{sub}</p>
                  </div>
                </Wrapper>
              );
            })}

            {/* Map embed placeholder */}
            <a
              href="https://maps.google.com/?q=Nawa+City+Nagaur+Rajasthan"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative overflow-hidden border border-border hover:border-primary
                         transition-all duration-300 group"
              style={{ height: '160px' }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(160deg, #1a1a2e 0%, #2d2410 100%)',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center
                              group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}
                >
                  <MapPin size={18} className="text-on-dark" />
                </div>
                <p className="text-on-dark text-sm font-medium">Nawa City, Nagaur, Rajasthan</p>
                <p className="text-accent text-xs tracking-widest uppercase">
                  Open in Google Maps →
                </p>
              </div>
            </a>
          </motion.div>

          {/* Right — Enquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card border border-border p-8"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle size={48} className="text-primary" />
                </motion.div>
                <h3 className="font-serif text-2xl font-bold text-text">
                  Message Received!
                </h3>
                <p className="text-sm text-muted max-w-xs">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', message: '' }); }}
                  className="mt-2 text-xs text-primary hover:underline tracking-widest uppercase"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="mb-7">
                  <p className="text-[10px] tracking-[0.35em] uppercase text-primary-hover mb-1">
                    Enquiry Form
                  </p>
                  <h3 className="font-serif text-xl font-bold text-text">
                    Send Us a Message
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-text tracking-wider uppercase mb-1.5">
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="w-full border border-border px-4 py-3 text-sm text-text
                                 placeholder-gray-400 focus:outline-none focus:border-primary
                                 transition-colors bg-bg"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-text tracking-wider uppercase mb-1.5">
                      Phone Number <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      required
                      className="w-full border border-border px-4 py-3 text-sm text-text
                                 placeholder-gray-400 focus:outline-none focus:border-primary
                                 transition-colors bg-bg"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-text tracking-wider uppercase mb-1.5">
                      Message <span className="text-primary">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your requirements, custom order, or any question…"
                      required
                      rows={5}
                      className="w-full border border-border px-4 py-3 text-sm text-text
                                 placeholder-gray-400 focus:outline-none focus:border-primary
                                 transition-colors bg-bg resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 text-xs font-bold
                               tracking-widest uppercase text-surface-dark transition-all duration-300
                               hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}
                  >
                    {loading ? (
                      <span className="animate-pulse">Sending…</span>
                    ) : (
                      <>
                        <Send size={14} />
                        Send Enquiry
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-muted text-center">
                    We typically respond within 24 hours on working days.
                  </p>
                </form>
              </>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
