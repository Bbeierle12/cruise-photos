import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Gallery() {
  const { user, profile, signOut } = useAuth()
  const [photos, setPhotos] = useState([])
  const [files, setFiles] = useState([])
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [loadingPhotos, setLoadingPhotos] = useState(true)

  // Fetch photos on mount
  useEffect(() => {
    fetchPhotos()
    
    // Subscribe to new photos
    const subscription = supabase
      .channel('photos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'photos' }, (payload) => {
        fetchPhotos() // Refetch to get complete data with profile
      })
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  async function fetchPhotos() {
    const { data, error } = await supabase
      .from('photos')
      .select(`
        *,
        profiles:user_id (
          display_name,
          avatar_color
        )
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setPhotos(data)
    }
    setLoadingPhotos(false)
  }

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7)
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    }
  })

  function removeFile(id) {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  async function handleUpload() {
    if (files.length === 0) return

    setUploading(true)

    try {
      for (const fileObj of files) {
        // Upload to storage
        const fileName = `${user.id}/${Date.now()}-${fileObj.file.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('photos')
          .upload(fileName, fileObj.file)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(fileName)

        // Insert into database
        const { error: dbError } = await supabase
          .from('photos')
          .insert({
            user_id: user.id,
            image_url: publicUrl,
            caption: caption.trim() || null
          })

        if (dbError) throw dbError
      }

      // Clear form
      setFiles([])
      setCaption('')
      fetchPhotos()
    } catch (err) {
      console.error('Upload error:', err)
      alert('Failed to upload. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="gallery-page">
      <header className="gallery-header">
        <div className="gallery-title">
          <span>🚢</span>
          <h1>Voyage Photos</h1>
        </div>
        <div className="header-actions">
          <div className="user-badge">
            <div 
              className="user-avatar" 
              style={{ backgroundColor: profile?.avatar_color || '#4299e1' }}
            >
              {profile?.display_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <span className="user-name">{profile?.display_name || 'Sailor'}</span>
          </div>
          <button className="btn btn-logout" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      {/* Upload Section */}
      <section className="upload-section">
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <span className="dropzone-icon">📸</span>
          <h3>Drop photos here</h3>
          <p>or click to browse your device</p>
        </div>

        {files.length > 0 && (
          <div className={uploading ? 'uploading' : ''}>
            <div className="upload-preview">
              {files.map((fileObj) => (
                <div key={fileObj.id} className="preview-item">
                  <img src={fileObj.preview} alt="Preview" />
                  <button 
                    className="preview-remove" 
                    onClick={() => removeFile(fileObj.id)}
                    disabled={uploading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="upload-actions">
              <input
                type="text"
                className="upload-caption"
                placeholder="Add a caption... (optional)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={uploading}
              />
              <button 
                className="btn btn-primary btn-upload"
                onClick={handleUpload}
                disabled={uploading}
              >
                <Send size={18} />
                {uploading ? 'Sending...' : 'Share'}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Photo Grid */}
      {loadingPhotos ? (
        <div className="loading-screen" style={{ minHeight: '300px' }}>
          <div className="loading-wave">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Loading photos...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🌊</span>
          <h2>No photos yet</h2>
          <p>Be the first to share a moment from the voyage!</p>
        </div>
      ) : (
        <div className="photo-grid">
          {photos.map((photo, index) => (
            <article 
              key={photo.id} 
              className="photo-card"
              style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="photo-image-container">
                <img 
                  src={photo.image_url} 
                  alt={photo.caption || 'Cruise photo'} 
                  className="photo-image"
                  loading="lazy"
                />
              </div>
              <div className="photo-info">
                <div className="photo-meta">
                  <div 
                    className="photo-avatar"
                    style={{ backgroundColor: photo.profiles?.avatar_color || '#4299e1' }}
                  >
                    {photo.profiles?.display_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <span className="photo-author">
                    {photo.profiles?.display_name || 'Unknown'}
                  </span>
                  <span className="photo-date">{formatDate(photo.created_at)}</span>
                </div>
                {photo.caption && (
                  <p className="photo-caption">{photo.caption}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="photo-modal-overlay" 
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedPhoto.image_url} 
              alt={selectedPhoto.caption || 'Cruise photo'} 
            />
            <button className="modal-close" onClick={() => setSelectedPhoto(null)}>
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
