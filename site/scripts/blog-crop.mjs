// Shared cropping for blog featured images. Default is sharp's content-aware
// "attention" crop; if a focal point {x,y} (0..1) is given, crop manually so
// that point stays centered (clamped to the image edges).
import sharp from 'sharp';

const attention = sharp.strategy.attention;

async function cropTo(buf, tw, th, focal) {
  if (!focal) {
    return sharp(buf).resize(tw, th, { fit: 'cover', position: attention }).webp({ quality: 82 }).toBuffer();
  }
  const { width: W, height: H } = await sharp(buf).metadata();
  const R = tw / th;
  let bw, bh;
  if (W / H > R) { bh = H; bw = Math.round(H * R); } else { bw = W; bh = Math.round(W / R); }
  const left = Math.max(0, Math.min(W - bw, Math.round(focal.x * W - bw / 2)));
  const top = Math.max(0, Math.min(H - bh, Math.round(focal.y * H - bh / 2)));
  return sharp(buf).extract({ left, top, width: bw, height: bh }).resize(tw, th).webp({ quality: 82 }).toBuffer();
}

export const makeHero = (buf, focal) => cropTo(buf, 1280, 720, focal); // 16:9
export const makeCard = (buf, focal) => cropTo(buf, 800, 500, focal);  // 16:10
export const makeSource = (buf) =>
  sharp(buf).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();

// "0.5 0.3" or "0.5,0.3" -> { x, y }; returns null if absent/invalid.
export function parseFocal(s) {
  if (!s) return null;
  const p = String(s).trim().split(/[\s,]+/).map(Number);
  if (p.length < 2 || p.some(Number.isNaN)) return null;
  return { x: Math.max(0, Math.min(1, p[0])), y: Math.max(0, Math.min(1, p[1])) };
}
