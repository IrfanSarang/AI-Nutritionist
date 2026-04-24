"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const profileFetchController_1 = require("../controllers/profileFetchController");
const planController_1 = require("../controllers/planController");
const nameController_1 = require("../controllers/nameController");
const forgetPassController_1 = require("../controllers/forgetPassController");
const router = express_1.default.Router();
//User Authentication
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
//ProfileManagement
router.post('/addProfile', userController_1.addProfile);
router.get('/:userId/profiles', userController_1.getProfiles);
// Fetch all users + profiles (admin/global)
router.get('/fetchData', userController_1.fetchData);
//deleteing profile
router.delete('/:userId/profiles/:profileId', userController_1.deleteProfile);
//editing profile details + fetchig
router.get('/profile/:id', profileFetchController_1.getProfileById);
router.put('/profile/:id', profileFetchController_1.updateProfileById);
//Fetching meal
router.get('/:userId/:profileId/fetchMeal', planController_1.fetchMeal);
router.post('/:userId/profiles/:profileId/addMeal', planController_1.addMealItem);
router.delete('/:userId/profiles/:profileId/deleteMeal', planController_1.deleteMealItem);
//fetching profile
router.get('/:userId/firstProfile', planController_1.fetchProfile);
//fetching profileName
router.get('/:profileId/fetchName', nameController_1.fetchProfileName);
//forget password
router.post('/forgot-password', forgetPassController_1.forgotPassword);
router.post('/verify-otp', forgetPassController_1.verifyOtp);
router.post('/reset-password', forgetPassController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map