/**
 * Utility to capture the 3D canvas and render an elegant architectural watermark badge
 */
export async function capture3DScreenshot(): Promise<{ success: boolean; dataUrl?: string }> {
  try {
    const canvas = document.querySelector('main canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      console.warn('Canvas not found');
      return { success: false };
    }

    const width = canvas.width;
    const height = canvas.height;

    // Create an offscreen canvas to compose the final image with branding badge
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return { success: false };

    // 1. Draw 3D scene from WebGL Canvas
    ctx.drawImage(canvas, 0, 0, width, height);

    // Scale factors relative to resolution (handles Retina / High-DPI screens)
    const scale = Math.max(width / 1400, 0.7);
    const badgeHeight = Math.round(75 * scale);
    const margin = Math.round(20 * scale);
    const badgeY = height - badgeHeight - margin;
    const badgeWidth = width - margin * 2;
    const cornerRadius = Math.round(16 * scale);

    // 2. Draw luxury semi-translucent bottom branding bar
    ctx.save();
    
    // Drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 18 * scale;
    ctx.shadowOffsetY = 6 * scale;

    // Background Gradient (Deep emerald green)
    const bgGrad = ctx.createLinearGradient(margin, badgeY, margin + badgeWidth, badgeY);
    bgGrad.addColorStop(0, 'rgba(15, 42, 37, 0.94)');
    bgGrad.addColorStop(0.5, 'rgba(27, 67, 50, 0.94)');
    bgGrad.addColorStop(1, 'rgba(15, 42, 37, 0.94)');

    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.roundRect(margin, badgeY, badgeWidth, badgeHeight, cornerRadius);
    ctx.fill();

    // Gold stroke border
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = Math.max(2 * scale, 1.5);
    ctx.strokeStyle = '#D4AF37';
    ctx.stroke();

    // Inner subtle gold highlight
    ctx.lineWidth = Math.max(1 * scale, 0.8);
    ctx.strokeStyle = 'rgba(255, 234, 167, 0.35)';
    ctx.beginPath();
    ctx.roundRect(margin + 4 * scale, badgeY + 4 * scale, badgeWidth - 8 * scale, badgeHeight - 8 * scale, cornerRadius - 4 * scale);
    ctx.stroke();

    // 3. Mosque Icon & Branding Text
    const leftTextX = margin + 28 * scale;
    const centerY = badgeY + badgeHeight / 2;

    // Main Title
    ctx.fillStyle = '#FFEAA7';
    ctx.font = `bold ${Math.round(22 * scale)}px Georgia, serif`;
    ctx.textBaseline = 'middle';
    ctx.fillText('🕌 MASJID AS-SAFAR', leftTextX, centerY - 10 * scale);

    // Subtitle
    ctx.fillStyle = '#E2E8F0';
    ctx.font = `500 ${Math.round(13 * scale)}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('Rancangan Visualisasi Arsitektur 3D Interaktif • Kapasitas ~350 Jamaah', leftTextX, centerY + 14 * scale);

    // Date & Timestamp on the right (if space permits)
    if (badgeWidth > 550 * scale) {
      const rightTextX = margin + badgeWidth - 28 * scale;
      const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      ctx.textAlign = 'right';
      ctx.fillStyle = '#D4AF37';
      ctx.font = `bold ${Math.round(14 * scale)}px system-ui, sans-serif`;
      ctx.fillText('PROYEK DESAIN ARSITEKTUR', rightTextX, centerY - 10 * scale);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = `400 ${Math.round(12 * scale)}px system-ui, sans-serif`;
      ctx.fillText(`${today} • Sudut Pandang 3D`, rightTextX, centerY + 14 * scale);
    }

    ctx.restore();

    // 4. Export as PNG and trigger download
    const dataUrl = offscreen.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Desain_Masjid_As_Safar_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    return { success: true, dataUrl };
  } catch (err) {
    console.error('Failed to capture screenshot:', err);
    return { success: false };
  }
}
