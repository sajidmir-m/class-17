import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminLayout from '../../components/AdminLayout'

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
  })

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setNews(data || [])
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = editingNews?.image_url || ''

      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `news/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('news-images')
          .upload(filePath, formData.image)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('news-images')
          .getPublicUrl(filePath)

        imageUrl = urlData.publicUrl
      }

      const newsData = {
        title: formData.title,
        content: formData.content,
        image_url: imageUrl,
      }

      if (editingNews) {
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', editingNews.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('news').insert([newsData])
        if (error) throw error
      }

      setShowModal(false)
      setEditingNews(null)
      setFormData({ title: '', content: '', image: null })
      fetchNews()
    } catch (error) {
      console.error('Error saving news:', error)
      alert('Error saving news: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem)
    setFormData({
      title: newsItem.title || '',
      content: newsItem.content || '',
      image: null,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this news article?')) return

    try {
      const { error } = await supabase.from('news').delete().eq('id', id)
      if (error) throw error
      fetchNews()
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('Error deleting news: ' + error.message)
    }
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">News</h1>
          <button
            onClick={() => {
              setEditingNews(null)
              setFormData({ title: '', content: '', image: null })
              setShowModal(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Add News
          </button>
        </div>

        {loading && news.length === 0 ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((newsItem) => (
              <div key={newsItem.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                {newsItem.image_url && (
                  <img src={newsItem.image_url} alt={newsItem.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{newsItem.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{newsItem.content}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(newsItem)}
                      className="flex-1 text-blue-400 hover:text-blue-300 px-4 py-2 border border-blue-400 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(newsItem.id)}
                      className="flex-1 text-red-400 hover:text-red-300 px-4 py-2 border border-red-400 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingNews ? 'Edit News' : 'Add News'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows="8"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingNews(null)
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    {editingNews ? 'Update' : 'Create'}
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

