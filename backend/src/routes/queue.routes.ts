import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as C from "../controllers/queue.controller";

const router = Router();

const STAFF = ["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTION"] as const;

// ── Public (no auth) ──────────────────────────────────────────────────────────
router.get("/public/doctors",                    C.publicDoctors);
router.get("/public/doctors/:doctorId/sessions", C.publicSessions);
router.get("/public/sessions/:sessionId/serial", C.publicSerial);

// ── Authenticated staff ───────────────────────────────────────────────────────
router.get("/sessions",                          authenticate, authorize(...STAFF), C.listSessions);
router.post("/sessions",                         authenticate, authorize("SUPER_ADMIN", "ADMIN", "RECEPTION"), C.createSession);
router.patch("/sessions/:id/action/:action",     authenticate, authorize(...STAFF), C.sessionAction);
router.patch("/sessions/:id/public",             authenticate, authorize("SUPER_ADMIN", "ADMIN"), C.togglePublic);

router.get("/sessions/:sessionId/entries",       authenticate, authorize(...STAFF), C.getEntries);
router.post("/sessions/:sessionId/entries",      authenticate, authorize(...STAFF), C.addEntry);
router.post("/sessions/:sessionId/call-next",    authenticate, authorize(...STAFF), C.callNext);

router.patch("/entries/:entryId/complete",       authenticate, authorize(...STAFF), C.completeEntry);
router.patch("/entries/:entryId/skip",           authenticate, authorize(...STAFF), C.skipEntry);
router.patch("/entries/:entryId/restore",        authenticate, authorize("SUPER_ADMIN", "ADMIN", "RECEPTION"), C.restoreEntry);

export default router;
