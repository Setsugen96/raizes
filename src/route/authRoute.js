import { Router } from "express";
import AuthController from "../controller/authController.js"

const AuthRota = Router()

// Login 
AuthRota.post('/auth/login', AuthController.login)


export default AuthRota
