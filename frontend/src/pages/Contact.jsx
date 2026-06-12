import React, { useState } from 'react';
import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa'; // استيراد الأيقونات الرسمية
import "./contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ success: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: null, message: '' });

    try {
      const response = await fetch('https://mazoir-game-store-production.up.railway.app/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ success: true, message: 'تم إرسال رسالتك بنجاح! سنرد عليك قريباً.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ success: false, message: data.message || 'حدث خطأ ما، يرجى المحاولة لاحقاً.' });
      }
    } catch (error) {
      setStatus({ success: false, message: 'فشل الاتصال بالسيرفر.' });
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container" dir="rtl">
      <h2 className="contact-title">اتصل بنا - Contact Us</h2>
      
      <div className="contact-wrapper">
        
        {/* قسم مواقع التواصل الاجتماعي بالأيقونات الحقيقية */}
        <div className="social-section">
          <h3>تواصل معنا مباشرة</h3>
          <p style={{ textAlign: "right" }}>يمكنك مراسلتنا عبر شبكات التواصل الاجتماعي المتاحة 24/7:</p>
          
          <div className="social-links">
            <a href="https://wa.me/212657569045" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
              <FaWhatsapp className="react-social-icon" />
              <span>WhatsApp:</span> +212 600-000000
            </a>

            <a href="https://facebook.com/yourgamestore" target="_blank" rel="noopener noreferrer" className="social-link facebook">
              <FaFacebookF className="react-social-icon" />
              <span>Facebook:</span> Game Store Page
            </a>

            <a href="https://instagram.com/yourgamestore" target="_blank" rel="noopener noreferrer" className="social-link instagram">
              <FaInstagram className="react-social-icon" />
              <span>Instagram:</span> @yourgamestore
            </a>
          </div>
        </div>

        {/* قسم الفورم */}
        <div className="form-section">
          <h3>أرسل لنا رسالة</h3>
          
          {status.message && (
            <div className={`alert-message ${status.success ? 'success' : 'error'}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label>الاسم الكامل:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>البريد الإلكتروني:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>الموضوع:</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>الرسالة:</label>
              <textarea name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}