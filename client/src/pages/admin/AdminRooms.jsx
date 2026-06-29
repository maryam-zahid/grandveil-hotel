import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi'

const BLANK = { name:'', type:'Standard', description:'', price:'', capacity:2, size:'', floor:'', roomNumber:'', amenities:'', view:'City', bedType:'King', isAvailable:true, isFeatured:false, images:'' }

export default function AdminRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | room object
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}))

  const load = () => { setLoading(true); axios.get('/rooms').then(r => setRooms(r.data)).finally(() => setLoading(false)) }
  useEffect(load, [])

  const openAdd = () => { setForm(BLANK); setModal('add') }
  const openEdit = (room) => { setForm({...room, amenities: room.amenities?.join(', ') || '', images: room.images?.join(', ') || ''}); setModal(room) }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, price: Number(form.price), capacity: Number(form.capacity), size: Number(form.size), floor: Number(form.floor),
        amenities: form.amenities ? form.amenities.split(',').map(s => s.trim()).filter(Boolean) : [],
        images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [] }
      if (modal === 'add') { await axios.post('/rooms', payload); toast.success('Room created') }
      else { await axios.put(`/rooms/${modal._id}`, payload); toast.success('Room updated') }
      setModal(null); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return
    try { await axios.delete(`/rooms/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Could not delete') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><p className="eyebrow mb-1">Manage</p><h1 className="font-display text-3xl font-bold">Rooms</h1></div>
        <button onClick={openAdd} className="btn-gold text-xs py-2.5 px-5 flex items-center gap-2"><FiPlus size={14} /> Add Room</button>
      </div>

      {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="card-dark overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-stone-800/60">
              {['Room', 'Type', 'Price', 'Capacity', 'View', 'Status', 'Actions'].map(h => <th key={h} className="text-left py-4 px-4 text-xs text-stone-500 tracking-widest uppercase font-medium">{h}</th>)}
            </tr></thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room._id} className="table-row">
                  <td className="py-3 px-4"><p className="font-medium text-stone-200">{room.name}</p><p className="text-xs text-stone-600">#{room.roomNumber}</p></td>
                  <td className="py-3 px-4 text-stone-400">{room.type}</td>
                  <td className="py-3 px-4 text-gold-400 font-semibold">${room.price}</td>
                  <td className="py-3 px-4 text-stone-400">{room.capacity}</td>
                  <td className="py-3 px-4 text-stone-400">{room.view}</td>
                  <td className="py-3 px-4"><span className={`status-badge border text-xs ${room.isAvailable ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{room.isAvailable ? 'Available' : 'Unavailable'}</span></td>
                  <td className="py-3 px-4"><div className="flex gap-2">
                    <button onClick={() => openEdit(room)} className="p-1.5 text-stone-400 hover:text-gold-400 hover:bg-gold-500/10 transition-all"><FiEdit2 size={13} /></button>
                    <button onClick={() => handleDelete(room._id)} className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 size={13} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rooms.length && <p className="text-center text-stone-600 py-12 text-sm">No rooms yet. Add your first room.</p>}
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-stone-900 border border-stone-700/60 rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl font-bold">{modal === 'add' ? 'Add New Room' : 'Edit Room'}</h2>
              <button onClick={() => setModal(null)} className="text-stone-500 hover:text-stone-300"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
              {[['name','Room Name','text',true],['roomNumber','Room Number','text',true],['price','Price per Night','number',true],['capacity','Max Capacity','number',false],['size','Size (sq ft)','number',false],['floor','Floor','number',false]].map(([k,l,t,req]) => (
                <div key={k}><label className="label-gold">{l}{req?' *':''}</label><input type={t} required={req} className="input-dark" value={form[k]} onChange={set(k)} /></div>
              ))}
              {[['type','Type',['Standard','Deluxe','Suite','Presidential']],['view','View',['Ocean','City','Garden','Pool','Mountain']],['bedType','Bed Type',['Single','Double','Queen','King','Twin']]].map(([k,l,opts]) => (
                <div key={k}><label className="label-gold">{l}</label><select className="input-dark" value={form[k]} onChange={set(k)}>{opts.map(o=><option key={o}>{o}</option>)}</select></div>
              ))}
              <div className="sm:col-span-2"><label className="label-gold">Description *</label><textarea rows={3} required className="input-dark resize-none" value={form.description} onChange={set('description')} /></div>
              <div className="sm:col-span-2"><label className="label-gold">Amenities (comma-separated)</label><input className="input-dark" placeholder="WiFi, Pool, Spa, Minibar" value={form.amenities} onChange={set('amenities')} /></div>
              <div className="sm:col-span-2"><label className="label-gold">Image URLs (comma-separated)</label><input className="input-dark" placeholder="https://..." value={form.images} onChange={set('images')} /></div>
              <div className="flex items-center gap-3"><label className="flex items-center gap-2 cursor-pointer text-sm text-stone-400"><input type="checkbox" className="accent-gold-500" checked={form.isAvailable} onChange={e=>setForm(f=>({...f,isAvailable:e.target.checked}))} />Available</label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-400"><input type="checkbox" className="accent-gold-500" checked={form.isFeatured} onChange={e=>setForm(f=>({...f,isFeatured:e.target.checked}))} />Featured</label></div>
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold flex-1 py-3 text-xs flex items-center justify-center gap-2"><FiCheck size={13} />{saving?'Saving...':modal==='add'?'Create Room':'Save Changes'}</button>
                <button type="button" onClick={()=>setModal(null)} className="btn-outline flex-1 py-3 text-xs">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
