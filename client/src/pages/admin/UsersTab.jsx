export default function UsersTab({ users }) {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
      <table className="w-full text-right">
        <thead className="bg-stone-100">
          <tr>
            <th className="p-3">نام</th>
            <th className="p-3">ایمیل</th>
            <th className="p-3">شماره تماس</th>
            <th className="p-3">وضعیت هویت</th>
            <th className="p-3">تاریخ عضویت</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="border-t hover:bg-stone-50">
              <td className="p-3 font-bold text-sm">{u.name}</td>
              <td className="p-3 text-sm">{u.email}</td>
              <td className="p-3 text-sm">{u.phone || '---'}</td>
              <td className="p-3">
                {u.isVerified ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">تایید شده</span>
                ) : (
                  <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs font-bold">عادی</span>
                )}
              </td>
              <td className="p-3 text-sm text-stone-500">{new Date(u.createdAt).toLocaleDateString('fa-IR')}</td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="p-8 text-center text-stone-500">کاربری یافت نشد.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}