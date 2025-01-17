'use client';

import { Mail, Shield, MessageSquare, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-24 px-4 md:px-6 lg:px-8 overflow-hidden">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            className="text-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200">
                Share Quietly
              </span>
            </motion.h1>
            <motion.p 
              className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Create your space. Share your link. Get honest feedback.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section 
        className="py-20 px-4 md:px-6 lg:px-8"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={fadeInUp}>
              <Card className="bg-white/5 backdrop-blur-lg border-0 shadow-xl hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <Shield className="h-8 w-8 text-indigo-300 mb-2" />
                  <CardTitle className="text-white/90">No Sign-up Required</CardTitle>
                  <CardDescription className="text-gray-400">
                    Anyone can leave feedback anonymously
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="bg-white/5 backdrop-blur-lg border-0 shadow-xl hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <MessageSquare className="h-8 w-8 text-purple-300 mb-2" />
                  <CardTitle className="text-white/90">One Simple Link</CardTitle>
                  <CardDescription className="text-gray-400">
                    Share your unique feedback page
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="bg-white/5 backdrop-blur-lg border-0 shadow-xl hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <Heart className="h-8 w-8 text-pink-300 mb-2" />
                  <CardTitle className="text-white/90">Honest Insights</CardTitle>
                  <CardDescription className="text-gray-400">
                    Get genuine, unfiltered feedback
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Messages Carousel Section */}
      <motion.section 
        className="py-20 px-4 md:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-center text-white/90 mb-12"
            variants={fadeInUp}
          >
            Recent Feedback
          </motion.h2>
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <Card className="mx-2 bg-white/5 backdrop-blur-lg border-0 shadow-xl hover:bg-white/10 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-white/90 text-lg">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start space-x-4">
                        <Mail className="h-5 w-5 text-purple-300 mt-1" />
                        <div>
                          <p className="text-gray-300">{message.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {message.received}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-white/70 hover:text-white bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300" />
            <CarouselNext className="text-white/70 hover:text-white bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300" />
          </Carousel>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="text-center p-6 text-gray-400 border-t border-white/5">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          © {new Date().getFullYear()} Quietly. All rights reserved.
        </motion.p>
      </footer>
    </div>
  );
} 