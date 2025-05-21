const { v4: uuidv4 } = require('uuid');
const pool = require('../models/db');
const multer = require('multer');
const path = require('path');

exports.addProjectWithUpload = async (req, res) => {
  const { name_project, db_siswa_id, link_web } = req.body; // 🟢 tambahkan link_porto
  const foto = req.files.foto ? req.files.foto[0].filename : null;

  try {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO project (id, name_project, db_siswa_id, foto, link_web) VALUES (?, ?, ?, ?, ?)',
      [id, name_project, db_siswa_id, foto, link_web || '']
    );
    res.json({ message: 'Project dengan upload berhasil ditambahkan', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



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
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Jenis file tidak diizinkan'), false);
  }
};

const upload = multer({ storage, fileFilter });


exports.addSiswa = async (req, res) => {
  const { name, angkatan, favorit, link_porto } = req.body;
  const foto = req.files.foto ? req.files.foto[0].filename : null;
  const cv = req.files.cv ? req.files.cv[0].filename : null;
  try {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO db_siswa (id, name, angkatan, favorit, link_porto, cv, foto) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, angkatan, favorit, link_porto, cv, foto || '']
    );
    res.json({ message: 'Siswa berhasil ditambahkan', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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


exports.getSiswaByAngkatan = async (req, res) => {
  const { angkatan } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM db_siswa WHERE angkatan = ?', [angkatan]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM project WHERE id = ?', [id]);
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
    res.json({ siswa: siswa[0], projects });
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
