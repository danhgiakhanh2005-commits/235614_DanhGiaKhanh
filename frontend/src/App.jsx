import { useEffect, useState, useCallback } from 'react';
import './App.css';

const API =
  (window.APP_CONFIG && window.APP_CONFIG.API_URL) ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';

const STATUSES = ['Đang sử dụng', 'Hư hỏng', 'Đang sửa chữa', 'Ngừng sử dụng'];
const STATUS_CLASS = {
  'Đang sử dụng': 'ok',
  'Hư hỏng': 'bad',
  'Đang sửa chữa': 'fix',
  'Ngừng sử dụng': 'off',
};
const EMPTY = {
  deviceId: '',
  name: '',
  deviceType: '',
  room: '',
  brand: '',
  model: '',
  quantity: 1,
  status: 'Đang sử dụng',
  purchaseDate: '',
  description: '',
};

async function request(path, options) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = [data.message, ...(data.errors || [])].filter(Boolean).join(' - ');
    throw new Error(msg || 'Có lỗi xảy ra');
  }
  return data;
}

export default function App() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(async (keyword = '') => {
    setLoading(true);
    setError('');
    try {
      const path = `/api/devices${keyword ? `?search=${encodeURIComponent(keyword)}` : ''}`;
      setDevices(await request(path));
    } catch (e) {
      setError(e.message === 'Failed to fetch' ? 'Không kết nối được tới máy chủ' : e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3000);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY });
    setError('');
  };

  const openEdit = (d) => {
    setEditingId(d._id);
    setForm({ ...d, purchaseDate: d.purchaseDate ? d.purchaseDate.slice(0, 10) : '' });
    setDetail(null);
    setError('');
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const body = JSON.stringify({
        ...form,
        quantity: Number(form.quantity),
        purchaseDate: form.purchaseDate || undefined,
      });
      if (editingId) {
        await request(`/api/devices/${editingId}`, { method: 'PUT', body });
      } else {
        await request('/api/devices', { method: 'POST', body });
      }
      setForm(null);
      flash(editingId ? 'Cập nhật thiết bị thành công' : 'Thêm thiết bị thành công');
      load(search);
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (d) => {
    if (!window.confirm(`Xóa thiết bị "${d.name}"?`)) return;
    try {
      await request(`/api/devices/${d._id}`, { method: 'DELETE' });
      flash('Đã xóa thiết bị');
      setDetail(null);
      load(search);
    } catch (e) {
      setError(e.message);
    }
  };

  const showDetail = async (d) => {
    try {
      setDetail(await request(`/api/devices/${d._id}`));
    } catch (e) {
      setError(e.message);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="container">
      <h1>Quản lý thiết bị phòng học</h1>

      <div className="toolbar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(search);
          }}
        >
          <input
            placeholder="Tìm theo mã, tên, loại, phòng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Tìm kiếm</button>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              load('');
            }}
          >
            Xóa lọc
          </button>
        </form>
        <button className="primary" onClick={openAdd}>
          + Thêm thiết bị
        </button>
      </div>

      {notice && <div className="msg success">{notice}</div>}
      {error && !form && <div className="msg error">{error}</div>}
      {loading && <p>Đang tải dữ liệu...</p>}

      {!loading && (
        <table>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên thiết bị</th>
              <th>Loại</th>
              <th>Phòng</th>
              <th>SL</th>
              <th>Tình trạng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  Không có thiết bị nào
                </td>
              </tr>
            )}
            {devices.map((d) => (
              <tr key={d._id}>
                <td>{d.deviceId}</td>
                <td>{d.name}</td>
                <td>{d.deviceType}</td>
                <td>{d.room}</td>
                <td>{d.quantity}</td>
                <td>
                  <span className={`badge ${STATUS_CLASS[d.status]}`}>{d.status}</span>
                </td>
                <td>
                  <button onClick={() => showDetail(d)}>Chi tiết</button>
                  <button onClick={() => openEdit(d)}>Sửa</button>
                  <button className="danger" onClick={() => remove(d)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {detail && (
        <div className="modal" onClick={() => setDetail(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Chi tiết thiết bị</h2>
            <p><b>Mã:</b> {detail.deviceId}</p>
            <p><b>Tên:</b> {detail.name}</p>
            <p><b>Loại:</b> {detail.deviceType}</p>
            <p><b>Phòng:</b> {detail.room}</p>
            <p><b>Hãng:</b> {detail.brand}</p>
            <p><b>Model:</b> {detail.model}</p>
            <p><b>Số lượng:</b> {detail.quantity}</p>
            <p>
              <b>Tình trạng:</b>{' '}
              <span className={`badge ${STATUS_CLASS[detail.status]}`}>{detail.status}</span>
            </p>
            <p>
              <b>Ngày mua:</b>{' '}
              {detail.purchaseDate
                ? new Date(detail.purchaseDate).toLocaleDateString('vi-VN')
                : '—'}
            </p>
            <p><b>Mô tả:</b> {detail.description}</p>
            <button onClick={() => setDetail(null)}>Đóng</button>
          </div>
        </div>
      )}

      {form && (
        <div className="modal">
          <form className="modal-box" onSubmit={save}>
            <h2>{editingId ? 'Cập nhật thiết bị' : 'Thêm thiết bị'}</h2>
            {error && <div className="msg error">{error}</div>}
            <label>
              Mã thiết bị *
              <input value={form.deviceId} onChange={set('deviceId')} required />
            </label>
            <label>
              Tên thiết bị *
              <input value={form.name} onChange={set('name')} required />
            </label>
            <label>
              Loại thiết bị *
              <input value={form.deviceType} onChange={set('deviceType')} required />
            </label>
            <label>
              Phòng học *
              <input value={form.room} onChange={set('room')} required />
            </label>
            <label>
              Hãng
              <input value={form.brand} onChange={set('brand')} />
            </label>
            <label>
              Model
              <input value={form.model} onChange={set('model')} />
            </label>
            <label>
              Số lượng *
              <input type="number" min="0" value={form.quantity} onChange={set('quantity')} required />
            </label>
            <label>
              Tình trạng
              <select value={form.status} onChange={set('status')}>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label>
              Ngày mua
              <input type="date" value={form.purchaseDate} onChange={set('purchaseDate')} />
            </label>
            <label>
              Mô tả
              <textarea value={form.description} onChange={set('description')} />
            </label>
            <div>
              <button className="primary" type="submit">Lưu</button>
              <button type="button" onClick={() => setForm(null)}>Hủy</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}