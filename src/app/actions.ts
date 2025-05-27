'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function uploadExpense(formData: FormData) {
  const amount = formData.get('amount') as string
  const category = formData.get('category') as string
  const note = formData.get('note') as string

  const supabase = createServerActionClient({ cookies })

  const { error } = await supabase.from('expenses').insert({
    amount: parseFloat(amount),
    category,
    note,
  })

  if (error) {
    console.error('Upload error:', error)
    throw new Error('Failed to upload expense.')
  }
}
