import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { address } = await request.json()

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }

  const params = new URLSearchParams({
    q: `${address}, Paris, France`,
    format: 'json',
    limit: '1',
    countrycodes: 'fr',
    addressdetails: '1',
  })

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          'User-Agent': 'RestoMap/1.0 (personal app, contact: none)',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Nominatim request failed')
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    const result = data[0]

    return NextResponse.json({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      display_name: result.display_name,
    })
  } catch {
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 })
  }
}
