<script setup lang="ts">
import { onMounted, ref } from 'vue'
import cutout from './assets/dian-cutout.png'
import { boot, branches, cards, featured, markers, profile, stack, stats, tagline, timeline } from './data/profile'
import { startSora } from './engine/sora'

const links = profile.links.filter((l) => l.href)
const year = new Date().getFullYear()

const stage = ref<HTMLElement>()
const waLink = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(profile.whatsappText)}`

// live local clock for the contact strip
const fmt = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: profile.timezone })
const time = ref(fmt.format(new Date()))
setInterval(() => (time.value = fmt.format(new Date())), 15000)

// floating WhatsApp button appears once the hero is scrolled past, hides at the contact section
const showFab = ref(false)
addEventListener('scroll', () => {
  const k = document.getElementById('kontak')
  const nearEnd = k ? k.getBoundingClientRect().top < innerHeight * 0.6 : false
  showFab.value = scrollY > innerHeight * 0.6 && !nearEnd
}, { passive: true })

onMounted(() => {
  startSora({ email: profile.email, tagline, timeline, markers, branches })

  // stack.json groups slide in when scrolled into view
  const groups = document.querySelectorAll('.sgroup')
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -10% 0px' })
  groups.forEach((g) => io.observe(g))

  // Depth parallax: back name, photo and front name drift by different amounts with the pointer.
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || still || !stage.value) return
  const el = stage.value
  let tx = 0, ty = 0, cx = 0, cy = 0
  addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5 }, { passive: true })
  const tick = () => {
    if (scrollY < innerHeight * 1.2) {
      cx += (tx - cx) * 0.07
      cy += (ty - cy) * 0.07
      el.style.setProperty('--px', cx.toFixed(4))
      el.style.setProperty('--py', cy.toFixed(4))
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
</script>

<template>
  <!-- LOADING VEIL -->
  <div id="veil" role="status" aria-live="polite">
    <canvas id="burn" aria-hidden="true"></canvas>
    <div class="veil-ui" id="veilUi" aria-hidden="true">
      <div class="glyph"><span class="g-out">{{ profile.initials }}</span><span class="g-fill" id="gfill">{{ profile.initials }}</span></div>
    </div>
    <div class="meter" aria-hidden="true"><i id="meter"></i></div>
    <ul class="boot" id="boot" aria-hidden="true"><li v-for="b in boot" :key="b">{{ b }}</li></ul>
    <span class="veil-pct" id="vpct" aria-hidden="true">000</span>
    <span class="vh">Memuat halaman</span>
  </div>

  <div class="stack">
    <!-- 1 HERO -->
    <section class="hero stk" id="top" aria-labelledby="h1">
      <div class="stk-inner">
        <canvas id="heroBg" aria-hidden="true"></canvas>
        <canvas id="heroRv" aria-hidden="true"></canvas>
        <div class="hero-ui pad">
          <header class="mast" data-in="0">
            <span class="logo">DIAN<b>/</b>RP</span>
            <nav aria-label="Utama"><ul>
              <li><a href="#perjalanan">Perjalanan</a></li>
              <li><a href="#linimasa">Linimasa</a></li>
              <li><a href="#karya">Proyek</a></li>
              <li><a href="#kontak">Kontak</a></li>
            </ul></nav>
          </header>
          <div class="stage" ref="stage">
            <h1 class="bigname" id="h1" aria-label="Dian Rizki Pratama">
              <span class="bn bn1" data-in="180" aria-hidden="true">Dian Rizki</span>
              <span class="bn bn2" data-in="420" aria-hidden="true">Pratama</span>
            </h1>
            <figure class="cutout" data-in="300">
              <span class="cut-glow" aria-hidden="true"></span>
              <img :src="cutout" alt="Foto Dian Rizki Pratama" width="400" height="400">
            </figure>
            <div class="hside hside-l" data-in="900">
              <p class="eyebrow">~/dian $ whoami · fullstack engineer</p>
              <div class="meta">
                <div><span>Peran</span><span>Fullstack Engineer</span></div>
                <div><span>Kerja</span><span>KALEKA · freelance · produk sendiri</span></div>
                <div><span>Stack</span><span>Next.js · React · Vue · .NET · Laravel · Flutter</span></div>
              </div>
              <p class="typed" id="typed" data-in="600"><span id="typedText"></span><i class="caret" aria-hidden="true"></i></p>
            </div>
            <div class="hside hside-r" data-in="1100">
              <div class="panel br">
                <span class="eyebrow">Sedang dikerjakan</span>
                <p>Tanibaik: platform layanan petani sawit (web, API, mobile).</p>
                <div class="bar" aria-label="sedang berjalan"><i></i></div>
              </div>
              <div class="panel br">
                <span class="eyebrow">Terbuka untuk</span>
                <p>Proyek freelance web, API &amp; mobile · kolaborasi remote</p>
              </div>
            </div>
          </div>
          <div class="hero-foot" data-in="1500">
            <a class="cta" href="#karya">[ Lihat proyek → ]</a>
            <span class="eyebrow">Gerakkan kursor di atas halaman</span>
            <div class="socials">
              <a :href="`mailto:${profile.email}`">Email</a>
              <a v-for="l in links" :key="l.label" :href="l.href" target="_blank" rel="noopener">{{ l.label }}</a>
            </div>
          </div>
        </div>
        <div class="shade"></div>
      </div>
    </section>

    <!-- 2 PETA PERJALANAN -->
    <section class="season stk dark" id="perjalanan" aria-labelledby="h2a">
      <div class="stk-inner">
        <canvas id="map" aria-hidden="true"></canvas>
        <canvas id="chq" aria-hidden="true"></canvas>
        <span class="map-hint">Arahkan kursor ke commit</span>
        <div class="season-ui pad">
          <div>
            <p class="eyebrow">01 · git log --graph</p>
            <h2 class="disp" id="h2a">Perjalanan<br><em>dalam commit</em></h2>
            <p class="season-lede">Setiap cabang adalah produk yang saya bangun, di Kaleka maupun di luar kantor, sesuai periode pengerjaannya. Garis main adalah karier saya, dari kampus sampai HEAD hari ini.</p>
          </div>
          <div class="plate br" id="plate">
            <div v-for="s in stats" :key="s.label" class="row"><span>{{ s.label }}</span><b>{{ s.value }}</b></div>
          </div>
        </div>
        <div class="shade"></div>
      </div>
    </section>

    <div class="dwell" id="dwell" aria-hidden="true"></div>

    <!-- 3 LINIMASA -->
    <section class="timeline" id="linimasa" aria-labelledby="h2b">
      <div class="tl-head pad">
        <p class="eyebrow">02 · history</p>
        <h2 class="disp" id="h2b">Dari nol<br>sampai sekarang</h2>
      </div>
      <div class="tl" id="tl">
        <div class="tl-rail"><div class="tl-thread" id="thread"></div></div>
        <div class="tl-mark" id="mark"></div>
      </div>
    </section>
  </div>

  <!-- 4 PROYEK -->
  <section class="studio" id="studio" aria-labelledby="h2c">
    <canvas id="ctr" aria-hidden="true"></canvas>
    <div class="studio-top pad">
      <div>
        <p class="eyebrow">03 · case_study/tanibaik</p>
        <h2 class="disp" id="h2c">{{ featured.name }}</h2>
        <p class="report">{{ featured.report }}</p>
        <ul class="hl">
          <li v-for="h in featured.highlights" :key="h">{{ h }}</li>
        </ul>
        <button class="chamfer" type="button" id="caseBtn">Lihat semua proyek →</button>
      </div>
      <div class="stats">
        <div class="panel br">
          <div v-for="s in featured.stats" :key="s.label" class="srow"><span>{{ s.label }}</span><b>{{ s.value }}</b></div>
        </div>
      </div>
    </div>
    <div class="stackx pad" id="stack">
      <div class="stack-head">
        <p class="eyebrow">// $ cat stack.json</p>
        <h3 class="disp">Stack yang saya <em>pakai</em></h3>
        <p class="stack-lede">Bukan daftar hafalan. Setiap teknologi di bawah ini saya pakai di produk yang sudah rilis.</p>
      </div>
      <div class="sgrid">
        <div v-for="(g, gi) in stack" :key="g.key" class="sgroup" :style="{ '--d': gi * 90 + 'ms' }">
          <span class="sk">"{{ g.key }}": [</span>
          <ul>
            <li v-for="t in g.items" :key="t.n"><b>{{ t.n }}</b><small>{{ t.where }}</small></li>
          </ul>
          <span class="sk">]{{ gi < stack.length - 1 ? ',' : '' }}</span>
        </div>
      </div>
    </div>
    <div class="band" id="karya">
      <div class="band-in pad">
        <div class="band-head"><span class="eyebrow">Proyek · 2021 — {{ year }}</span><span class="eyebrow">Kaleka · freelance · pribadi</span></div>
        <div class="cal" id="cal">
          <template v-for="(c, i) in cards" :key="c.name">
            <div v-if="i" class="conn"></div>
            <div class="card" :class="{ 'live br': c.live }" :id="c.live ? 'live' : undefined">
              <span v-if="c.live" class="ring" id="ring"><i></i></span>
              <span class="st">{{ c.st }} · {{ c.kind }}</span>
              <span class="m">{{ c.name }}</span>
              <p>{{ c.p }}</p>
              <ul><li v-for="s in c.stack" :key="s">{{ s }}</li></ul>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>

  <!-- 5 KONTAK -->
  <footer class="foot" id="kontak">
    <div class="foot-in">
      <canvas id="fctr" aria-hidden="true"></canvas>
      <div class="figure" id="figure" aria-hidden="true">{{ profile.initials }}</div>
      <div class="fgrid">
        <div class="fmain">
          <p class="eyebrow">04 · $ contact --dian</p>
          <h2 class="disp">Ayo bangun<br><em>bersama.</em></h2>
          <p class="flead">Butuh satu orang yang bisa memegang web, API, dan aplikasi mobile sekaligus? Ceritakan ide atau kebutuhanmu, saya bantu dari rancangan sampai rilis.</p>

          <div class="cgrid">
            <a class="ccard ccard--wa" :href="waLink" target="_blank" rel="noopener">
              <span class="ck"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5 5.3 16A8 8 0 1 1 8 18.7z" /><path d="M9.2 8.6c.2 1.9 2.3 4.5 4.6 5.3l1.3-1.2 1.8.9-.4 1.6c-3.4.4-7.6-3.6-7.4-7l1.5-.5.9 1.8z" /></svg>WhatsApp</span>
              <span class="cv">{{ profile.whatsappDisplay }}</span>
              <span class="cgo">Chat sekarang <b aria-hidden="true">→</b></span>
            </a>
            <button class="ccard" id="mail" type="button">
              <span class="ck"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m3.5 6 8.5 7 8.5-7" /></svg>Email</span>
              <span class="cv cv--sm">{{ profile.email }}</span>
              <span class="cgo">Klik untuk salin <b aria-hidden="true">⧉</b></span>
            </button>
            <a v-for="l in links" :key="l.label" class="ccard" :href="l.href" target="_blank" rel="noopener">
              <span class="ck">
                <svg v-if="l.icon === 'in'" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" /></svg>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></svg>{{ l.label }}
              </span>
              <span class="cv cv--sm">{{ l.href.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '') }}</span>
              <span class="cgo">{{ l.cta }} <b aria-hidden="true">↗</b></span>
            </a>
          </div>
          <p class="copied" id="copied" aria-live="polite"></p>

          <div class="fstatus">
            <span><i class="dot" aria-hidden="true"></i>Medan · {{ time }} WIB</span>
            <span>Fullstack · web, API, mobile</span>
            <span>Terbuka: freelance &amp; remote</span>
          </div>
        </div>
        <nav class="fside" aria-label="Navigasi bawah">
          <p class="eyebrow">// navigasi</p>
          <ul class="fnav" id="fnav">
            <li><a href="#top" data-t="Beranda">Beranda</a></li>
            <li><a href="#perjalanan" data-t="Perjalanan">Perjalanan</a></li>
            <li><a href="#linimasa" data-t="Linimasa">Linimasa</a></li>
            <li><a href="#karya" data-t="Proyek">Proyek</a></li>
          </ul>
        </nav>
      </div>
      <div class="legal"><span>© {{ year }} {{ profile.name }}</span><span>Dibuat dengan Vue, canvas &amp; spring</span><a href="#top">Kembali ke atas ↑</a></div>
    </div>
  </footer>

  <!-- floating WhatsApp -->
  <a class="wa-fab" :class="{ on: showFab }" :href="waLink" target="_blank" rel="noopener" aria-label="Chat WhatsApp dengan Dian">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5 5.3 16A8 8 0 1 1 8 18.7z" /><path d="M9.2 8.6c.2 1.9 2.3 4.5 4.6 5.3l1.3-1.2 1.8.9-.4 1.6c-3.4.4-7.6-3.6-7.4-7l1.5-.5.9 1.8z" /></svg>
    <span>Chat WhatsApp</span>
  </a>
</template>
