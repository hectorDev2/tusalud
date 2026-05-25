"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createBrowserSupabase } from "@/lib/supabase"
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js"

export interface ChatMessage {
  id: string
  consultation_id: string
  sender_id: string
  content: string
  created_at: string
}

export function useChat(consultationId: string, userId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const subRef = useRef<{ unsubscribe: () => void } | null>(null)

  useEffect(() => {
    const supabase = createBrowserSupabase()

    // Fetch existing messages
    supabase
      .from("chat_messages")
      .select("*")
      .eq("consultation_id", consultationId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data as ChatMessage[])
        setLoading(false)
      })

    // Subscribe to new messages via Realtime
    const channel = supabase
      .channel(`chat:${consultationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `consultation_id=eq.${consultationId}`,
        },
        (payload: RealtimePostgresChangesPayload<ChatMessage>) => {
          const newMsg = payload.new as ChatMessage
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        },
      )
      .subscribe()

    subRef.current = channel

    return () => {
      channel.unsubscribe()
    }
  }, [consultationId])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || sending) return

      setSending(true)

      const supabase = createBrowserSupabase()
      const { error } = await supabase.from("chat_messages").insert({
        consultation_id: consultationId,
        sender_id: userId,
        content: content.trim(),
      })

      setSending(false)

      if (error) {
        console.error("Error sending message:", error)
        return false
      }

      return true
    },
    [consultationId, userId, sending],
  )

  return { messages, loading, sending, sendMessage }
}
