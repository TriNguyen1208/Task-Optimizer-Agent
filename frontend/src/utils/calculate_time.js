export default function calculateTimeLeft (time) {
  // deadline có thể là chuỗi ISO hoặc đối tượng Date
  const total = Date.parse(time) - Date.now();
  
  if (total <= 0) return "Expired"; // Đã hết hạn

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};