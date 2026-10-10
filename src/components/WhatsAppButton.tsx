'use client'

import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  const phoneNumber = '919876543210'
  const defaultMessage = encodeURIComponent(
    'Hi Gaurav Nursery! I am browsing plants on your website and would like some expert care advice / order assistance.'
  )
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`

  return (
    <aside aria-label="Customer Support Assistance">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 group border-2 border-white/30"
        title="Chat with Plant Expert on WhatsApp"
        aria-label="Chat with Plant Expert on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white text-transparent group-hover:rotate-12 transition-transform duration-200" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline">
          Plant Expert Help
        </span>
      </a>
    </aside>
  )
}
