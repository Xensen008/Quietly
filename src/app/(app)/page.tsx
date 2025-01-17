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
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 md:px-6 lg:px-8 overflow-hidden">
        <motion.div 
          className="max-w-7xl mx-auto w-full pt-24 md:pt-32 pb-12 md:pb-20"
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
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 md:mb-8 tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200">
                Receive Feedback Quietly
              </span>
            </motion.h1>
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4"
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
        className="py-12 md:py-20 px-4 md:px-6 lg:px-8"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <motion.div variants={fadeInUp} className="h-full">
              <Card className="bg-white/5 backdrop-blur-lg border-0 shadow-xl hover:bg-white/10 transition-all duration-300 h-full">
                <CardHeader className="space-y-1 md:space-y-2">
                  <Shield className="h-6 w-6 md:h-8 md:w-8 text-indigo-300 mb-1 md:mb-2" />
                  <CardTitle className="text-lg md:text-xl text-white/90">No Sign-up Required</CardTitle>
                  <CardDescription className="text-sm md:text-base text-gray-400">
                    Anyone can leave feedback anonymously
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp} className="h-full">
              <Card className="bg-white/5 backdrop-blur-lg border-0 shadow-xl hover:bg-white/10 transition-all duration-300 h-full">
                <CardHeader className="space-y-1 md:space-y-2">
                  <MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-purple-300 mb-1 md:mb-2" />
                  <CardTitle className="text-lg md:text-xl text-white/90">One Simple Link</CardTitle>
                  <CardDescription className="text-sm md:text-base text-gray-400">
                    Share your unique feedback page
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp} className="h-full sm:col-span-2 lg:col-span-1">
              <Card className="bg-white/5 backdrop-blur-lg border-0 shadow-xl hover:bg-white/10 transition-all duration-300 h-full">
                <CardHeader className="space-y-1 md:space-y-2">
                  <Heart className="h-6 w-6 md:h-8 md:w-8 text-pink-300 mb-1 md:mb-2" />
                  <CardTitle className="text-lg md:text-xl text-white/90">Honest Insights</CardTitle>
                  <CardDescription className="text-sm md:text-base text-gray-400">
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
        className="py-12 md:py-20 px-4 md:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-xl md:text-3xl font-bold text-center text-white/90 mb-8 md:mb-12"
            variants={fadeInUp}
          >
            Recent Feedback
          </motion.h2>
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
            opts={{
              loop: true,
              align: "start",
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {messages.map((message, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/2">
                  <Card className="mx-1 md:mx-2 bg-white/5 backdrop-blur-lg border-0 shadow-xl hover:bg-white/10 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-base md:text-lg text-white/90">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start space-x-4">
                        <Mail className="h-4 w-4 md:h-5 md:w-5 text-purple-300 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm md:text-base text-gray-300">{message.content}</p>
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
            <div className="hidden sm:block">
              <CarouselPrevious className="text-white/70 hover:text-white bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300" />
              <CarouselNext className="text-white/70 hover:text-white bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300" />
            </div>
          </Carousel>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 text-gray-400 border-t border-white/5">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm md:text-base"
        >
          © {new Date().getFullYear()} Quietly. All rights reserved.
        </motion.p>
      </footer>
    </div>
  );
} 