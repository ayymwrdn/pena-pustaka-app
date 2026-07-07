const features = [
  {
    label: "Tulis Naskah",
    text: "Tulis langsung di browser. Simpan otomatis, fokus pada tulisanmu.",
  },
  {
    label: "Sampul & Tata Letak",
    text: "Buat sampul dan susun bab dengan mudah. Pena Pustaka yang atur tipografi.",
  },
  {
    label: "Bagikan ke Pembaca",
    text: "Setiap buku dapat link sendiri. Langsung share ke siapa saja.",
  },
];

export default function About() {
  return (
    <section className="chapter" id="tentang">
      <div className="chapter__heading">
        <span className="chapter__number">TENTANG</span>
        <h2 className="chapter__title">Kenapa Pena Pustaka?</h2>
      </div>

      <p className="chapter__lede">
        <span className="dropcap">P</span>ena Pustaka adalah platform sederhana untuk 
        menulis dan menerbitkan e-book. Tanpa ribet, tanpa antre. Kamu tulis, 
        kami bantu terbitkan. Selesai.
      </p>

      <ol className="feature-list">
        {features.map((f, i) => (
          <li className="feature-list__item" key={f.label}>
            <span className="feature-list__index">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{f.label}</h3>
              <p>{f.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}