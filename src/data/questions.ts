import { Question } from '../types';

export const GRID_ROWS = 14;
export const GRID_COLS = 15;
export const SUBJECT_NAME = 'DIGITAL ON BOARDING';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    number: 1,
    word: 'ONBOARDING',
    clue: 'Proses memperkenalkan pengguna baru pada produk/layanan digital agar cepat memahami cara menggunakannya.',
    dir: 'H',
    row: 0,
    col: 0,
    explanation: 'Digital Onboarding adalah proses awal memandu pengguna baru untuk memahami fitur dan manfaat utama aplikasi sehingga pengguna merasa nyaman dan terbiasa.'
  },
  {
    id: 2,
    number: 2,
    word: 'REFERAL',
    clue: 'Strategi pemasaran yang memanfaatkan pelanggan lama untuk merekomendasikan produk ke orang lain, biasanya dengan imbalan.',
    dir: 'V',
    row: 0,
    col: 5,
    explanation: 'Program referal (referral) mendorong pemasaran dari mulut ke mulut dengan memberikan insentif atau komisi kepada pelanggan yang mengajak pengguna baru.'
  },
  {
    id: 3,
    number: 3,
    word: 'INSTAGRAM',
    clue: 'Platform media sosial berlogo kamera yang populer untuk berbagi foto dan video pendek (Reels).',
    dir: 'H',
    row: 5,
    col: 1,
    explanation: 'Instagram adalah media sosial berbasis visual milik Meta yang sangat efektif untuk branding melalui foto, Story, dan video pendek Reels.'
  },
  {
    id: 4,
    number: 4,
    word: 'TIKTOK',
    clue: 'Platform video asal Tiongkok yang terkenal dengan video pendek dan tren viral.',
    dir: 'V',
    row: 2,
    col: 4,
    explanation: 'TikTok merupakan platform video pendek serba cepat dengan algoritma rekomendasi FYP (For You Page) yang efektif menciptakan tren viral.'
  },
  {
    id: 5,
    number: 5,
    word: 'FACEBOOK',
    clue: 'Media sosial milik Meta yang awalnya digunakan untuk menghubungkan teman dan keluarga, kini juga untuk bisnis (marketplace, ads).',
    dir: 'V',
    row: 4,
    col: 8,
    explanation: 'Facebook adalah jejaring sosial terpopuler dari Meta yang dilengkapi sarana bisnis lengkap seperti Marketplace, Fanpage, dan Meta Ads.'
  },
  {
    id: 6,
    number: 6,
    word: 'YOUTUBE',
    clue: 'Platform berbagi video terbesar yang sering digunakan untuk tutorial, vlog, dan iklan berbentuk video panjang.',
    dir: 'H',
    row: 8,
    col: 3,
    explanation: 'YouTube adalah platform berbagi video berdurasi panjang terbesar di dunia yang optimal untuk konten edukasi, tutorial produk, dan demo bisnis.'
  },
  {
    id: 7,
    number: 7,
    word: 'KONTENKREATIF',
    clue: 'Isi promosi yang dibuat menarik, unik, dan orisinal agar audiens tertarik berinteraksi dengan brand.',
    dir: 'H',
    row: 1,
    col: 1,
    explanation: 'Konten kreatif merupakan aset pemasaran digital utama dalam menarik daya pikat (engagement) audiens melalui perpaduan desain visual dan copywriting.'
  },
  {
    id: 8,
    number: 8,
    word: 'PENJUALAN',
    clue: 'Aktivitas meningkatkan jumlah transaksi atau omzet melalui strategi promosi digital.',
    dir: 'V',
    row: 3,
    col: 2,
    explanation: 'Penjualan (Sales) adalah tujuan akhir dari funnel pemasaran digital yang mengubah prospek/calon pembeli menjadi transaksi pembayaran nyata.'
  },
  {
    id: 9,
    number: 9,
    word: 'TUTORIAL',
    clue: 'Contoh penerapan onboarding digital di bisnis: tampilan langkah demi langkah saat pertama kali membuka aplikasi, biasa disebut...',
    dir: 'V',
    row: 1,
    col: 11,
    explanation: 'Tutorial atau panduan interaktif awal (walkthrough) memandu pengguna secara intuitif saat pertama kali mengakses aplikasi.'
  },
  {
    id: 10,
    number: 10,
    word: 'RETENSI',
    clue: 'Tujuan utama digital onboarding yang baik adalah meningkatkan rasa nyaman pengguna sehingga mereka bertahan menggunakan aplikasi/layanan (istilah bahasa Inggris untuk "bertahan/tidak berhenti").',
    dir: 'V',
    row: 7,
    col: 9,
    explanation: 'Retensi (User Retention) mengukur persentase pengguna yang tetap aktif menggunakan aplikasi dalam jangka panjang.'
  }
];
