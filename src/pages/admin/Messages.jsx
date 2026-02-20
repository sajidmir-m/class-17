import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminLayout from '../../components/AdminLayout'

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const { error } = await supabase.from('messages').delete().eq('id', id)
      if (error) throw error
      fetchMessages()
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Error deleting message: ' + error.message)
    }
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-white mb-8">Messages</h1>

        {loading && messages.length === 0 ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {messages.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 text-white">{message.name}</td>
                    <td className="px-6 py-4 text-gray-300">{message.email}</td>
                    <td className="px-6 py-4 text-gray-300">{message.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-300 max-w-xs truncate">{message.message}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(message.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

