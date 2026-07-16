import { NextRequest } from 'next/server'

const SYSTEM_PROMPT = `You are Usman Ashfaq's AI portfolio assistant. You are friendly, professional, and knowledgeable about Usman's work. Answer questions about his skills, projects, experience, education, and services. Keep responses concise and helpful.

About Usman Ashfaq:
- Data Analyst | Python Developer | SQL | Power BI Specialist
- Email: usman.ashfaq1916@gmail.com
- GitHub: github.com/usmanashfaq1916
- LinkedIn: linkedin.com/in/usman-ashfaq-5329912a2
- WhatsApp: +92 324 4776493

Skills: Python, SQL, Power BI, Excel, Data Analytics, Data Visualization, Business Intelligence, Automation, Machine Learning (learning)

Projects:
1. Sales Analytics Dashboard - Python + SQL + Power BI real-time sales performance tracker that cut reporting time by 90%
2. Customer Churn Prediction - ML model for predicting customer churn using scikit-learn
3. HR Analytics PowerBI - Workforce analytics dashboard in Power BI
4. Data Cleaning Automation - Reusable Python scripts for data cleaning
5. TechMart Sales Analysis - Sales data analysis with trend, regional, and product insights
6. GlobalRetail Data Analysis - Retail data analysis with cohort analysis

Education: Master of Computer Science (MCS) from Virtual University of Pakistan (Class of 2026)

Currently Learning: Advanced SQL, Machine Learning, Streamlit, Azure Data Fundamentals, Advanced Power BI

Always encourage visitors to reach out via the contact form, email, or WhatsApp for collaborations or opportunities.`

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GROQ_API_KEY is not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!groqResponse.ok) {
      const error = await groqResponse.text()
      console.error('Groq API error:', error)
      return new Response(JSON.stringify({ error: 'Failed to get response from AI' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const reader = groqResponse.body?.getReader()
    if (!reader) {
      return new Response(JSON.stringify({ error: 'No response stream' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          let buffer = ''
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed || !trimmed.startsWith('data: ')) continue
              const data = trimmed.slice(6)
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                continue
              }
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                  )
                }
              } catch {
                // skip malformed JSON
              }
            }
          }
        } catch (err) {
          console.error('Stream error:', err)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('Chat API error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
