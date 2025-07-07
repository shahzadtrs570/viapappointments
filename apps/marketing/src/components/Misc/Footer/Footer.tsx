/* eslint-disable */
"use client"

import { Container } from "@package/ui/container"
import { Logo } from "@package/ui/logo"
import Image from "next/image"

import { useClientTranslation } from "@/lib/i18n/I18nProvider"

import { FooterMenu } from "./FooterMenu"

export function Footer() {
  const { t } = useClientTranslation("footer")

  return (
    <footer className="w-full">
      {/* Top Section - Blue Background */}
      <div className="bg-blue-700 py-12">
        <Container className="max-w-6xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            {/* Connect with Us */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="mb-6 text-lg font-semibold text-white">
                Connect with Us
              </h3>
              <div className="flex gap-4">
              <a
                aria-label="Facebook"
                  className="transition-transform hover:scale-110"
                href="https://www.facebook.com"
              >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
              </a>
              <a
                aria-label="Twitter"
                  className="transition-transform hover:scale-110"
                href="https://x.com"
              >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 hover:bg-sky-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                </a>
                <a
                  aria-label="Pinterest"
                  className="transition-transform hover:scale-110"
                  href="https://pinterest.com"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 hover:bg-red-700">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm0 19c-.721 0-1.418-.109-2.073-.312.286-.456.713-1.227.894-1.684.095-.241.495-1.889.495-1.889.259.494 1.016.925 1.823.925 2.399 0 4.03-2.188 4.03-5.116 0-2.212-1.87-4.267-4.708-4.267-3.535 0-5.318 2.54-5.318 4.659 0 1.279.685 2.877 1.778 3.388.178.083.273.046.315-.127.032-.132.165-.659.23-.86.088-.274.054-.37-.191-.609-.533-.52-.874-1.193-.874-2.147 0-2.766 2.07-5.239 5.39-5.239 2.94 0 4.561 1.798 4.561 4.208 0 3.16-1.4 5.829-3.472 5.829-.681 0-1.319-.355-1.537-.802 0 0-.336 1.281-.407 1.599-.147.562-.544 1.266-.811 1.696z"/>
                    </svg>
                  </div>
                </a>
                <a
                  aria-label="YouTube"
                  className="transition-transform hover:scale-110"
                  href="https://youtube.com"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 hover:bg-red-700">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                </a>
                <a
                  aria-label="Instagram"
                  className="transition-transform hover:scale-110"
                  href="https://instagram.com"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 hover:from-purple-700 hover:via-pink-600 hover:to-yellow-500">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
              </a>
              <a
                aria-label="LinkedIn"
                  className="transition-transform hover:scale-110"
                href="https://www.linkedin.com"
              >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 hover:bg-blue-800">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                </a>
              </div>
            </div>

            {/* Go Mobile */}
            <div className="flex flex-col items-center md:items-end">
              <h3 className="mb-6 text-lg font-semibold text-white">
                Go Mobile
              </h3>
              <div className="flex gap-4">
                <a
                  aria-label="Download on the App Store"
                  href="#"
                  className="transition-transform hover:scale-105"
                >
                  <div className="flex h-12 w-36 items-center justify-center rounded-lg bg-black text-white hover:bg-gray-800">
                    <div className="flex items-center gap-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-xs">Download on the</div>
                        <div className="text-sm font-semibold">App Store</div>
                      </div>
                    </div>
                  </div>
                </a>
                <a
                  aria-label="Get it on Google Play"
                  href="#"
                  className="transition-transform hover:scale-105"
                >
                  <div className="flex h-12 w-36 items-center justify-center rounded-lg bg-black text-white hover:bg-gray-800">
                    <div className="flex items-center gap-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-xs">Get it on</div>
                        <div className="text-sm font-semibold">Google Play</div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Section - Footer Navigation */}
      <div className="bg-gray-100 pt-12 pb-2 dark:bg-gray-900">
        <Container className="max-w-6xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
            <FooterMenu />
            
            {/* Right Side - Social Icons and BBB */}
            <div className="flex flex-col items-center gap-6 lg:items-end">
              {/* Social Icons */}
              <div className="flex gap-4">
                <a
                  aria-label="Facebook"
                  className="transition-transform hover:scale-110"
                  href="https://www.facebook.com"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                </a>
                <a
                  aria-label="Twitter"
                  className="transition-transform hover:scale-110"
                  href="https://x.com"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 hover:bg-sky-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                </a>
                <a
                  aria-label="Pinterest"
                  className="transition-transform hover:scale-110"
                  href="https://pinterest.com"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 hover:bg-red-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm0 19c-.721 0-1.418-.109-2.073-.312.286-.456.713-1.227.894-1.684.095-.241.495-1.889.495-1.889.259.494 1.016.925 1.823.925 2.399 0 4.03-2.188 4.03-5.116 0-2.212-1.87-4.267-4.708-4.267-3.535 0-5.318 2.54-5.318 4.659 0 1.279.685 2.877 1.778 3.388.178.083.273.046.315-.127.032-.132.165-.659.23-.86.088-.274.054-.37-.191-.609-.533-.52-.874-1.193-.874-2.147 0-2.766 2.07-5.239 5.39-5.239 2.94 0 4.561 1.798 4.561 4.208 0 3.16-1.4 5.829-3.472 5.829-.681 0-1.319-.355-1.537-.802 0 0-.336 1.281-.407 1.599-.147.562-.544 1.266-.811 1.696z"/>
                    </svg>
                  </div>
                </a>
                <a
                  aria-label="YouTube"
                  className="transition-transform hover:scale-110"
                  href="https://youtube.com"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 hover:bg-red-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                </a>
                <a
                  aria-label="Instagram"
                  className="transition-transform hover:scale-110"
                  href="https://instagram.com"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 hover:from-purple-700 hover:via-pink-600 hover:to-yellow-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </a>
                <a
                  aria-label="LinkedIn"
                  className="transition-transform hover:scale-110"
                  href="https://www.linkedin.com"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 hover:bg-blue-800">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                </a>
              </div>

              {/* BBB Accredited Business */}
              <div className="text-center">
                <div className="flex items-center justify-center rounded-lg bg-white p-4 shadow-lg">
                  <div className="text-center">
                    <div className="mb-1 text-xs font-bold text-blue-700">BBB</div>
                    <div className="mb-1 text-xs font-semibold text-gray-700">ACCREDITED</div>
                    <div className="mb-1 text-xs font-semibold text-gray-700">BUSINESS</div>
                    <div className="text-sm text-yellow-500">★★★★★</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Copyright Section */}
      <div className="bg-gray-100 py-2">
        <Container className="max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Additional Links */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="group relative inline-block w-fit text-gray-800 transition-colors duration-200 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 underline"
              >
                Advertise with Vipappointments
              </a>
          </div>

            {/* Copyright Text */}
            <div className="text-center md:text-right">
              <p className="group relative inline-block w-fit text-gray-800 transition-colors duration-200 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                © 2025 Vipappointments, Inc., All Rights Reserved.
              </p>
            </div>
          </div>
      </Container>
      </div>
    </footer>
  )
}
