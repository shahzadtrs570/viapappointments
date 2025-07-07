export interface Lead {
  id: string
  name: string | null
  email: string
  phone?: string | null
  company?: string | null
  leadType: string
  status: string
  source?: string | null
  createdAt: string | Date
}
