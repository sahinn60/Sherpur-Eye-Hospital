import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as ctrl from "../controllers/inventory.controller";

const router = Router();
const access = [authenticate, authorize("SUPER_ADMIN", "ADMIN", "ACCOUNTANT")];
const readAccess = [authenticate, authorize("SUPER_ADMIN", "ADMIN", "ACCOUNTANT", "DOCTOR", "RECEPTION")];

// Summary & Alerts
router.get("/summary",  readAccess, ctrl.getSummary);
router.get("/alerts",   readAccess, ctrl.getAlerts);
router.get("/sku",      access,     ctrl.generateSku);

// Suppliers
router.get("/suppliers",          readAccess, ctrl.listSuppliers);
router.post("/suppliers",         access,     ctrl.createSupplier);
router.patch("/suppliers/:id",    access,     ctrl.updateSupplier);
router.patch("/suppliers/:id/toggle", access, ctrl.toggleSupplier);

// Items
router.get("/",          readAccess, ctrl.listItems);
router.get("/:id",       readAccess, ctrl.getItem);
router.post("/",         access,     ctrl.createItem);
router.patch("/:id",     access,     ctrl.updateItem);
router.patch("/:id/toggle", access,  ctrl.toggleItem);

// Stock
router.post("/:id/stock",          access, ctrl.adjustStock);
router.get("/:id/stock/history",   readAccess, ctrl.getStockHistory);

export default router;
