export default function Hero({ user }) {
  return (
    <section className="hero" id="top">
      <div className="hero__page hero__page--left">
        <p className="eyebrow">Tulis & Terbitkan</p>
        <h1 className="hero__title">
          Tulis naskahmu.
          <br />
          <span className="hero__title-accent">Terbitkan sendiri.</span>
        </h1>
        <p className="hero__subtitle">
          Platform sederhana untuk menulis dan menerbitkan e-book. Tanpa ribet, 
          langsung bisa dibaca.
        </p>
        <div className="hero__actions">
          <a href={user ? "/profile" : "#kontak"} className="btn btn--solid">
            {user ? "Kelola Buku" : "Mulai Sekarang"}
          </a>
          <a href="#tentang" className="btn btn--outline">
            Pelajari
          </a>
        </div>
        <dl className="hero__stats">
          <div>
            <dt>Gratis</dt>
            <dd>terbitkan bukumu</dd>
          </div>
          <div>
            <dt>Mudah</dt>
            <dd>langsung bisa dibaca</dd>
          </div>
        </dl>
      </div>

      <div className="hero__page hero__page--right" aria-hidden="true">
        <div className="book-cover">
          <div className="book-cover__spine"></div>
          <div className="book-cover__face">
            <span className="book-cover__kicker">E-book</span>
            <span className="book-cover__title">Judul
              <br />
              Bukumu
            </span>
            <span className="book-cover__author">— Namamu</span>
            <span className="book-cover__foldcorner"></span>
          </div>
        </div>
      </div>
    </section>
  );
}