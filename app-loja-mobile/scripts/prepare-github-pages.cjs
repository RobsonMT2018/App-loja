const fs = require('node:fs');
const path = require('node:path');

const distDirectory = path.resolve('dist');

for (const fileName of fs.readdirSync(distDirectory)) {
  if (!fileName.endsWith('.html')) {
    continue;
  }

  const filePath = path.join(distDirectory, fileName);
  const html = fs.readFileSync(filePath, 'utf8');
  const relativeHtml = html
    .replaceAll('src="/_expo/', 'src="./_expo/')
    .replaceAll('href="/favicon.ico', 'href="./favicon.ico');

  fs.writeFileSync(filePath, relativeHtml);
}
