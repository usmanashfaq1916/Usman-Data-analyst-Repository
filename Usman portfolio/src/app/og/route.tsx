import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const revalidate = 86400

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0B1120 0%, #151F36 100%)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 50,
            right: 50,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: '#2563EB',
            opacity: 0.04,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            left: 50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: '#10B981',
            opacity: 0.04,
          }}
        />
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#F1F5F9',
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Usman Ashfaq
        </h1>
        <p
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: '#2563EB',
            margin: '16px 0 0 0',
          }}
        >
          Data Analyst for Startups & Remote Teams
        </p>
        <p
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: '#94A3B8',
            margin: '8px 0 0 0',
          }}
        >
          SQL • ETL • Business Intelligence • Python • Power BI
        </p>
        <div
          style={{
            width: 120,
            height: 4,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #2563EB, #10B981)',
            marginTop: 24,
          }}
        />
        <p
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: '#94A3B8',
            margin: '24px 0 0 0',
          }}
        >
          Turning spreadsheet chaos into dashboards & reports
        </p>
        <p
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: '#64748B',
            margin: '40px 0 0 0',
          }}
        >
          usmanashfaq.vercel.app
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
