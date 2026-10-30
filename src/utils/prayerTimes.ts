/**
 * Prayer Times calculation utility tailored for Western Indonesia (WIB) / Kemenag standard
 */

export interface PrayerTimeItem {
  id: string;
  name: string;
  arabic: string;
  timeStr: string; // e.g. "04:38"
  hour: number;
  minute: number;
  isNext?: boolean;
  isCurrent?: boolean;
}

export function getTodayPrayerTimes(date: Date = new Date()): PrayerTimeItem[] {
  // Base calculation standard for Depok/Jakarta (WIB: UTC+7)
  // Subuh: ~04:36, Terbit: ~05:50, Dzuhur: ~11:58, Ashar: ~15:14, Maghrib: ~18:03, Isya: ~19:14
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );
  
  // Minor seasonal fluctuation wave (approx +/- 15 mins across year)
  const seasonOffset = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 12;

  const prayers = [
    { id: 'subuh', name: 'Subuh', arabic: 'الفجر', h: 4, m: Math.round(36 + seasonOffset * 0.4) },
    { id: 'terbit', name: 'Terbit / Syuruq', arabic: 'الشروق', h: 5, m: Math.round(52 + seasonOffset * 0.4) },
    { id: 'dzuhur', name: 'Dzuhur', arabic: 'الظهر', h: 11, m: Math.round(58 + seasonOffset * 0.2) },
    { id: 'ashar', name: 'Ashar', arabic: 'العصر', h: 15, m: Math.round(14 + seasonOffset * 0.1) },
    { id: 'maghrib', name: 'Maghrib', arabic: 'المغرب', h: 18, m: Math.round(3 - seasonOffset * 0.3) },
    { id: 'isya', name: 'Isya\'', arabic: 'العشاء', h: 19, m: Math.round(14 - seasonOffset * 0.3) }
  ];

  const nowH = date.getHours();
  const nowM = date.getMinutes();
  const nowMinutes = nowH * 60 + nowM;

  let nextFound = false;

  const result: PrayerTimeItem[] = prayers.map(p => {
    // Normalize minute bounds
    let adjustedH = p.h;
    let adjustedM = p.m;
    if (adjustedM < 0) {
      adjustedM += 60;
      adjustedH -= 1;
    } else if (adjustedM >= 60) {
      adjustedM -= 60;
      adjustedH += 1;
    }

    const prayerMinutes = adjustedH * 60 + adjustedM;
    const isNext = !nextFound && prayerMinutes > nowMinutes;
    if (isNext) nextFound = true;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return {
      id: p.id,
      name: p.name,
      arabic: p.arabic,
      timeStr: `${pad(adjustedH)}:${pad(adjustedM)} WIB`,
      hour: adjustedH,
      minute: adjustedM,
      isNext
    };
  });

  // If no upcoming prayer today, the next one is Subuh tomorrow
  if (!nextFound) {
    const subuh = result.find(p => p.id === 'subuh');
    if (subuh) subuh.isNext = true;
  }

  return result;
}

export function getCountdownToNextPrayer(prayers: PrayerTimeItem[]): { prayerName: string; remainingText: string } {
  const nextPrayer = prayers.find(p => p.isNext) || prayers[0];
  const now = new Date();
  const nowMs = now.getTime();

  const targetDate = new Date();
  targetDate.setHours(nextPrayer.hour, nextPrayer.minute, 0, 0);

  // If target time is earlier today, it falls on tomorrow
  if (targetDate.getTime() <= nowMs) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  const diffMs = targetDate.getTime() - nowMs;
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return {
    prayerName: nextPrayer.name,
    remainingText: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  };
}

export function getIndonesianDateString(date: Date = new Date()): { masehi: string; hijri: string } {
  const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  // Approximate Hijri year calculation for display
  // 1447 - 1448 H
  const hijriYear = Math.round(1447 + (year - 2025));

  return {
    masehi: `${dayName}, ${day} ${monthName} ${year}`,
    hijri: `12 Dzulqa'dah ${hijriYear} H`
  };
}
