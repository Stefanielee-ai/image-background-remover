import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.REMOVE_BG_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const imageFile = formData.get('image_file')
  if (!imageFile) {
    return NextResponse.json({ error: 'Missing image_file' }, { status: 400 })
  }

  const rbForm = new FormData()
  rbForm.append('image_file', imageFile)
  rbForm.append('size', 'auto')

  let rbRes: Response
  try {
    rbRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey },
      body: rbForm,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to reach Remove.bg API' }, { status: 502 })
  }

  if (!rbRes.ok) {
    const text = await rbRes.text()
    let message = 'Background removal failed'
    try {
      const json = JSON.parse(text)
      message = json.errors?.[0]?.title || message
    } catch {}
    return NextResponse.json({ error: message }, { status: rbRes.status })
  }

  const buffer = await rbRes.arrayBuffer()
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store',
    },
  })
}
