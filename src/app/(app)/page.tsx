'use client';

import { Mail, Shield, MessageSquare, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
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

export default function Home() {
  return (
    <div style={{ background: '#FAFAF8', color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif" }}>

      <section
        className="min-h-screen flex flex-col justify-center px-6 pt-20 pb-12"
        style={{
          background: 'linear-gradient(160deg, #FAFAF8 55%, #FBF0ED 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-10"
          >
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full tracking-widest uppercase"
              style={{
                fontSize: '10px',
                color: '#D4674F',
                background: '#FAE8E4',
                letterSpacing: '0.14em',
              }}
            >
              Anonymous feedback
            </span>

            <h1
              className="font-bold leading-tight mb-4"
              style={{
                fontSize: 'clamp(36px, 5vw, 50px)',
                fontFamily: "'DM Serif Display', serif",
                color: '#1A1A1A',
                letterSpacing: '-0.5px',
                maxWidth: '580px',
              }}
            >
              A quiet place for{' '}
              <span style={{ color: '#D4674F' }}>honest words.</span>
            </h1>

            <p style={{ fontSize: '15px', color: '#6B7280', maxWidth: '400px', lineHeight: 1.7 }}>
              Create your space. Share your link. Get real, anonymous feedback — no accounts needed.
            </p>
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
                className="rounded-xl p-5"
                style={{
                  background: i === 1 ? '#D4674F' : '#FFFFFF',
                  border: '1.5px solid',
                  borderColor: i === 1 ? '#D4674F' : '#D4674F40',
                  boxShadow: i === 1 ? '0 4px 16px rgba(212,103,79,0.25)' : '0 2px 12px rgba(212,103,79,0.08)',
                }}
              >
                <div
                  className="mb-3 flex items-center justify-center rounded-md"
                  style={{
                    width: 32,
                    height: 32,
                    background: i === 1 ? 'rgba(255,255,255,0.18)' : '#FAEDEA',
                  }}
                >
                  {i === 1
                    ? <f.icon.type style={{ width: 16, height: 16, color: '#FFFFFF' }} />
                    : f.icon}
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: i === 1 ? '#FFFFFF' : '#1A1A1A',
                    marginBottom: 4,
                  }}
                >
                  {f.title}
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    color: i === 1 ? 'rgba(255,255,255,0.75)' : '#9CA3AF',
                    lineHeight: 1.6,
                  }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        className="py-16 px-6"
        style={{ background: '#FBF0ED' }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-center mb-8 tracking-widest uppercase"
            style={{ fontSize: '10px', color: '#D4674F', letterSpacing: '0.15em' }}
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
                          <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.65 }}>
                            {message.content}
                          </p>
                          <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: 5 }}>
                            {message.received}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious
                style={{ background: '#FFFFFF', border: '1px solid #E2DFD9', color: '#6B7280' }}
              />
              <CarouselNext
                style={{ background: '#FFFFFF', border: '1px solid #E2DFD9', color: '#6B7280' }}
              />
            </div>
          </Carousel>
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