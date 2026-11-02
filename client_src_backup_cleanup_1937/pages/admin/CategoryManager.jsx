import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://app-nodejs-8v5ir.apps.teh11.abrhapaas.com:31272';

export default function CategoryManager() {
  const [tree, setTree] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderGroup, setNewFolderGroup] = useState('home_property');
  const [newChildName, setNewChildName] = useState({});

  const fetchTree = async () => {
    const res = await axios.get(`${API_URL}/api/categories`);
    setTree(res.data.data);
  };

  useEffect(() => { fetchTree(); }, []);

  const addFolder = async () => {
    if (!newFolderName) return;
    const slug = newFolderName.replace(/\s+/g, '-').toLowerCase();
    await axios.post(`${API_URL}/api/categories`, { name: newFolderName, slug, group: newFolderGroup, icon: '📁' });
    setNewFolderName('');
    fetchTree();
  };

  const addChild = async (parentId, parentGroup) => {
    const name = newChildName[parentId];
    if (!name) return;
    const slug = name.replace(/\s+/g, '-').toLowerCase();
    await axios.post(`${API_URL}/api/categories`, { name, slug, group: parentGroup, parentId, icon: '🔧' });
    setNewChildName({ ...newChildName, [parentId]: '' });
    fetchTree();
  };

  const deleteCategory = async (id) => {
    if (window.confirm('آیا مطمئن هستید؟ زیرمجموعه‌ها هم حذف می‌شوند.')) {
      await axios.delete(`${API_URL}/api/categories/${id}`);
      fetchTree();
    }
  };

  return (
    <div className="p-6 bg-stone-50 min-h-screen" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-stone-800">مدیریت خدمات و دسته‌بندی‌ها</h1>
      
      {/* افزودن پوشه جدید */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex gap-4 items-end flex-wrap border border-stone-200">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold text-stone-700 mb-1">نام خدمت جدید (پوشه اصلی)</label>
          <input type="text" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="مثلاً: خدمات ساختمانی" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold text-stone-700 mb-1">گروه</label>
          <select value={newFolderGroup} onChange={e => setNewFolderGroup(e.target.value)} className="w-full border rounded-lg px-3 py-2">
            <option value="home_property">خانه و املاک</option>
            <option value="automotive_transport">خودرو</option>
            <option value="beauty_wellness">زیبایی</option>
            <option value="health_medical">پزشکی</option>
            <option value="education_coaching">آموزش</option>
            <option value="business_professional">اداری</option>
            <option value="technology_digital">کامپیوتر</option>
          </select>
        </div>
        <button onClick={addFolder} className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700">افزودن پوشه</button>
      </div>

      {/* نمایش درخت */}
      <div className="space-y-4">
        {tree.map(root => (
          <div key={root._id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 bg-stone-50 border-b">
              <div className="flex items-center gap-2">
                <span className="text-xl">{root.icon}</span>
                <h2 className="font-bold text-lg">{root.name}</h2>
                <span className="text-xs bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full">{root.children.length} زیرمجموعه</span>
              </div>
              <button onClick={() => deleteCategory(root._id)} className="text-red-500 text-sm hover:underline">حذف پوشه</button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {root.children.map(child => (
                  <div key={child._id} className="flex items-center justify-between bg-stone-50 p-2 rounded border">
                    <span className="text-sm">{child.name}</span>
                    <button onClick={() => deleteCategory(child._id)} className="text-red-400 text-xs hover:text-red-600">✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="نام زیرمجموعه جدید..." 
                  value={newChildName[root._id] || ''} 
                  onChange={e => setNewChildName({ ...newChildName, [root._id]: e.target.value })}
                  className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
                />
                <button onClick={() => addChild(root._id, root.group)} className="bg-stone-800 text-white px-4 py-1.5 rounded-lg text-sm">افزودن</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
