import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminLayout from '../../components/AdminLayout'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    website_url: '',
    logo: null,
  })

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let logoUrl = editingClient?.logo_url || ''

      if (formData.logo) {
        const fileExt = formData.logo.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `logos/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('client-logos')
          .upload(filePath, formData.logo)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('client-logos')
          .getPublicUrl(filePath)

        logoUrl = urlData.publicUrl
      }

      const clientData = {
        name: formData.name,
        website_url: formData.website_url,
        logo_url: logoUrl,
      }

      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', editingClient.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('clients').insert([clientData])
        if (error) throw error
      }

      setShowModal(false)
      setEditingClient(null)
      setFormData({ name: '', website_url: '', logo: null })
      fetchClients()
    } catch (error) {
      console.error('Error saving client:', error)
      alert('Error saving client: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    setFormData({
      name: client.name || '',
      website_url: client.website_url || '',
      logo: null,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this client?')) return

    try {
      const { error } = await supabase.from('clients').delete().eq('id', id)
      if (error) throw error
      fetchClients()
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Error deleting client: ' + error.message)
    }
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Clients</h1>
          <button
            onClick={() => {
              setEditingClient(null)
              setFormData({ name: '', website_url: '', logo: null })
              setShowModal(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Add Client
          </button>
        </div>

        {loading && clients.length === 0 ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Logo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Website</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4">
                      {client.logo_url ? (
                        <img src={client.logo_url} alt={client.name} className="w-16 h-16 object-contain rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center text-gray-400">No Logo</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white">{client.name}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {client.website_url ? (
                        <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          {client.website_url}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(client)}
                        className="text-blue-400 hover:text-blue-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
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

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingClient ? 'Edit Client' : 'Add Client'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
                  <input
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, logo: e.target.files[0] })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingClient(null)
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    {editingClient ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

