router.post('/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'نام، شماره تلفن و رمز عبور الزامی است.' });
    }
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'کاربری با این شماره تلفن قبلاً ثبت‌نام کرده است.' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    // ✅ ایجاد کاربر بدون فیلد ایمیل (حتی به صورت null)
    const user = await User.create({
      name,
      phone,
      passwordHash,
      role: 'client',
      isVerified: false,
      // هیچ فیلدی برای email قرار نمی‌دهیم
    });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      success: true, 
      data: { user, accessToken: token, refreshToken: token }, 
      message: 'ثبت‌نام با موفقیت انجام شد.' 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});