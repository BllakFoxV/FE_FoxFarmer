/**
 * Trích xuất ảnh template từ ảnh gốc dựa trên tọa độ thực
 * @param {HTMLImageElement} sourceImg - Ảnh gốc (DOM element)
 * @param {Object} raw - Tọa độ thực {x1, y1, w, h}
 * @returns {string} - Base64 PNG
 */
export const cropImage = (sourceImg, raw) => {
  if (raw.w <= 0 || raw.h <= 0) return null;

  const canvas = document.createElement('canvas');
  canvas.width = raw.w;
  canvas.height = raw.h;
  const ctx = canvas.getContext('2d');

  // Vẽ vùng đã chọn lên canvas 1:1
  ctx.drawImage(
    sourceImg,
    raw.x1, raw.y1, raw.w, raw.h, // Vùng cắt trên ảnh gốc
    0, 0, raw.w, raw.h           // Vẽ vào canvas
  );

  return canvas.toDataURL('image/png');
};

/**
 * Chuyển đổi File/Blob sang Base64 (Dùng khi upload ảnh có sẵn)
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};