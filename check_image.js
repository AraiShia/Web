const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

// 获取所有图片文件
const files = fs.readdirSync(uploadsDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.JPG') || f.endsWith('.png') || f.endsWith('.webp'))
  .slice(-5); // 只检查最新的5张

console.log('Checking latest uploaded images...\n');

files.forEach(async (file) => {
  const filePath = path.join(uploadsDir, file);
  const stats = fs.statSync(filePath);

  try {
    const metadata = await sharp(filePath).metadata();
    const sizeKB = (stats.size / 1024).toFixed(1);

    console.log('File:', file);
    console.log('  Size:', sizeKB + ' KB');
    console.log('  Dimensions:', metadata.width + 'x' + metadata.height);
    console.log('  Format:', metadata.format);

    // 检查是否符合720p标准
    const is720p = metadata.width <= 1280 && metadata.height <= 720;

    if (is720p) {
      console.log('  Status: ✅ Compressed to 720p');
    } else {
      console.log('  Status: ❌ Larger than 720p');
    }
    console.log('');
  } catch (err) {
    console.log('File:', file, '- Error reading:', err.message);
  }
});