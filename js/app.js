let songs = [];
let currentFilter = 'all';

async function loadSongs() {
  try {
    const res = await fetch('data/songs.json');
    const data = await res.json();
    songs = data.songs;
    renderSongs();
  } catch (e) {
    document.getElementById('song-list').innerHTML = '<p>Error loading lyrics. Check data/songs.json.</p>';
  }
}

function renderSongs(query = '') {
  const list = document.getElementById('song-list');
  const q = query.toLowerCase();
  const filtered = songs.filter(s => {
    const matchesType = currentFilter === 'all' || s.type === currentFilter;
    const matchesQuery = !q || 
      s.title.toLowerCase().includes(q) || 
      s.artist.toLowerCase().includes(q) || 
      s.lyrics.toLowerCase().includes(q);
    return matchesType && matchesQuery;
  });

  if (filtered.length === 0) {
    list.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#666;">No songs found. Try another search.</p>';
    return;
  }

  list.innerHTML = filtered.map(s => `
    <div class="song-card" onclick="showDetail('${s.id}')">
      <h3>${s.title}</h3>
      <div class="meta">${s.artist}</div>
      <span class="type">${s.type}</span>
    </div>
  `).join('');
}

function showDetail(id) {
  const song = songs.find(s => s.id === id);
  if (!song) return;
  const detail = document.getElementById('song-detail');
  detail.classList.remove('hidden');
  detail.innerHTML = `
    <span class="back" onclick="hideDetail()">← Back to all songs</span>
    <h2>${song.title}</h2>
    <p class="meta">${song.artist} · ${song.type}</p>
    <h4>Fijian Lyrics</h4>
    <pre>${song.lyrics}</pre>
    ${song.translation ? `<div class="translation"><h4>English Translation</h4><pre>${song.translation}</pre></div>` : ''}
    <p class="source">Source: ${song.source} · <a href="${song.youtube}" target="_blank" rel="noopener">Search on YouTube</a></p>
  `;
  document.getElementById('song-list').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideDetail() {
  document.getElementById('song-detail').classList.add('hidden');
  document.getElementById('song-list').style.display = 'grid';
}

document.getElementById('search').addEventListener('input', (e) => {
  renderSongs(e.target.value);
});

document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.type;
    renderSongs(document.getElementById('search').value);
  });
});

loadSongs();