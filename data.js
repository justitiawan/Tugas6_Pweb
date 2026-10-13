const students = [
  { nama: 'Nuris Akbar', nim: '2410101001' },
  { nama: 'Nurul Hidayah', nim: '2410101014' },
  { nama: 'Nugroho Adi Pratama', nim: '2410101027' },
  { nama: 'Naufal Ramadhan', nim: '2410101033' },
  { nama: 'Nadia Putri Anjani', nim: '2410101042' },
  { nama: 'Rizky Maulana', nim: '2410101058' },
  { nama: 'Ratna Sari Dewi', nim: '2410101065' },
  { nama: 'Dimas Saputra', nim: '2410101071' },
  { nama: 'Aulia Rahman', nim: '2410101086' },
  { nama: 'Anisa Fitriani', nim: '2410101092' },
  { nama: 'Bagus Wicaksono', nim: '2410101103' },
  { nama: 'Citra Lestari', nim: '2410101117' }
];

const courses = {
  'Pemrograman Web': ['Dr. Rina Kusuma, M.Kom.', 'Ahmad Fauzi, M.T.'],
  'Basis Data': ['Budi Santoso, M.Cs.', 'Dr. Lestari Wulandari, M.Kom.'],
  'Algoritma dan Struktur Data': ['Prof. Hendra Wijaya, Ph.D.', 'Maya Anggraini, M.T.'],
  'Jaringan Komputer': ['Eko Prasetyo, M.Kom.', 'Dr. Siti Nurhaliza, M.T.'],
  'Sistem Operasi': ['Yusuf Hakim, M.Sc.', 'Fitri Handayani, M.Kom.']
};

const postalData = {
  'Jawa Timur': {
    'Kota Surabaya': {
      Sukolilo: [['Keputih', '60111'], ['Gebang Putih', '60117'], ['Klampis Ngasem', '60117'], ['Menur Pumpungan', '60118'], ['Nginden Jangkungan', '60118'], ['Semolowaru', '60119'], ['Medokan Semampir', '60119']],
      Gubeng: [['Gubeng', '60281'], ['Pucang Sewu', '60283'], ['Baratajaya', '60284'], ['Mojo', '60285'], ['Airlangga', '60286']],
      Wonokromo: [['Darmo', '60241'], ['Sawunggaling', '60242'], ['Wonokromo', '60243'], ['Jagir', '60244'], ['Ngagelrejo', '60245']]
    },
    'Kota Malang': {
      Klojen: [['Klojen', '65111'], ['Kiduldalem', '65112']],
      Lowokwaru: [['Mojolangu', '65142'], ['Dinoyo', '65144'], ['Merjosari', '65144'], ['Tlogomas', '65144']]
    }
  },
  'DKI Jakarta': {
    'Jakarta Pusat': {
      Gambir: [['Gambir', '10110'], ['Kebon Kelapa', '10120'], ['Duri Pulo', '10140'], ['Cideng', '10150'], ['Petojo Selatan', '10160']],
      Menteng: [['Menteng', '10310'], ['Pegangsaan', '10320'], ['Cikini', '10330'], ['Kebon Sirih', '10340'], ['Gondangdia', '10350']]
    }
  },
  'Jawa Barat': {
    'Kota Bandung': {
      Coblong: [['Cipaganti', '40131'], ['Lebak Gede', '40132'], ['Lebak Siliwangi', '40132'], ['Sadang Serang', '40133'], ['Dago', '40135']],
      Sukasari: [['Sarijadi', '40151'], ['Sukarasa', '40152'], ['Gegerkalong', '40153'], ['Isola', '40154']]
    }
  },
  'DI Yogyakarta': {
    'Kabupaten Sleman': {
      Depok: [['Caturtunggal', '55281'], ['Maguwoharjo', '55282'], ['Condongcatur', '55283']],
      Mlati: [['Sinduadi', '55284'], ['Sendangadi', '55285'], ['Tlogoadi', '55286']]
    }
  }
};

const programs = ['Teknik Informatika', 'Sistem Informasi', 'Teknik Elektro', 'Manajemen'];

const products = {
  Desktop: ['Acer', 'ASUS', 'Dell', 'HP', 'Lenovo'],
  Laptop: ['Acer', 'Apple', 'ASUS', 'HP', 'Lenovo'],
  Smartphone: ['Apple', 'Oppo', 'Samsung', 'Vivo', 'Xiaomi']
};
