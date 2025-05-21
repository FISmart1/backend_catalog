const express = require('express');
const router = express.Router();
const siswaController = require('../controllers/siswaController');
const upload = require('../middleware/upload.js');
router.get('/siswa/angkatan/:angkatan', siswaController.getSiswaByAngkatan);
router.get('/siswa/:id', siswaController.getSiswaDetail);
router.post('/siswa', upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]), siswaController.addSiswa);
router.get('/projects/', siswaController.getProjectAll);
 // Sesuaikan path

// Upload foto dan CV saat tambah project
router.post('/project/upload', upload.fields([
  { name: 'foto', maxCount: 1 }
]), siswaController.addProjectWithUpload);


module.exports = router;
