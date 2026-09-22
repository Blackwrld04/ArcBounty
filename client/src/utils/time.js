/**
 * ArcBounty Time & Dynamic Countdown Utilities
 * Handles creator deadline calculations, live countdown formatting, and challenge expiration.
 */

/**
 * Calculate remaining time and formatted countdown for a bounty deadline
 * @param {number|string|Date} deadline - Unix timestamp in ms or ISO string
 * @param {number} now - Current Unix timestamp in ms (defaults to Date.now())
 * @returns {object} { isExpired, text, shortText, days, hours, minutes, seconds, totalSeconds }
 */
export function getRemainingTime(deadline, now = Date.now()) {
  if (!deadline) {
    return {
      isExpired: false,
      text: 'Open',
      shortText: 'Open',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0
    };
  }

  const target = typeof deadline === 'number' ? deadline : new Date(deadline).getTime();
  if (isNaN(target)) {
    return {
      isExpired: false,
      text: 'Open',
      shortText: 'Open',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0
    };
  }

  const diffMs = target - now;

  if (diffMs <= 0) {
    return {
      isExpired: true,
      text: 'Expired',
      shortText: 'Expired',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let text = '';
  let shortText = '';

  if (days >= 2) {
    text = `Due in ${days}d ${hours}h`;
    shortText = `${days}d ${hours}h`;
  } else if (days === 1) {
    text = `Due in 1d ${hours}h ${minutes}m`;
    shortText = `1d ${hours}h`;
  } else if (hours >= 1) {
    text = `Due in ${hours}h ${minutes}m ${seconds}s`;
    shortText = `${hours}h ${minutes}m`;
  } else if (minutes >= 1) {
    text = `Due in ${minutes}m ${seconds}s`;
    shortText = `${minutes}m ${seconds}s`;
  } else {
    text = `Due in ${seconds}s`;
    shortText = `${seconds}s`;
  }

  return {
    isExpired: false,
    text,
    shortText,
    days,
    hours,
    minutes,
    seconds,
    totalSeconds
  };
}

/**
 * Check whether a bounty challenge is expired based on its deadline
 * @param {object} bounty
 * @param {number} now
 * @returns {boolean}
 */
export function isChallengeExpired(bounty, now = Date.now()) {
  if (!bounty) return false;
  if (!bounty.deadline) return false;
  const target = typeof bounty.deadline === 'number' ? bounty.deadline : new Date(bounty.deadline).getTime();
  if (isNaN(target)) return false;
  return now >= target;
}
