import { supabase } from './supabaseClient'

const STAFF_ROLES = ['admin', 'editor']

export async function isStaff(userId) {
  if (!userId) return false
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error checking user role:', error)
    return false
  }
  return STAFF_ROLES.includes(data?.role)
}
