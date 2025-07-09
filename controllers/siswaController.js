const { v4: uuidv4 } = require('uuid');
const pool = require('../models/db');
const multer = require('multer');
const path = require('path');
const { error } = require('console');
// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder penyimpanan
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Filter untuk validasi file
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Jenis file tidak diizinkan'), false);
  }
};

const upload = multer({ storage, fileFilter });
exports.addSiswa = async (req, res) => {
  const {id, name, angkatan, keahlian, link_porto, alamat, deskripsi, posisi, instansi, skill, linkedin, status, email, telepon } = req.body;
  const foto = req.files.foto ? req.files.foto[0].filename : null;
  const portofolio_foto = req.files.portofolio_foto ? req.files.portofolio_foto[0].filename : null;
  const cv = req.files.cv ? req.files.cv[0].filename : null;
  try {
    
    await pool.query(
      'INSERT INTO db_siswa (id, name, angkatan, keahlian, link_porto, cv, foto, alamat, deskripsi, posisi, instansi, skill, linkedin, status, email, telepon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)',
      [id, name, angkatan, keahlian, link_porto, cv, foto, alamat, deskripsi, posisi, instansi, skill, linkedin, status, email, telepon || '']
    );
    res.json({ message: 'Siswa berhasil ditambahkan', id });
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
};
exports.deleteSiswa = async (req, res) => {
  const { id } = req.params;
  try {
    const {rows} = await pool.query('DELETE FROM db_siswa WHERE id = ?', [id]);
    res.json({message: "berhasil dihapus", rows});
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus data siswa' });
  }
}
exports.updateSiswa = async (req, res) => {
  const { id } = req.params;
  const { name, angkatan, keahlian, link_porto, alamat, deskripsi, posisi, instansi, skill, linkedin, status, email, telepon, password } = req.body;

  // Cek file jika ada perubahan
  const foto = req.files?.foto ? req.files.foto[0].filename : null;
  const cv = req.files?.cv ? req.files.cv[0].filename : null;

  try {
    // Ambil data lama terlebih dahulu (untuk menyimpan file yang tidak diubah)
    const [rows] = await pool.query('SELECT * FROM db_siswa WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Siswa tidak ditemukan' });
    }

    const oldData = rows[0];

    // Gunakan file baru jika ada, kalau tidak pakai file lama
    const updatedFoto = foto || oldData.foto;
    const updatedCV = cv || oldData.cv;


    await pool.query(
      `UPDATE db_siswa SET id = ?,  name = ?, angkatan = ?, keahlian = ?, link_porto = ?, cv = ?, foto = ?, alamat = ?, deskripsi = ?, posisi =?, instansi = ?, skill = ?, linkedin = ?, status = ?, email = ?, telepon = ?, password = ?
       WHERE id = ?`,
      [
        id,
        name,
        angkatan,
        keahlian,
        link_porto,
        updatedCV,
        updatedFoto,
        alamat,
        deskripsi,
        posisi,
        instansi,
        skill,
        linkedin,
        status,
        email,
        telepon,
        password || '',
        id,
      ]
    );

    res.json({ message: 'Data siswa berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui data siswa' });
  }
};
exports.getSiswaByAngkatan = async (req, res) => {
  const { angkatan } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM db_siswa WHERE angkatan = ?', [angkatan]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getSiswaDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const [siswa] = await pool.query('SELECT * FROM db_siswa WHERE id = ?', [id]);
    const [projects] = await pool.query('SELECT * FROM project WHERE db_siswa_id = ?', [id]);
    const [pengalaman] = await pool.query("SELECT * FROM pengalaman WHERE db_siswa_id = ?", [id]);
    res.json({ siswa: siswa[0], projects, pengalaman });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getSiswaByNama = async (req, res) => {
  const { name } = req.query;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM db_siswa WHERE name LIKE ?',
      [`%${name}%`]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Pengalaman

exports.addPengalaman = async (req, res) => {
  const { id, name, lokasi, deskripsi, db_siswa_id } = req.body;
  const foto = req.files.foto ? req.files.foto[0].filename : null;
  try {
    await pool.query(
      'INSERT INTO pengalaman (id, name, lokasi, deskripsi, foto, db_siswa_id) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, lokasi, deskripsi, foto || '', db_siswa_id]
    );
    res.json({ message: 'Pengalaman berhasil ditambahkan', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getPengalamanAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT pengalaman.*, db_siswa.name AS siswa_name FROM pengalaman LEFT JOIN db_siswa ON pengalaman.db_siswa_id = db_siswa.id');
    res.json(rows);
  } catch (err) {
    console.error('❌ ERROR getPengalamanAll:', err); // 👈 penting
    res.status(500).json({ error: err.message || 'Terjadi kesalahan pada server.' });
  }
}

exports.getPengalamanBySiswaId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM pengalaman WHERE db_siswa_id = ?', [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


exports.updatePengalaman = async (req, res) => {
  const { id } = req.params;
  const { name, lokasi, deskripsi, db_siswa_id } = req.body;
  const foto = req.files.foto ? req.files.foto[0].filename : null;

  try {
    // Ambil data lama terlebih dahulu (untuk menyimpan file yang tidak diubah)
    const [rows] = await pool.query('SELECT * FROM pengalaman WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pengalaman tidak ditemukan' });
    }

    const oldData = rows[0];

    // Gunakan file baru jika ada, kalau tidak pakai file lama
    const updatedFoto = foto || oldData.foto;

    await pool.query(
      `UPDATE pengalaman SET name = ?, lokasi = ?, deskripsi = ?, foto = ?, db_siswa_id = ? WHERE id = ?`,
      [name, lokasi, deskripsi, updatedFoto, db_siswa_id, id]
    );

    res.json({ message: 'Pengalaman berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui pengalaman' });
  }
}


exports.deletePengalaman = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM pengalaman WHERE id = ?', [id]);
    res.json({ message: 'Pengalaman berhasil dihapus', rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus pengalaman' });
  }
}
//keahlian

exports.addKeahlian = async (req, res) => {
  const { id, name_keahlian, deskripsi, db_siswa_id } = req.body;
  const foto = req.files.foto ? req.files.foto[0].filename : null;
  try {
    await pool.query(
      'INSERT INTO keahlian (id, name_keahlian, deskripsi, db_siswa_id, foto) VALUES (?, ?, ?, ?, ?)',
      [id, name_keahlian, deskripsi || '', db_siswa_id, foto]
    );
    res.json({ message: 'keahlian berhasil ditambahkan', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


exports.deleteKeahlian = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM keahlian WHERE id = ?', [id]);
    res.json({ message: 'Keahlian berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus keahlian' });
  }
}
exports.getAllKeahlian = async (req, res) => {
  try {
    console.log('🔍 Querying keahlian...');
    const [ rows  ]= await pool.query('SELECT k.id, k.name_keahlian, k.deskripsi, s.name AS nama_siswa FROM keahlian k JOIN db_siswa s ON k.db_siswa_id = s.id');
    console.log('✅ Rows:', rows);
    res.json(rows);
  } catch (err) {
    console.error('❌ ERROR getKeahlian:', err);
    res.status(500).json({ error: err.message || 'Terjadi kesalahan pada server.' });
  }
};

exports.updateKeahlian = async (req, res) => {
  const { id } = req.params;
  const { name_keahlian, deskripsi, db_siswa_id } = req.body;
  const foto = req.files.foto ? req.files.foto[0].filename : null;
  
  try {
    // Ambil data lama terlebih dahulu (untuk menyimpan file yang tidak diubah)
    const [rows] = await pool.query('SELECT * FROM keahlian WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Keahlian tidak ditemukan' });
    }
    
    const oldData = rows[0];
    
    // Gunakan file baru jika ada, kalau tidak pakai file lama
    const updatedFoto = foto || oldData.foto;
    
    await pool.query(
      `UPDATE keahlian SET name_keahlian = ?, deskripsi = ?, db_siswa_id = ?, foto = ? WHERE id = ?`,
      [name_keahlian, deskripsi, db_siswa_id, updatedFoto, id]
    );
    
    res.json({ message: 'Keahlian berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui keahlian' });
  }
}
exports.getAvailableAngkatan = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DISTINCT angkatan FROM siswa ORDER BY angkatan ASC");
    const angkatanList = rows.map((r) => r.angkatan);
    res.json(angkatanList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getKeahlianBySiswaId = async (req, res) => {
  const { siswaId } = req.params;
  try {
    const [result] = await pool.query(
      'SELECT * FROM keahlian WHERE db_siswa_id = ?',
      [siswaId]
    );
    res.json(result); // array of keahlian
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.addProjectWithUpload = async (req, res) => {
  const {id, name_project, db_siswa_id, link_web, deskripsi, tools } = req.body; // 🟢 tambahkan link_porto
  const foto = req.files.foto ? req.files.foto[0].filename : null;

  try {
    
    await pool.query(
      'INSERT INTO project (id, name_project, db_siswa_id, foto, link_web, deskripsi, tools) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name_project, db_siswa_id, foto, link_web, deskripsi || '', tools]
    );
    res.json({ message: 'Project dengan upload berhasil ditambahkan', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//project

exports.getProjectAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT p.id, p.name_project, p.foto, p.link_web, p.deskripsi, s.name AS nama_siswa FROM project p JOIN db_siswa s ON p.db_siswa_id = s.id');
    res.json(rows);
  } catch (err) {
    console.error('❌ ERROR getProjectAll:', err); // 👈 penting
    res.status(500).json({ error: err.message || 'Terjadi kesalahan pada server.' });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { name_project, db_siswa_id, link_web, deskripsi, tools } = req.body;
  const foto = req.files.foto ? req.files.foto[0].filename : null;

  try {
    // Ambil data lama terlebih dahulu (untuk menyimpan file yang tidak diubah)
    const [rows] = await pool.query('SELECT * FROM project WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project tidak ditemukan' });
    }

    const oldData = rows[0];

    // Gunakan file baru jika ada, kalau tidak pakai file lama
    const updatedFoto = foto || oldData.foto;

    await pool.query(
      `UPDATE project SET name_project = ?, db_siswa_id = ?, foto = ?, link_web = ?, deskripsi = ?, tools = ? WHERE id = ?`,
      [name_project, db_siswa_id, updatedFoto, link_web, deskripsi, tools, id]
    );

    res.json({ message: 'Project berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui project' });
  }
}

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM project WHERE id = ?', [id]);
    res.json({ message: 'Project berhasil dihapus', rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus project' });
  }
}

exports.getAll = async (req, res) => {
  try {
    const [siswa] = await pool.query('SELECT * FROM db_siswa');
    res.json(siswa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addProjectPending = async (req, res) => {
  const { name_project, link_web, db_siswa_id, deskripsi, tools } = req.body;
  const foto = req.files && req.files.foto ? req.files.foto[0].filename : null;

  try {
    await pool.query(
      `INSERT INTO project_pending (id, name_project, db_siswa_id, foto, link_web, deskripsi, status, tools)
       VALUES (UUID(), ?, ?, ?, ?, ?, 'false', ?)`,
      [name_project, db_siswa_id, foto, link_web, deskripsi, tools]
    );
    res.status(200).json({ message: "Berhasil menambahkan project pending." });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getProjectPending = async (req, res) => {
  try {
    const [arrow] = await pool.query('SELECT * FROM project_pending');
    res.json(arrow);
  } catch (err) {
    res.status(500).json({ error : err.message});
  }
};

exports.approveProjectPending = async (req, res) => {
  const projectId = req.params.id;

  try {
    // Ambil data dari project_pending
    const [rows] = await pool.query(
      "SELECT * FROM project_pending WHERE id = ?",
      [projectId]
    );

    const data = rows[0];
    if (!data) {
      return res.status(404).json({ error: "Project tidak ditemukan" });
    }

    // Masukkan ke tabel project
    await pool.query(
      `INSERT INTO project (id, name_project, db_siswa_id, foto, link_web, deskripsi, tools)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.id,
        data.name_project,
        data.db_siswa_id,
        data.foto,
        data.link_web,
        data.deskripsi,
        data.tools,
      ]
    );

    // Hapus dari tabel project_pending
    await pool.query("DELETE FROM project_pending WHERE id = ?", [projectId]);

    res.status(200).json({ message: "Proyek berhasil disetujui." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProjectPending = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM project_pending WHERE id = ?', [id]);
    res.json({ message: 'Project pending berhasil dihapus', rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus project pending' });
  }
}

exports.updateProjectPending = async (req, res) => {
  const { id } = req.params;
  const { name_project, link_web, db_siswa_id, deskripsi, tools } = req.body;
  const foto = req.files && req.files.foto ? req.files.foto[0].filename : null;

  try {
    // Ambil data lama terlebih dahulu (untuk menyimpan file yang tidak diubah)
    const [rows] = await pool.query('SELECT * FROM project_pending WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project pending tidak ditemukan' });
    }

    const oldData = rows[0];

    // Gunakan file baru jika ada, kalau tidak pakai file lama
    const updatedFoto = foto || oldData.foto;

    await pool.query(
      `UPDATE project_pending SET name_project = ?, db_siswa_id = ?, foto = ?, link_web = ?, deskripsi = ?, tools = ? WHERE id = ?`,
      [name_project, db_siswa_id, updatedFoto, link_web, deskripsi, tools, id]
    );

    res.json({ message: 'Project pending berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui project pending' });
  }
}

// POST /api/siswa_pending
exports.addSiswaPending = async (req, res) => {
  const {
    id, // ini NIS manual, hanya dipakai jika siswa baru
    db_siswa_id, // ini ID siswa yang sudah ada
    name,
    angkatan,
    keahlian,
    alamat,
    posisi,
    instansi,
    skill,
    deskripsi
  } = req.body;

  const foto = req.file ? req.file.filename : null;

  try {
    if (db_siswa_id) {
      // Mode UPDATE siswa
      await pool.query(`
        INSERT INTO siswa_pending (db_siswa_id, name, angkatan, keahlian, alamat, posisi, instansi, skill, deskripsi, foto, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `, [
        db_siswa_id,
        name,
        angkatan,
        keahlian,
        alamat,
        posisi,
        instansi,
        skill,
        deskripsi,
        foto
      ]);
    } else {
      // Mode TAMBAH siswa baru
      await pool.query(`
        INSERT INTO siswa_pending (id, name, angkatan, keahlian, alamat, posisi, instansi, skill, deskripsi, foto, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `, [
        id,
        name,
        angkatan,
        keahlian,
        alamat,
        posisi,
        instansi,
        skill,
        deskripsi,
        foto
      ]);
    }

    res.status(200).json({ message: "Berhasil mengajukan update siswa" });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ error: err.message });
  }
};




// PUT /api/approve_siswa/:id
exports.approveSiswaPending = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query("SELECT * FROM siswa_pending WHERE id = ?", [id]);
    const data = rows[0];
    if (!data) return res.status(404).json({ error: "Data tidak ditemukan" });

    if (!data.db_siswa_id) {
      // INSERT siswa baru ke db_siswa
      await pool.query(
        `INSERT INTO db_siswa (id, name, angkatan, keahlian, alamat, posisi, instansi, skill, deskripsi, foto)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.id, data.name, data.angkatan, data.keahlian, data.alamat, data.posisi, data.instansi, data.skill, data.deskripsi, data.foto]
      );
    } else {
      // UPDATE siswa lama
      await pool.query(
        `UPDATE db_siswa SET
          name = ?, angkatan = ?, keahlian = ?, alamat = ?, posisi = ?, instansi = ?, skill = ?, deskripsi = ?, foto = ?
         WHERE id = ?`,
        [data.name, data.angkatan, data.keahlian, data.alamat, data.posisi, data.instansi, data.skill, data.deskripsi, data.foto, data.db_siswa_id]
      );
    }

    // Hapus data dari siswa_pending setelah disetujui
    await pool.query("DELETE FROM siswa_pending WHERE id = ?", [id]);

    res.sendStatus(200);
  } catch (err) {
    console.error("Gagal menyetujui siswa pending:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.deleteSiswaPending = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM siswa_pending WHERE id = ?', [id]);
    res.json({ message: 'Siswa pending berhasil dihapus', rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus siswa pending' });
  }
}

exports.getSiswaPending = async (req, res) => {
  try {
    const [isi] = await pool.query("SELECT * FROM siswa_pending");
    res.json(isi);
  } catch (err) {
    res.status(500).json({error: err.message})
  }
}

exports.addPengalamanPending = async (req, res) => {
  const { db_siswa_id, name, lokasi, deskripsi } = req.body;


  try {
    await pool.query(`
      INSERT INTO pengalaman_pending (db_siswa_id, name, lokasi, deskripsi, status)
      VALUES (?, ?, ?, ?, 0)
    `, [db_siswa_id, name, lokasi, deskripsi]);
    res.status(200).json({ message: "Berhasil mengajukan pengalaman baru" });
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ error: err.message });
  }
}

exports.getPengalamanPending = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM pengalaman_pending");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching pengalaman_pending:", err);
    res.status(500).json({ error: err.message });
  }
}

// PUT /api/approve_pengalaman/:id
exports.approvePengalamanPending = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query("SELECT * FROM pengalaman_pending WHERE id = ?", [id]);
    const data = rows[0];
    if (!data) return res.status(404).json({ error: "Data tidak ditemukan" });

    await pool.query(
      `INSERT INTO pengalaman (name, lokasi, deskripsi, foto, db_siswa_id)
       VALUES (?, ?, ?, ?, ?)`,
      [data.name, data.lokasi, data.deskripsi, data.foto, data.db_siswa_id]
    );

    await pool.query("DELETE FROM pengalaman_pending WHERE id = ?", [id]);

    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error("Error approving pengalaman_pending:", err);
  }
};

exports.deletePengalamanPending = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM pengalaman_pending WHERE id = ?', [id]);
    res.json({ message: 'Pengalaman pending berhasil dihapus', rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus pengalaman pending' });
  }
}

// API: PUT /api/update_pengalaman_pending/:id
exports.updatePengalamanPending = async (req, res) => {
  const { id } = req.params;
  const { name, lokasi, deskripsi, db_siswa_id } = req.body;

  try {
    await pool.query(
      `UPDATE pengalaman_pending SET name=?, lokasi=?, deskripsi=?, db_siswa_id=? WHERE id=?`,
      [name, lokasi, deskripsi, db_siswa_id, id]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//admin

exports.adminLogin = async (req, res) => {
  const { nis, password } = req.body;

  if (!nis || !password) {
    return res.status(400).json({
      success: false,
      message: "ID dan password harus diisi",
    });
  }

  try {
    // 1. Cek apakah admin
    const [adminRows] = await pool.query("SELECT * FROM admin WHERE nis = ?", [nis]);

    if (adminRows.length > 0) {
      const admin = adminRows[0];
      if (admin.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Password salah",
        });
      }

      const { password: _, ...adminWithoutPassword } = admin;
      return res.status(200).json({
        success: true,
        role: "admin",
        data: adminWithoutPassword,
      });
    }

    // 2. Kalau bukan admin, cek apakah siswa berdasarkan ID (nis == id)
    const [siswaRows] = await pool.query("SELECT * FROM db_siswa WHERE id = ?", [nis]);

    if (siswaRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
      });
    }

    const siswa = siswaRows[0];
    if (siswa.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Password salah",
      });
    }

    const { password: _, ...siswaWithoutPassword } = siswa;

    return res.status(200).json({
      success: true,
      role: "siswa",
      data: siswaWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};


exports.getPassword = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT password FROM password_edit LIMIT 1");
    if (rows.length > 0) {
      res.json({ password: rows[0].password });
    } else {
      res.status(404).json({ error: "Password tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyPassword = async (req, res) => {
  const { password } = req.body;
  
  try {
    const [rows] = await pool.query("SELECT password FROM password_edit LIMIT 1");
    if (rows.length === 0) {
      return res.status(404).json({ error: "Tidak ada password tersimpan" });
    }
    
    const correctPassword = rows[0].password;
    
    if (password === correctPassword) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const penympanan = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder penyimpanan
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Filter untuk validasi file
const filterFile = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Jenis file tidak diizinkan'), false);
  }
};

const post = multer({ penympanan, filterFile });

