import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminLayout from '../../components/AdminLayout'

const allStatesAndUTs = [
  'Andaman & Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chandigarh','Chhattisgarh',
  'Dadra & Nagar Haveli and Daman & Diu','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu & Kashmir',
  'Jharkhand','Karnataka','Kerala','Ladakh','Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya',
  'Mizoram','Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal'
]

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export default function StateWorks() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [clients, setClients] = useState([])
  const [formData, setFormData] = useState({
    state: '',
    slug: '',
    title: '',
    description: '',
    brand_client_id: '',
    activitiesText: '',
    images: [],
  })

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [stateRes, clientsRes] = await Promise.all([
        supabase.from('state_works').select('*').order('created_at', { ascending: false }),
        supabase.from('clients').select('id, name').order('name'),
      ])
      setItems(stateRes.data || [])
      setClients(clientsRes.data || [])
    } catch (e) {
      console.error('Error fetching state works:', e)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEditing(null)
    setFormData({
      state: '',
      slug: '',
      title: '',
      description: '',
      brand_client_id: '',
      activitiesText: '',
      images: [],
    })
  }

  const openCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'state' && !editing) {
      setFormData((prev) => ({ ...prev, slug: slugify(value) }))
    }
  }

  const onImages = (e) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({ ...prev, images: files }))
  }

  const handleEdit = (item) => {
    setEditing(item)
    setFormData({
      state: item.state || '',
      slug: item.slug || '',
      title: item.title || '',
      description: item.description || '',
      brand_client_id: item.brand_client_id || '',
      activitiesText: Array.isArray(item.activities) ? item.activities.join('\n') : '',
      images: [],
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this state work?')) return
    try {
      const { error } = await supabase.from('state_works').delete().eq('id', id)
      if (error) throw error
      fetchAll()
    } catch (e) {
      console.error('Error deleting state work:', e)
      alert('Error deleting state work: ' + e.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const activities = formData.activitiesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)

      let uploadedImageUrls = editing?.images || []

      if (formData.images.length > 0) {
        const uploads = []
        for (const file of formData.images) {
          const ext = file.name.split('.').pop()
          const filename = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`
          const path = `state-works/${formData.slug}/${filename}`
          uploads.push(
            supabase.storage.from('events-images').upload(path, file).then(({ error }) => {
              if (error) throw error
              const { data: urlData } = supabase.storage.from('events-images').getPublicUrl(path)
              return urlData.publicUrl
            })
          )
        }
        const results = await Promise.all(uploads)
        uploadedImageUrls = results
      }

      const payload = {
        state: formData.state,
        slug: formData.slug || slugify(formData.state),
        title: formData.title,
        description: formData.description,
        brand_client_id: formData.brand_client_id || null,
        activities,
        images: uploadedImageUrls,
      }

      if (editing) {
        const { error } = await supabase.from('state_works').update(payload).eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('state_works').insert([payload])
        if (error) throw error
      }

      setShowModal(false)
      resetForm()
      fetchAll()
    } catch (e) {
      console.error('Error saving state work:', e)
      alert('Error saving state work: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">State Works</h1>
          <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Add State Work
          </button>
        </div>

        {loading && items.length === 0 ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">State</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Images</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 text-white">{item.state}</td>
                    <td className="px-6 py-4 text-gray-300">{item.title || '-'}</td>
                    <td className="px-6 py-4 text-gray-300">{item.slug}</td>
                    <td className="px-6 py-4">
                      {Array.isArray(item.images) && item.images.length > 0 ? (
                        <div className="flex -space-x-2">
                          {item.images.slice(0, 3).map((img, idx) => (
                            <img key={idx} src={img} alt="" className="w-10 h-10 object-cover rounded border border-gray-600" />
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No images</span>
                      )}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
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
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-3 md:p-4 z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-800">
                <h2 className="text-xl font-semibold text-white">{editing ? 'Edit State Work' : 'Add State Work'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-72px)]">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">State / UT</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm md:text-base"
                    required
                  >
                    <option value="">Select state</option>
                    {allStatesAndUTs.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                    <input
                      name="slug"
                      value={formData.slug}
                      onChange={onChange}
                      placeholder="auto-generated-from-state"
                      className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm md:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Brand (Client)</label>
                    <select
                      name="brand_client_id"
                      value={formData.brand_client_id}
                      onChange={onChange}
                      className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm md:text-base"
                    >
                      <option value="">None</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm md:text-base"
                    placeholder="e.g., On-ground activations in Gujarat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm md:text-base"
                    placeholder="Summary of activities and achievements in this state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Activities (one per line)</label>
                  <textarea
                    name="activitiesText"
                    value={formData.activitiesText}
                    onChange={onChange}
                    rows={6}
                    className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm md:text-base"
                    placeholder="e.g., School activation programs&#10;Retail demos and trials"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={onImages}
                    className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm md:text-base"
                  />
                  <p className="text-xs text-gray-400 mt-1">Images upload to the events-images bucket under state-works/</p>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    {editing ? 'Update' : 'Create'}
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

