const express = require('express');
const router = express.Router();
const siswaController = require('../controllers/siswaController');

router.get('/siswa/angkatan/:angkatan', siswaController.getSiswaByAngkatan);
router.get('/siswa/:id', siswaController.getSiswaDetail);
router.post('/siswa', siswaController.addSiswa);
router.post('/project', siswaController.addProject);
const upload = require('../middleware/upload.js'); // Sesuaikan path

// Upload foto dan CV saat tambah project
router.post('/project/upload', upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]), siswaController.addProjectWithUpload);


module.exports = router;
