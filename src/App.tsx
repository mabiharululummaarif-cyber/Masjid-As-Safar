import React from 'react';

const activities = [
  { number: '01', icon: '☾', title: 'Ibadah', text: 'Ruang yang teduh untuk menunaikan ibadah dan mendekatkan diri kepada Allah.' },
  { number: '02', icon: '۞', title: 'Ilmu', text: 'Tempat bertumbuh melalui pembelajaran, nasihat, dan berbagi pengetahuan.' },
  { number: '03', icon: '♡', title: 'Kebersamaan', text: 'Menguatkan silaturahmi, kepedulian, dan semangat saling membantu.' },
];

function Emblem() {
  return <span className="brand-emblem" aria-hidden="true"><svg viewBox="0 0 48 48" role="img"><path d="M24 4 29 14 40 9 35 20 45 24 35 29 40 40 29 35 24 45 19 35 8 40 13 29 3 24 13 20 8 9 19 14Z" /><circle cx="24" cy="24" r="8"/><path d="M24 18v12M18 24h12"/></svg></span>;
}

function MosqueIllustration() {
  return <div className="mosque-scene" aria-label="Ilustrasi arsitektur masjid">
    <div className="scene-sun" />
    <div className="scene-moon">☾</div>
    <div className="scene-minaret"><i /></div>
    <div className="scene-roof" />
    <div className="scene-building">
      <div className="scene-window window-one" /><div className="scene-window window-two" />
      <div className="scene-door" />
    </div>
    <div className="scene-steps" />
    <div className="scene-caption"><span>MASJID AS-SAFAR</span><span>BIHARUL ULUM MA'ARIF</span></div>
  </div>;
}

export default function App() {
  return <div className="site">
    <header className="nav">
      <a className="brand" href="#home" aria-label="Masjid As-Safar, beranda"><Emblem/><span className="brand-copy"><b>MASJID AS-SAFAR</b><small>BIHARUL ULUM MA'ARIF</small></span></a>
      <nav aria-label="Navigasi utama"><a href="#tentang">Tentang</a><a href="#kegiatan">Kegiatan</a><a href="#galeri">Galeri</a><a href="#kontak">Kontak</a></nav>
    </header>
    <main>
      <section className="hero" id="home">
        <div className="hero-text">
          <span className="eyebrow"><i/> RUMAH IBADAH · RUANG UKHUWAH</span>
          <h1>Tempat hati<br/>menemukan <em>teduh.</em></h1>
          <p>Selamat datang di Masjid As-Safar Biharul Ulum Ma'arif. Rumah ibadah, tempat menuntut ilmu, dan ruang untuk merawat kebersamaan.</p>
          <a className="cta" href="#tentang">Mengenal Masjid <span>↗</span></a>
        </div>
        <MosqueIllustration/>
        <div className="hero-foot"><span>مَرْحَبًا بِكُمْ</span><span>MENJALIN UKHUWAH · MENUMBUHKAN KEBAIKAN</span></div>
      </section>
      <section className="intro section" id="tentang">
        <div className="section-label"><span>01</span> TENTANG MASJID</div>
        <div className="intro-grid">
          <h2>Bernaung dalam iman,<br/><em>bertumbuh bersama.</em></h2>
          <div className="intro-copy"><p>Masjid As-Safar Biharul Ulum Ma'arif hadir sebagai ruang ibadah dan kebersamaan bagi jamaah serta masyarakat sekitar.</p><p className="muted">Dengan semangat ukhuwah, masjid menjadi tempat untuk mendekatkan diri kepada Allah, menimba ilmu, dan menumbuhkan kepedulian.</p></div>
        </div>
        <div className="intro-rule"><span>۞</span></div>
      </section>
      <section className="activities section" id="kegiatan">
        <div className="section-label"><span>02</span> PERAN MASJID</div>
        <div className="activities-head"><h2>Ruang untuk<br/><em>hal-hal bermakna.</em></h2><p>Memakmurkan masjid melalui ibadah, ilmu, dan hubungan baik antarsesama.</p></div>
        <div className="cards">{activities.map(a=><article className="activity" key={a.number}><div className="activity-top"><span>{a.number}</span><span className="activity-icon">{a.icon}</span></div><h3>{a.title}</h3><p>{a.text}</p><div className="activity-line"/></article>)}</div>
      </section>
      <section className="verse"><div className="verse-mark">۞</div><p className="arabic" lang="ar" dir="rtl">وَأَنَّ الْمَسَاجِدَ لِلَّهِ فَلَا تَدْعُوا مَعَ اللَّهِ أَحَدًا</p><p className="translation">“Dan sesungguhnya masjid-masjid itu adalah untuk Allah.”</p><small>QS. Al-Jinn: 18</small></section>
      <section className="gallery section" id="galeri"><div className="section-label"><span>03</span> GALERI</div><div className="gallery-head"><h2>Rumah ibadah<br/><em>kita bersama.</em></h2><p>Potret Masjid As-Safar akan ditampilkan di sini.</p></div><div className="gallery-note"><span>MASJID AS-SAFAR</span><p>Galeri foto sedang disiapkan.</p></div></section>
      <section className="contact section" id="kontak"><div className="contact-copy"><div className="section-label"><span>04</span> SILATURAHMI</div><h2>Mari bersama<br/><em>memakmurkan masjid.</em></h2><p>Jamaah dan masyarakat dipersilakan hadir serta berpartisipasi dalam kegiatan Masjid As-Safar.</p></div><div className="contact-card"><Emblem/><h3>Masjid As-Safar</h3><p>Biharul Ulum Ma'arif</p><div className="contact-rule"/><small>Informasi alamat dan kontak pengurus akan ditambahkan setelah tersedia.</small></div></section>
    </main>
    <footer><a className="brand" href="#home"><Emblem/><span className="brand-copy"><b>MASJID AS-SAFAR</b><small>BIHARUL ULUM MA'ARIF</small></span></a><span className="copyright">© {new Date().getFullYear()} Masjid As-Safar · Semoga membawa keberkahan.</span><a className="back-top" href="#home">Kembali ke atas ↑</a></footer>
  </div>;
}