const express = require('express');
const router = express.Router();
const path = require("path");
const siswaController = require('../controllers/siswaController');
const upload = require('../middleware/upload.js');

router.post('/siswa', upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'portofolio_foto', maxCount: 1 }
]), siswaController.addSiswa);

router.put('/siswa/update/:id', upload.fields([
  { name: 'foto', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
  { name: 'portofolio_foto', maxCount: 1 }
]), siswaController.updateSiswa);

router.get('/siswa/angkatan/:angkatan', siswaController.getSiswaByAngkatan);

router.get("/siswa/angkatan", siswaController.getAvailableAngkatan);

router.get('/siswa/:id', siswaController.getSiswaDetail);

router.get('/getsiswa', siswaController.getAll);
// Upload foto dan CV saat tambah project

router.delete('/siswa/:id', siswaController.deleteSiswa);

//pengalaman

router.post('/pengalaman', upload.fields([
  { name: 'foto', maxCount: 1 }
]), siswaController.addPengalaman);
router.get('/pengalaman/:id', siswaController.getPengalamanBySiswaId);
router.get('/pengalaman', siswaController.getPengalamanAll);
router.put('/editpengalaman/:id', upload.fields([
  { name: 'foto', maxCount: 1 }
]), siswaController.updatePengalaman);
router.delete('/pengalaman/:id', siswaController.deletePengalaman);
//project
router.post('/project/upload', upload.fields([
  { name: 'foto', maxCount: 1 }
]), siswaController.addProjectWithUpload);

router.get('/projects/', siswaController.getProjectAll);

router.put('/project/:id', upload.fields([
  { name: 'foto', maxCount: 1 }
]), siswaController.updateProject);

router.delete('/delproject/:id', siswaController.deleteProject);

router.post('/keahlian', upload.fields([
  { name: 'foto', maxCount: 1 }
]), siswaController.addKeahlian);

router.get('/getkeahlian/', siswaController.getAllKeahlian);

router.put('/keahlian/:id', upload.fields([
  { name: 'foto', maxCount: 1 }
]), siswaController.updateKeahlian);
module.exports = router;

router.delete('/delkeahlian/:id', siswaController.deleteKeahlian);
router.post('/project_pending', upload.fields([
  { name: 'foto', maxCount: 1 }
]),siswaController.addProjectPending);
router.put('/approve_project/:id', siswaController.approveProjectPending);
router.get('/getproject_pending', siswaController.getProjectPending);
router.delete('/delproject-pending/:id', siswaController.deleteProjectPending);
router.put('/update_project_pending/:id', upload.fields([
  { name: 'foto', maxCount: 1 }
]), siswaController.updateProjectPending);
router.post('/siswa_pending', upload.single('foto'), siswaController.addSiswaPending);
router.get('/getsiswa_pending', siswaController.getSiswaPending)
router.put('/approve_siswa/:id', siswaController.approveSiswaPending);
router.delete('/delsiswa-pending/:id', siswaController.deleteSiswaPending);
router.post('/pengalaman_pending', upload.single('foto'), siswaController.addPengalamanPending);
router.get('/getpengalaman_pending', siswaController.getPengalamanPending);
router.put('/approve_pengalaman/:id', siswaController.approvePengalamanPending);
router.delete('/delpengalaman-pending/:id', siswaController.deletePengalamanPending);
router.put("/update_pengalaman_pending/:id", siswaController.updatePengalamanPending);
router.post('/verify-password', siswaController.verifyPassword); // POST untuk verifikasi password admin
router.post("/testimoni", siswaController.createTestimoni);
router.get("/testimoni", siswaController.getAllTestimoni);
 // Sesuaikan path

router.post('/login', siswaController.adminLogin); // POST agar kirim nis & password
router.get('/password_edit', siswaController.getPassword); // GET untuk mengambil semua siswa



