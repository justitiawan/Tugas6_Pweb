const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const fillSelect = (select, items, placeholder) => {
  select.replaceChildren(new Option(placeholder, ''), ...items.map(item => new Option(item, item)));
  select.disabled = items.length === 0;
};

const setStatus = (node, message) => {
  node.textContent = message;
  node.hidden = !message;
};

const dialog = $('#dialog');

const showDialog = (title, message, tone) => {
  $('#dialog-title').textContent = title;
  $('#dialog-message').textContent = message;
  dialog.dataset.tone = tone;
  dialog.showModal();
};

const check = {
  required: message => value => (value === true || (typeof value === 'string' && value.trim() !== '')) ? '' : message,
  pattern: (regex, message) => value => regex.test(value.trim()) ? '' : message,
  minLength: (length, message) => value => value.trim().length >= length ? '' : message
};

const emailRules = [
  check.required('Email tidak boleh kosong'),
  check.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Format email tidak valid, contoh: nama@domain.com')
];

const readValue = field => field.type === 'checkbox' ? field.checked : field.value;

const setError = (field, message) => {
  const wrapper = field.closest('.field');
  $('.error', wrapper).textContent = message;
  wrapper.classList.toggle('invalid', Boolean(message));
  field.setAttribute('aria-invalid', String(Boolean(message)));
};

const validateField = (form, name, rules) => {
  const field = form.elements[name];
  const message = rules[name].map(rule => rule(readValue(field), form)).find(Boolean) || '';
  setError(field, message);
  return message;
};

const bindForm = (form, rules, { onValid, onInvalid }) => {
  const names = Object.keys(rules);
  const touched = new Set();

  names.forEach(name => {
    const field = form.elements[name];
    field.addEventListener('input', () => touched.has(name) && validateField(form, name, rules));
    ['blur', 'change'].forEach(type => field.addEventListener(type, () => {
      touched.add(name);
      validateField(form, name, rules);
    }));
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    names.forEach(name => touched.add(name));
    const errors = names
      .map(name => ({ name, message: validateField(form, name, rules) }))
      .filter(error => error.message);
    if (errors.length) {
      form.elements[errors[0].name].focus();
      if (onInvalid) onInvalid(errors);
      return;
    }
    onValid(form);
  });

  form.addEventListener('reset', () => {
    touched.clear();
    names.forEach(name => setError(form.elements[name], ''));
  });
};

const initNavigation = () => {
  const tabs = $$('.nav-item');
  const panels = $$('.panel');

  const show = id => {
    const target = panels.some(panel => panel.id === id) ? id : panels[0].id;
    panels.forEach(panel => { panel.hidden = panel.id !== target; });
    tabs.forEach(tab => {
      if (tab.dataset.target === target) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });
  };

  tabs.forEach(tab => tab.addEventListener('click', () => {
    history.replaceState(null, '', `#${tab.dataset.target}`);
    show(tab.dataset.target);
    window.scrollTo(0, 0);
  }));

  show(location.hash.slice(1));
};

const initRegistrasi = () => {
  const form = $('#form-registrasi');
  const { nama, nim, matkul, dosen } = form.elements;
  const list = $('#reg-saran');
  const records = [];
  let matches = [];
  let active = -1;

  const closeSuggestions = () => {
    list.hidden = true;
    active = -1;
    nama.setAttribute('aria-expanded', 'false');
    nama.removeAttribute('aria-activedescendant');
  };

  const highlight = index => {
    active = index;
    $$('li', list).forEach((item, position) => {
      item.classList.toggle('active', position === index);
      item.setAttribute('aria-selected', String(position === index));
    });
    if (index >= 0) nama.setAttribute('aria-activedescendant', `saran-${index}`);
    else nama.removeAttribute('aria-activedescendant');
  };

  const choose = student => {
    nama.value = student.nama;
    nim.value = student.nim;
    closeSuggestions();
    nama.dispatchEvent(new Event('change'));
    nim.dispatchEvent(new Event('change'));
  };

  const renderSuggestions = () => {
    const query = nama.value.trim().toLowerCase();
    const rank = student => student.nama.toLowerCase().startsWith(query) ? 0 : 1;
    matches = query
      ? students.filter(student => student.nama.toLowerCase().includes(query)).sort((a, b) => rank(a) - rank(b)).slice(0, 5)
      : [];

    if (!matches.length) {
      list.replaceChildren();
      closeSuggestions();
      return;
    }

    list.replaceChildren(...matches.map((student, index) => {
      const start = student.nama.toLowerCase().indexOf(query);
      const end = start + query.length;
      const item = el('li');
      item.id = `saran-${index}`;
      item.setAttribute('role', 'option');
      item.append(
        el('span', '', student.nama.slice(0, start)),
        el('mark', '', student.nama.slice(start, end)),
        el('span', '', student.nama.slice(end)),
        el('small', '', student.nim)
      );
      item.addEventListener('mousedown', event => {
        event.preventDefault();
        choose(student);
      });
      return item;
    }));
    list.hidden = false;
    nama.setAttribute('aria-expanded', 'true');
    highlight(-1);
  };

  nama.addEventListener('input', renderSuggestions);
  nama.addEventListener('focus', renderSuggestions);
  nama.addEventListener('blur', closeSuggestions);
  nama.addEventListener('keydown', event => {
    if (list.hidden) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      highlight((active + 1) % matches.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      highlight((active - 1 + matches.length) % matches.length);
    } else if (event.key === 'Enter' && active >= 0) {
      event.preventDefault();
      choose(matches[active]);
    } else if (event.key === 'Escape') {
      closeSuggestions();
    }
  });

  const resetDosen = () => fillSelect(
    dosen,
    courses[matkul.value] || [],
    matkul.value ? 'Pilih dosen pengampu' : 'Pilih mata kuliah dulu'
  );

  fillSelect(matkul, Object.keys(courses), 'Pilih mata kuliah');
  resetDosen();
  matkul.addEventListener('change', resetDosen);
  form.addEventListener('reset', () => {
    closeSuggestions();
    fillSelect(dosen, [], 'Pilih mata kuliah dulu');
  });

  const renderRecords = () => {
    const body = $('#reg-tabel tbody');
    if (!records.length) {
      body.innerHTML = '<tr class="empty"><td colspan="4">Belum ada mahasiswa terdaftar.</td></tr>';
      return;
    }
    body.replaceChildren(...records.map(record => {
      const row = el('tr');
      [record.nama, record.nim, record.matkul, record.dosen].forEach(text => row.append(el('td', '', text)));
      return row;
    }));
  };

  renderRecords();

  bindForm(form, {
    nama: [
      check.required('Nama tidak boleh kosong'),
      check.pattern(/^[A-Za-z .'-]{3,}$/, 'Nama hanya boleh berisi huruf dan minimal 3 karakter')
    ],
    nim: [
      check.required('NIM tidak boleh kosong'),
      check.pattern(/^\d{10}$/, 'NIM harus terdiri dari 10 digit angka'),
      (value, currentForm) => records.some(record => record.nim === value.trim() && record.matkul === currentForm.elements.matkul.value)
        ? 'NIM ini sudah terdaftar di mata kuliah tersebut'
        : ''
    ],
    matkul: [check.required('Mata kuliah harus dipilih')],
    dosen: [check.required('Dosen pengampu harus dipilih')]
  }, {
    onInvalid: errors => showDialog('Data belum lengkap', errors[0].message, 'error'),
    onValid: () => {
      const record = {
        nama: nama.value.trim(),
        nim: nim.value.trim(),
        matkul: matkul.value,
        dosen: dosen.value
      };
      records.push(record);
      renderRecords();
      form.reset();
      showDialog('Pendaftaran berhasil', `${record.nama} (${record.nim}) terdaftar di ${record.matkul}.\nDosen pengampu: ${record.dosen}`, 'success');
    }
  });
};

const initKodePos = () => {
  const form = $('#form-kodepos');
  const { provinsi, kota, kecamatan, kata } = form.elements;
  const result = $('#kodepos-hasil');

  const resetKota = () => fillSelect(
    kota,
    Object.keys(postalData[provinsi.value] || {}),
    provinsi.value ? 'Pilih kota atau kabupaten' : 'Pilih provinsi dulu'
  );

  const resetKecamatan = () => fillSelect(
    kecamatan,
    Object.keys((postalData[provinsi.value] || {})[kota.value] || {}),
    kota.value ? 'Pilih kecamatan' : 'Pilih kota dulu'
  );

  const render = items => {
    const keyword = kata.value.trim();
    const summary = el('p', 'result-summary', items.length
      ? `Ditemukan ${items.length} kode pos di Kecamatan ${kecamatan.value}, ${kota.value}.`
      : `Tidak ada kelurahan atau kode pos yang cocok dengan “${keyword}” di Kecamatan ${kecamatan.value}.`);
    const list = el('ul', 'result-list');

    items.forEach(([kelurahan, kode]) => {
      const detail = el('div');
      detail.append(
        el('strong', '', `Kelurahan ${kelurahan}`),
        el('span', '', `Kecamatan ${kecamatan.value}, ${kota.value}, ${provinsi.value}`)
      );
      const item = el('li', 'result-item');
      item.append(el('span', 'postal', kode), detail);
      list.append(item);
    });

    result.replaceChildren(el('h2', '', 'Hasil pencarian'), summary, list);
    result.hidden = false;
  };

  fillSelect(provinsi, Object.keys(postalData), 'Pilih provinsi');
  resetKota();
  resetKecamatan();

  provinsi.addEventListener('change', () => {
    resetKota();
    resetKecamatan();
  });
  kota.addEventListener('change', resetKecamatan);

  form.addEventListener('reset', () => {
    result.hidden = true;
    fillSelect(kota, [], 'Pilih provinsi dulu');
    fillSelect(kecamatan, [], 'Pilih kota dulu');
  });

  bindForm(form, {
    provinsi: [check.required('Provinsi harus dipilih')],
    kota: [check.required('Kota atau kabupaten harus dipilih')],
    kecamatan: [check.required('Kecamatan harus dipilih')]
  }, {
    onValid: () => {
      const keyword = kata.value.trim().toLowerCase();
      const areas = postalData[provinsi.value][kota.value][kecamatan.value];
      render(areas.filter(([kelurahan, kode]) => kelurahan.toLowerCase().includes(keyword) || kode.includes(keyword)));
    }
  });
};

const initLatihan = () => {
  const form = $('#form-latihan');
  const status = $('#latihan-status');
  const sandi = form.elements.sandi;
  const toggle = $('#toggle-sandi');

  fillSelect(form.elements.kursus, programs, 'Pilih program studi');

  toggle.addEventListener('click', () => {
    const reveal = sandi.type === 'password';
    sandi.type = reveal ? 'text' : 'password';
    toggle.textContent = reveal ? 'Sembunyikan' : 'Tampilkan';
    toggle.setAttribute('aria-pressed', String(reveal));
  });

  form.addEventListener('reset', () => setStatus(status, ''));

  bindForm(form, {
    nama: [
      check.required('Nama tidak boleh kosong'),
      check.pattern(/^[A-Za-z .'-]{3,}$/, 'Nama hanya boleh berisi huruf dan minimal 3 karakter')
    ],
    alamat: [
      check.required('Alamat tidak boleh kosong'),
      check.minLength(10, 'Alamat minimal 10 karakter')
    ],
    email: emailRules,
    sandi: [
      check.required('Kata sandi tidak boleh kosong'),
      check.minLength(8, 'Kata sandi minimal 8 karakter'),
      check.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Kata sandi harus mengandung huruf dan angka')
    ],
    kursus: [check.required('Program studi harus dipilih')],
    kampus: [
      check.required('Nama kampus tidak boleh kosong'),
      check.minLength(3, 'Nama kampus minimal 3 karakter')
    ],
    setuju: [check.required('Anda harus menyetujui informasi di atas')]
  }, {
    onValid: () => {
      const name = form.elements.nama.value.trim();
      form.reset();
      setStatus(status, `Terima kasih, ${name}. Pendaftaran Anda berhasil dikirim.`);
    }
  });

  const emailForm = $('#form-email');
  const emailStatus = $('#email-status');

  emailForm.addEventListener('reset', () => setStatus(emailStatus, ''));
  emailForm.elements.email.addEventListener('input', () => setStatus(emailStatus, ''));

  bindForm(emailForm, { email: emailRules }, {
    onInvalid: () => setStatus(emailStatus, ''),
    onValid: () => setStatus(emailStatus, `${emailForm.elements.email.value.trim()} adalah alamat email yang valid.`)
  });
};

const initProduk = () => {
  const jenis = $('#produk-jenis');
  const merk = $('#produk-merk');
  const output = $('#produk-hasil');

  const update = () => {
    if (jenis.value && merk.value) output.textContent = `Anda memilih ${jenis.value} merek ${merk.value}.`;
    else if (jenis.value) output.textContent = `Jenis ${jenis.value} dipilih. Sekarang pilih merek.`;
    else output.textContent = 'Belum ada produk yang dipilih.';
  };

  fillSelect(jenis, Object.keys(products), 'Pilih jenis produk');
  fillSelect(merk, [], 'Pilih jenis produk dulu');

  jenis.addEventListener('change', () => {
    fillSelect(merk, products[jenis.value] || [], jenis.value ? 'Pilih merek' : 'Pilih jenis produk dulu');
    update();
  });
  merk.addEventListener('change', update);
};

initNavigation();
initRegistrasi();
initKodePos();
initLatihan();
initProduk();
