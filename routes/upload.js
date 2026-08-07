const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const router = express.Router();

// 上传目录（由 server.js 自动检测并设置到 global.UPLOAD_DIR）
const UPLOAD_DIR = global.UPLOAD_DIR || process.env.UPLOAD_DIR || path.join(__dirname, '../persistent/uploads');

// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `temp-${uniqueSuffix}${ext}`);
  }
});

// 文件过滤器 - 只允许图片
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 最大
  fileFilter: fileFilter
});

// 压缩图片到 720p (1280x720)，保持纵横比
async function compressImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(1280, 1280, {
        fit: 'inside',      // 保持纵横比，不裁剪
        withoutEnlargement: true  // 如果原图小于 720p，不放大
      })
      .jpeg({ quality: 85, progressive: true })  // JPEG 压缩，质量 85%
      .toFile(outputPath);

    return true;
  } catch (error) {
    console.error('Image compression error:', error);
    return false;
  }
}

// 上传单张图片
router.post('/image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const tempPath = req.file.path;
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const finalFilename = `product-${uniqueSuffix}.jpg`;
  const finalPath = path.join(UPLOAD_DIR, finalFilename);

  try {
    // 压缩图片
    const compressed = await compressImage(tempPath, finalPath);

    if (!compressed) {
      // 压缩失败，保留原图
      fs.renameSync(tempPath, finalPath.replace('.jpg', path.extname(req.file.originalname)));
    } else {
      // 压缩成功，删除临时文件
      fs.unlinkSync(tempPath);
    }

    // 返回相对 URL（根据 UPLOAD_DIR 决定前缀）
    const isPublicHtml = UPLOAD_DIR.includes('public_html');
    const imageUrl = isPublicHtml ? `/uploads/${finalFilename}` : `/uploads/${finalFilename}`;

    res.json({
      success: true,
      url: imageUrl,
      filename: finalFilename,
      compressed: compressed
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to process image' });
  }
});

// 上传多张图片
router.post('/images', upload.array('images', 5), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const urls = [];

  for (const file of req.files) {
    const tempPath = file.path;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const finalFilename = `product-${uniqueSuffix}.jpg`;
    const finalPath = path.join(UPLOAD_DIR, finalFilename);

    try {
      const compressed = await compressImage(tempPath, finalPath);

      if (!compressed) {
        fs.renameSync(tempPath, finalPath.replace('.jpg', path.extname(file.originalname)));
      } else {
        fs.unlinkSync(tempPath);
      }

      urls.push(`/uploads/${finalFilename}`);
    } catch (error) {
      console.error('Batch upload error:', error);
    }
  }

  res.json({
    success: true,
    urls: urls
  });
});

module.exports = router;
