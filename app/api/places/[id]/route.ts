import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

type Context = { params: Promise<{ id: string }> }

export async function GET(
  _request: NextRequest,
  context: Context
) {
  const { id } = await context.params

  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(
  request: NextRequest,
  context: Context
) {
  const { id } = await context.params
  const body = await request.json()

  const { data, error } = await supabase
    .from('places')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _request: NextRequest,
  context: Context
) {
  const { id } = await context.params

  const { error } = await supabase
    .from('places')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
