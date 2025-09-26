import express from 'express';
import {
  registerUser,
  loginUser,
  addProfile,
  getProfiles,
  fetchData,
  deleteProfile,
} from '../controllers/userController';

import {
  getProfileById,
  updateProfileById,
} from '../controllers/profileFetchController';

import {
  fetchMeal,
  addMealItem,
  deleteMealItem,
  fetchProfile,
} from '../controllers/planController';

import { fetchProfileName } from '../controllers/nameController';
import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from '../controllers/forgetPassController';

const router = express.Router();

//User Authentication
router.post('/register', registerUser);
router.post('/login', loginUser);

//ProfileManagement
router.post('/addProfile', addProfile);
router.get('/:userId/profiles', getProfiles);

// Fetch all users + profiles (admin/global)
router.get('/fetchData', fetchData);

//deleteing profile
router.delete('/:userId/profiles/:profileId', deleteProfile);

//editing profile details + fetchig
router.get('/profile/:id', getProfileById);
router.put('/profile/:id', updateProfileById);

//Fetching meal
router.get('/:userId/:profileId/fetchMeal', fetchMeal);
router.post('/:userId/profiles/:profileId/addMeal', addMealItem);
router.delete('/:userId/profiles/:profileId/deleteMeal', deleteMealItem);

//fetching profile
router.get('/:userId/firstProfile', fetchProfile);

//fetching profileName
router.get('/:profileId/fetchName', fetchProfileName);

//forget password
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;
