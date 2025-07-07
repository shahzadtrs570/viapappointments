/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
"use client"

import { useCallback, useEffect, useState } from "react"

import { Container } from "@package/ui/container"
import { Typography } from "@package/ui/typography"
import { cn } from "@package/utils"
import { motion } from "framer-motion"
import Image from "next/image"

import faqData from "./srenova-faq-json.json"

interface FAQSection {
  section: string
  questions: Array<{
    question: string
    answer: string
  }>
}

export default function FAQPage() {
  const [activeSection, setActiveSection] = useState("")
  const [sections, setSections] = useState<FAQSection[]>([])
  const [openQuestions, setOpenQuestions] = useState<{
    [key: string]: boolean
  }>({})

  const updateActiveSection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    },
    []
  )

  useEffect(() => {
    // Group FAQs by section
    const groupedFaqs = faqData.reduce(
      (acc: { [key: string]: FAQSection }, faq) => {
        if (!acc[faq.section]) {
          acc[faq.section] = {
            section: faq.section,
            questions: [],
          }
        }
        acc[faq.section].questions.push({
          question: faq.question,
          answer: faq.answer,
        })
        return acc
      },
      {}
    )

    setSections(Object.values(groupedFaqs))
    if (sections.length > 0) {
      setActiveSection(sections[0].section)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(updateActiveSection, {
      rootMargin: "-20% 0px -80% 0px",
      threshold: 0,
    })

    const sectionElements = document.querySelectorAll("[data-section]")
    sectionElements.forEach((element) => observer.observe(element))

    return () => {
      sectionElements.forEach((element) => observer.unobserve(element))
    }
  }, [updateActiveSection])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }

  const toggleQuestion = (sectionIndex: number, questionIndex: number) => {
    const key = `${sectionIndex}-${questionIndex}`
    setOpenQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(99deg,_#FBFCFF_0%,_#F1F6FF_100%)]">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Quick Navigation Menu */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <nav className="scrollbar-none max-h-[80vh] space-y-2 overflow-y-auto pr-2">
                {sections.map((section) => (
                  <button
                    key={section.section}
                    className={cn(
                      "w-full text-left px-6 py-4 text-sm font-medium rounded-2xl transition-colors",
                      activeSection === section.section
                        ? "bg-secondary text-foreground font-bold"
                        : "bg-white text-foreground hover:bg-secondary/10"
                    )}
                    onClick={() => scrollToSection(section.section)}
                  >
                    {section.section}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="mx-auto mb-16 max-w-xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                <span className="text-foreground">Frequently Asked </span>
                <span className="bg-[linear-gradient(90deg,_#CA8A04_43.31%,_#F5B329_94.88%)] bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>
              <p className="md:text-md text-sm text-foreground">
                Find answers to common questions about Srenova&apos;s viager
                programme and how it can help you unlock the value in your
                property
              </p>
            </div>
            {sections.map((section, sectionIndex) => (
              <div
                key={section.section}
                data-section
                className="mb-16 scroll-mt-24"
                id={section.section}
              >
                <Typography
                  className="mb-8 text-2xl font-bold text-foreground md:text-3xl"
                  variant="h2"
                >
                  {section.section}
                </Typography>
                <div className="space-y-4">
                  {section.questions.map((faq, questionIndex) => {
                    const key = `${sectionIndex}-${questionIndex}`
                    const isOpen = openQuestions[key]

                    return (
                      <motion.div
                        key={questionIndex}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl bg-white p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ delay: questionIndex * 0.1 }}
                      >
                        <details
                          className="group"
                          open={isOpen}
                          onClick={(e) => {
                            e.preventDefault()
                            toggleQuestion(sectionIndex, questionIndex)
                          }}
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between">
                            <Typography
                              className="text-md font-medium text-foreground"
                              variant="h3"
                            >
                              {faq.question}
                            </Typography>
                            <div className="relative ml-2 flex items-center justify-center">
                              <Image
                                alt=""
                                className="size-10"
                                height={40}
                                src="/images/ellipse-5.svg"
                                width={40}
                              />
                              <Image
                                alt=""
                                height={20}
                                src="/images/plus.svg"
                                width={20}
                                className={cn(
                                  "absolute size-5 transition-transform",
                                  isOpen && "rotate-45"
                                )}
                              />
                            </div>
                          </summary>
                          {isOpen && (
                            <div className="prose prose-sm mt-4 max-w-none text-foreground">
                              {faq.answer.split("* ").map((point, i) => {
                                if (i === 0 && !point.startsWith("*")) {
                                  return <p key={i}>{point}</p>
                                }
                                return (
                                  point.trim() && (
                                    <li key={i}>{point.trim()}</li>
                                  )
                                )
                              })}
                            </div>
                          )}
                        </details>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
