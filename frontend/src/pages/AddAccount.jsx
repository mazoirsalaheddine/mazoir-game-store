import React, { useState } from 'react';
import axios from 'axios';
import './addAccount.css';

const AddAccount = () => {
    const [formData, setFormData] = useState({
        game_name: '',
        whatsapp: '',
        price: '',
        description: '',
    });
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        // إنشاء روابط المعاينة للصور المحددة
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setPreviews(previewUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('game_name', formData.game_name);
        data.append('whatsapp', formData.whatsapp);
        data.append('price', formData.price);
        data.append('description', formData.description);

        // إضافة الصور للمصفوفة باسم 'images[]' المتوافق مع الـ Backend
        images.forEach((file) => {
            data.append('images[]', file);
        });

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/game-accounts', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.status === 201) {
                alert("✅ تم رفع الحساب بنجاح!");
                // إعادة تعيين الفورم للحالة الأصلية
                setFormData({ game_name: '', whatsapp: '', price: '', description: '' });
                setPreviews([]);
                setImages([]);
            }
        } catch (error) {
            console.error("Error details:", error.response?.data);
            alert("❌ خطأ: " + (error.response?.data?.message || "تعذر الاتصال بالسيرفر"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-container" dir="rtl">
            <div className="form-card">
                <h2>إضافة عرض جديد 🎮</h2>
                <form onSubmit={handleSubmit}>
                    
                    <div className="row">
                        <div className="input-group">
                            <label>اسم اللعبة</label>
                            <select name="game_name" value={formData.game_name} onChange={handleInputChange} required>
                                <option value="">اختر اللعبة</option>
                                <option value="Free Fire">Free Fire</option>
                                <option value="PES">eFootball (PES)</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>رقم الواتساب</label>
                            <input 
                                type="tel" 
                                name="whatsapp" 
                                placeholder="مثال: 0612345678" 
                                value={formData.whatsapp} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>الثمن (MAD)</label>
                        <input 
                            name="price" 
                            type="number" 
                            placeholder="حدد السعر بالدرهم" 
                            value={formData.price} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>وصف الحساب</label>
                        <textarea 
                            name="description" 
                            placeholder="اكتب تفاصيل الحساب (المميزات، السكنات، الأسلحة...)" 
                            value={formData.description} 
                            onChange={handleInputChange} 
                            required
                        ></textarea>
                    </div>

                    <div className="input-group">
                        <label>صور الحساب</label>
                        <div className="upload-box">
                            <input type="file" multiple onChange={handleFileChange} accept="image/*" id="file-input" />
                            <label htmlFor="file-input">📸 اضغط هنا لاختيار الصور</label>
                        </div>
                    </div>

                    {previews.length > 0 && (
                        <div className="preview-row">
                            {previews.map((url, i) => (
                                <div key={i} className="preview-item">
                                    <img src={url} alt={`preview-${i}`} />
                                </div>
                            ))}
                        </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? (
                            <span className="spinner">جاري الرفع...</span>
                        ) : (
                            'نشر العرض الآن 🚀'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAccount;