import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState("idle");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // LINK FORMSPREE KAMU
  const FORMSPREE_URL = "https://formspree.io/f/xdarjajv";

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        }),
      });

      if (response.ok) {
        setStatus("sent");
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <section className="chapter chapter--colophon" id="kontak">
      <div className="chapter__heading">
        <span className="chapter__number">Kolofon</span>
        <h2 className="chapter__title">Ada Masalah?</h2>
      </div>

      <div className="colophon">
        <div className="colophon__notes">
          <p>
            Punya kendala saat menerbitkan buku? Atau ada yang perlu ditanyakan? 
            Hubungi kami, kami siap bantu.
          </p>
          <dl className="colophon__meta">
            <div>
              <dt>Email</dt>
              <dd>gustiayudyakusumawardani@gmail.com</dd>
            </div>
            <div>
              <dt>Jam Operasional</dt>
              <dd>Senin–Jumat, 09.00–17.00</dd>
            </div>
          </dl>
        </div>

        <form className="colophon__form" onSubmit={handleSubmit}>
          <label>
            Nama
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="Nama kamu"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </label>
          <label>
            Email
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="kamu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </label>
          <label>
            Pesan / Masalah
            <textarea
              name="message"
              rows="4"
              required
              placeholder="Ceritakan masalah atau pertanyaanmu..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            ></textarea>
          </label>
          <button type="submit" className="btn btn--solid" disabled={status === "loading"}>
            {status === "sent" ? "Terkirim ✓" : 
             status === "loading" ? "Mengirim..." : 
             status === "error" ? "Gagal, coba lagi" : "Kirim Pesan"}
          </button>
        </form>
      </div>
    </section>
  );
}