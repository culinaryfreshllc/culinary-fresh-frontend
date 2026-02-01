"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function ContactPage() {
  const contactInfoRef = useRef<HTMLDivElement>(null)
  const formSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contactInfoRef.current) {
        gsap.from(contactInfoRef.current, {
          scrollTrigger: {
            trigger: contactInfoRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          x: -30,
          duration: 0.8,
        })
      }

      if (formSectionRef.current) {
        gsap.from(formSectionRef.current, {
          scrollTrigger: {
            trigger: formSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          x: 30,
          duration: 0.8,
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Contact Us
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {/* Contact Information */}
              <div className="space-y-6" ref={contactInfoRef}>
                {/* Address */}
                <div className="bg-card border border-border rounded-xl p-6 hover:border-secondary/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        123 Fresh Market Ave
                        <br />
                        San Francisco, CA 94103
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-card border border-border rounded-xl p-6 hover:border-secondary/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">Phone</h3>
                      <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors">
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-card border border-border rounded-xl p-6 hover:border-secondary/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">Email</h3>
                      <a
                        href="mailto:hello@culinaryfresh.com"
                        className="text-muted-foreground hover:text-primary transition-colors break-all"
                      >
                        hello@culinaryfresh.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="bg-card border border-border rounded-xl p-6 hover:border-secondary/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">Business Hours</h3>
                      <div className="space-y-1 text-muted-foreground">
                        <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                        <p>Sat: 10:00 AM - 4:00 PM</p>
                        <p>Sun: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2" ref={formSectionRef}>
                <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Send us a Message</h2>
                  <ContactForm />
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-muted border border-border rounded-xl overflow-hidden h-96 md:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.2191776828123!2d-122.40202!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085812e329f79cd%3A0x5b282d49599abedb!2s123%20Fresh%20Market%20Ave%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}