import { useState, useEffect } from 'react'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // State untuk Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    item_id: '',
    item_name: '',
    price: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch Data Barang
  const fetchItems = () => {
    setLoading(true)
    fetch('http://localhost:8080/api/items')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data.')
        return res.json()
      })
      .then((data) => {
        setItems(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching data:', err)
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchItems()
  }, [])

  // Handle Input Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle Submit Form Tambah Barang
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.item_id || !formData.item_name || !formData.price) {
      alert('Semua field wajib diisi!')
      return
    }

    setIsSubmitting(true)

    fetch('http://localhost:8080/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        item_id: formData.item_id.toUpperCase(),
        item_name: formData.item_name,
        price: parseFloat(formData.price) || 0
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Gagal menambah barang.')
        return res.json()
      })
      .then((newItem) => {
        // Tambah item baru langsung ke state tanpa reload
        setItems((prev) => [...prev, newItem])
        // Reset form & tutup modal
        setFormData({ item_id: '', item_name: '', price: '' })
        setIsModalOpen(false)
      })
      .catch((err) => {
        alert(err.message)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  // Filter Search
  const filteredItems = items.filter((item) => {
    const itemId = (item.item_id || item.id || '').toString().toLowerCase()
    const itemName = (item.item_name || item.name || '').toString().toLowerCase()
    const search = searchTerm.toLowerCase()

    return itemId.includes(search) || itemName.includes(search)
  })

  // Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number)
  }

  // --- STYLES ---
  const styles = {
    container: {
      padding: '40px',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      color: '#1f2937'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '30px',
      borderBottom: '2px solid #e5e7eb',
      paddingBottom: '15px'
    },
    title: {
      margin: 0,
      fontSize: '28px',
      fontWeight: '700',
      color: '#111827',
      whiteSpace: 'nowrap'
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      whiteSpace: 'nowrap'
    },
    searchInput: {
      flex: 1,
      padding: '10px 15px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: 'white',
      boxShadow: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      outline: 'none'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px'
    },
    tableHeader: {
      backgroundColor: '#f3f4f6',
      textAlign: 'left',
      color: '#4b5563',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    th: {
      padding: '15px 20px',
      borderBottom: '1px solid #e5e7eb'
    },
    tr: {
      borderBottom: '1px solid #e5e7eb'
    },
    td: {
      padding: '15px 20px',
      color: '#374151'
    },
    tdAction: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      alignItems: 'center'
    },
    actionButton: {
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      backgroundColor: 'white',
      padding: '4px 8px',
      cursor: 'pointer'
    },
    statusMessage: {
      textAlign: 'center',
      padding: '40px',
      color: '#6b7280',
      fontSize: '16px'
    },
    // --- STYLES MODAL ---
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      width: '100%',
      maxWidth: '450px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    modalTitle: {
      marginTop: 0,
      marginBottom: '20px',
      fontSize: '20px',
      fontWeight: '700',
      color: '#111827'
    },
    formGroup: {
      marginBottom: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151'
    },
    label_modal_add_item: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      gap: '20px',
    },
    formInput: {
      padding: '10px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none'
    },
    modalActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '25px'
    },
    cancelButton: {
      padding: '10px 16px',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    submitButton: {
      padding: '10px 16px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600'
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Item Master Data</h1>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button
          style={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Add Item
        </button>
      </header>

      {/* Tabel Data */}
      {loading ? (
        <div style={styles.statusMessage}>Loading data barang...</div>
      ) : error ? (
        <div style={{ ...styles.statusMessage, color: '#ef4444' }}>Error: {error}</div>
      ) : (
        <div style={styles.tableContainer}>
          {filteredItems.length > 0 ? (
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={{ ...styles.th, width: '20%', textAlign: 'center' }}>ITEM ID</th>
                  <th style={{ ...styles.th, width: '45%', textAlign: 'center'}}>ITEM NAME</th>
                  <th style={{ ...styles.th, width: '20%', textAlign: 'center' }}>PRICE</th>
                  <th style={{ ...styles.th, width: '15%', textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.item_id || item.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: '500' }}>{item.item_id || item.id}</td>
                    <td style={styles.td}>{item.item_name || item.name}</td>
                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: '#059669' }}>
                      {formatRupiah(item.price)}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <div style={styles.tdAction}>
                        <button style={styles.actionButton} title="Edit">✏️</button>
                        <button style={styles.actionButton} title="Hapus">🗑️</button>
                        <button style={styles.actionButton} title="Add">Add</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.statusMessage}>Tidak ada barang yang ditemukan.</div>
          )}
        </div>
      )}

      {/* --- MODAL POPUP TAMBAH BARANG --- */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Add New Item</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label_modal_add_item}>Item ID</label>
                <input
                  type="text"
                  name="item_id"
                  placeholder="ID"
                  value={formData.item_id}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Item Name</label>
                <input
                  type="text"
                  name="item_name"
                  placeholder="Name"
                  value={formData.item_name}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Price (Rp)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  required
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App