const https = require('https');
const fs = require('fs');

function download(url, dest) {
  https.get(url, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      download(res.headers.location, dest);
      return;
    }
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
  });
}

download('https://cdn.pixabay.com/download/audio/2021/08/04/audio_c6ccf3232f.mp3?filename=success-1-6297.mp3', 'public/celebration.mp3');
download('https://cdn.pixabay.com/download/audio/2022/11/20/audio_5502ab8f51.mp3?filename=fireworks-29629.mp3', 'public/crackers.mp3');
