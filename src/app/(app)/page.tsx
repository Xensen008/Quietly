'use client';

import { Mail, Shield, MessageSquare, Heart, ArrowRight, Sparkles, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/Message.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
};

const features = [
  {
    icon: <Shield style={{ width: 16, height: 16, color: '#D4674F' }} />,
    title: 'No sign-up required',
    desc: 'Anyone can leave feedback without an account.',
  },
  {
    icon: <MessageSquare style={{ width: 16, height: 16, color: '#D4674F' }} />,
    title: 'One simple link',
    desc: 'Share your unique page anywhere you like.',
  },
  {
    icon: <Heart style={{ width: 16, height: 16, color: '#D4674F' }} />,
    title: 'Honest insights',
    desc: 'Get genuine, unfiltered thoughts.',
  },
];

const useCases = [
  'Project feedback', 'Startup ideas', 'Career advice',
  'Secret opinions', 'Anonymous Q&A', 'Dating confessions',
  'Team reviews', 'Portfolio critique', 'Content ideas',
  'Honest ratings', 'Life decisions', 'Creative work',
];

const steps = [
  {
    n: '01',
    icon: <Users style={{ width: 16, height: 16, color: '#D4674F' }} />,
    title: 'Create your space',
    desc: 'Sign up and get your unique Quietly link in seconds.',
  },
  {
    n: '02',
    icon: <Zap style={{ width: 16, height: 16, color: '#D4674F' }} />,
    title: 'Share it anywhere',
    desc: 'Drop your link in your bio, Twitter, Discord, wherever your people are.',
  },
  {
    n: '03',
    icon: <Sparkles style={{ width: 16, height: 16, color: '#D4674F' }} />,
    title: 'Receive & enjoy',
    desc: 'Watch honest, unfiltered messages roll in — no names, no filters.',
  },
];

export default function Home() {
  return (
    <div style={{ background: '#FAFAF8', color: '#1A1A1A', fontFamily: "'Space Mono', monospace" }}>

      <section
        className="px-6 pt-24 pb-14"
        style={{ background: 'linear-gradient(160deg, #FAFAF8 55%, #FBF0ED 100%)' }}
      >
        <div className="max-w-3xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-10 text-center mx-auto"
            style={{ maxWidth: 520 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block mb-4 px-3 py-1 rounded-full tracking-widest uppercase"
              style={{ fontSize: '10px', color: '#D4674F', background: '#FAE8E4', letterSpacing: '0.14em' }}
            >
              Ask me anything · Anonymous
            </motion.span>

            <h1
              className="font-bold leading-tight mb-4"
              style={{
                fontSize: 'clamp(34px, 5vw, 50px)',
                fontFamily: "'DM Serif Display', serif",
                color: '#1A1A1A',
                letterSpacing: '-0.5px',
              }}
            >
              Your personal inbox for{' '}
              <span style={{ color: '#D4674F' }}>honest words.</span>
            </h1>

            <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.75, marginBottom: 24 }}>
              Share one link. Let anyone send you anonymous messages — brutal feedback,
              secret crushes, unbiased opinions, or just a kind word.
            </p>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg"
                style={{
                  background: '#D4674F',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(212,103,79,0.3)',
                }}
              >
                Get your free link
                <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -3, boxShadow: i === 1 ? '0 8px 24px rgba(212,103,79,0.35)' : '0 6px 20px rgba(212,103,79,0.13)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="rounded-xl p-5 cursor-default"
                style={{
                  background: i === 1 ? '#D4674F' : '#FFFFFF',
                  border: '1.5px solid',
                  borderColor: i === 1 ? '#D4674F' : '#D4674F40',
                  boxShadow: i === 1 ? '0 4px 16px rgba(212,103,79,0.25)' : '0 2px 12px rgba(212,103,79,0.08)',
                }}
              >
                <div
                  className="mb-3 flex items-center justify-center rounded-md"
                  style={{ width: 32, height: 32, background: i === 1 ? 'rgba(255,255,255,0.18)' : '#FAEDEA' }}
                >
                  {i === 1 ? <f.icon.type style={{ width: 16, height: 16, color: '#FFFFFF' }} /> : f.icon}
                </div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: i === 1 ? '#FFFFFF' : '#1A1A1A', marginBottom: 4 }}>
                  {f.title}
                </p>
                <p style={{ fontSize: '12px', color: i === 1 ? 'rgba(255,255,255,0.75)' : '#9CA3AF', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-14 px-6" style={{ background: '#F5E4DC' }}>
        <div className="max-w-3xl mx-auto">
          <p
            className="text-center mb-8 tracking-widest uppercase"
            style={{ fontSize: '10px', color: '#A8412D', letterSpacing: '0.15em' }}
          >
            Recent messages
          </p>

          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
            opts={{ loop: true, align: 'start' }}
          >
            <CarouselContent className="-ml-3">
              {messages.map((message, index) => (
                <CarouselItem key={index} className="pl-3 basis-full sm:basis-1/2">
                  <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
                    <Card
                      className="rounded-xl border"
                      style={{
                        background: '#FFFFFF',
                        borderColor: '#D4674F55',
                        borderWidth: '1.5px',
                        boxShadow: '0 3px 14px rgba(212,103,79,0.1)',
                      }}
                    >
                      <CardHeader className="pb-2 pt-5 px-5">
                        <CardTitle style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>
                          {message.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-5 pb-5">
                        <div className="flex items-start gap-3">
                          <Mail style={{ width: 13, height: 13, color: '#D4674F', marginTop: 2, flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.65 }}>{message.content}</p>
                            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: 5 }}>{message.received}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious style={{ background: '#FFFFFF', border: '1px solid #E2DFD9', color: '#6B7280' }} />
              <CarouselNext style={{ background: '#FFFFFF', border: '1px solid #E2DFD9', color: '#6B7280' }} />
            </div>
          </Carousel>
        </div>
      </section>

      <section className="py-14 px-6" style={{ background: '#1A1A1A' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="mb-6 tracking-widest uppercase"
            style={{ fontSize: '10px', color: '#A8412D', letterSpacing: '0.15em' }}
          >
            Use it for anything
          </p>
          <h2
            className="mb-8 font-bold"
            style={{ fontSize: '18px', fontFamily: "'DM Serif Display', serif", color: '#FAFAF8' }}
          >
            People ask about everything.
          </h2>
          <motion.div
            className="flex flex-wrap justify-center gap-2"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {useCases.map((tag, i) => (
              <motion.span
                key={i}
                variants={fadeUp}
                whileHover={{ scale: 1.06, backgroundColor: '#D4674F', color: '#FFFFFF' }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, backgroundColor: { duration: 0.15 }, color: { duration: 0.15 } }}
                className="px-3 py-1.5 rounded-full cursor-default"
                style={{
                  fontSize: '12px',
                  backgroundColor: '#2A2A2A',
                  color: '#D1C8C4',
                  border: '1px solid #3A3A3A',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none',
                  display: 'inline-block',
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-14 px-6" style={{ background: '#FAFAF8' }}>
        <div className="max-w-3xl mx-auto">
          <p
            className="text-center mb-2 tracking-widest uppercase"
            style={{ fontSize: '10px', color: '#A8412D', letterSpacing: '0.15em' }}
          >
            How it works
          </p>
          <h2
            className="text-center mb-10 font-bold"
            style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A1A" }}
          >
            Three steps. That's it.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ y: -3 }}
                className="rounded-xl p-5 cursor-default"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #D4674F40',
                  boxShadow: '0 2px 12px rgba(212,103,79,0.07)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#D4674F',
                      fontFamily: 'monospace',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {s.n}
                  </span>
                  <div
                    className="flex items-center justify-center rounded-md"
                    style={{ width: 28, height: 28, background: '#FAEDEA' }}
                  >
                    {s.icon}
                  </div>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>{s.title}</p>
                <p style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.65 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-14 px-6 text-center"
        style={{ background: 'linear-gradient(160deg, #FBF0ED 0%, #FAFAF8 100%)' }}
      >
        <div className="max-w-md mx-auto">
          <h2
            className="font-bold mb-3"
            style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A" }}
          >
            Ready to hear what people <span style={{ color: '#D4674F' }}>really think?</span>
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: 20, lineHeight: 1.7 }}>
            It's free. It's anonymous. It's the most honest thing on the internet.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg"
              style={{
                background: '#1A1A1A',
                color: '#FAFAF8',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              }}
            >
              Create your link — free
              <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer
        className="text-center py-5 px-6"
        style={{ borderTop: '1px solid #E8E6E1', background: '#FAFAF8' }}
      >
        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
          © {new Date().getFullYear()} Quietly. All rights reserved.
        </p>
      </footer>
    </div>
  );
}