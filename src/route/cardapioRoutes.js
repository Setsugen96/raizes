import { Router } from "express";
import CardapioController from "../controller/cardapioController.js";

const CardapioRota = Router()

// POST  
CardapioRota.post('/cardapios', CardapioController.store)

// GETS
CardapioRota.get('/cardapios/:id', CardapioController.show)
CardapioRota.get('/cardapios', CardapioController.index)

//UPDATE
CardapioRota.put('/cardapios/:id', CardapioController.update)

// DELETE
CardapioRota.delete('/cardapios/:id', CardapioController.delete)

export default CardapioRota
