import { Request, Response, NextFunction } from "express";
import {
  listEmployees, getEmployeeById, getMyEmployee,
  createEmployee, updateEmployee, toggleEmployeeStatus,
  assignShift, assignLoginAccount, listDepartments, listShifts,
} from "../services/employee.service";
import { successResponse } from "../utils/response";
import { auditCtx } from "../utils/auditCtx";
import { writeAudit } from "../services/audit.service";

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await listEmployees({
      page:         Number(req.query.page)  || 1,
      limit:        Number(req.query.limit) || 20,
      search:       req.query.search       as string,
      departmentId: req.query.departmentId as string,
      shiftId:      req.query.shiftId      as string,
      isActive:     req.query.isActive     as string,
    });
    res.json(successResponse("Employees fetched", result));
  } catch (err) { next(err); }
}

export async function show(req: Request, res: Response, next: NextFunction) {
  try {
    // EMPLOYEE role can only see own record
    const selfId = req.user!.role === "EMPLOYEE" ? req.user!.userId : undefined;
    const emp = await getEmployeeById(req.params.id, selfId);
    res.json(successResponse("Employee fetched", emp));
  } catch (err) { next(err); }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const emp = await getMyEmployee(req.user!.userId);
    res.json(successResponse("Employee profile fetched", emp));
  } catch (err) { next(err); }
}

export async function store(req: Request, res: Response, next: NextFunction) {
  try {
    const emp = await createEmployee(req.body);
    writeAudit({ ctx: auditCtx(req, req.user?.userId), action: "CREATE", module: "employee", recordId: emp.id, recordLabel: `${emp.employeeId} — ${emp.nameBn}` });
    res.status(201).json(successResponse("Employee created", emp));
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const emp = await updateEmployee(req.params.id, req.body);
    writeAudit({ ctx: auditCtx(req, req.user?.userId), action: "UPDATE", module: "employee", recordId: emp.id, recordLabel: emp.nameBn });
    res.json(successResponse("Employee updated", emp));
  } catch (err) { next(err); }
}

export async function toggleStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const emp = await toggleEmployeeStatus(req.params.id);
    writeAudit({ ctx: auditCtx(req, req.user?.userId), action: "STATUS_CHANGE", module: "employee", recordId: emp.id, recordLabel: emp.nameBn });
    res.json(successResponse("Status updated", emp));
  } catch (err) { next(err); }
}

export async function setShift(req: Request, res: Response, next: NextFunction) {
  try {
    const emp = await assignShift(req.params.id, req.body);
    writeAudit({ ctx: auditCtx(req, req.user?.userId), action: "UPDATE", module: "employee", recordId: emp.id, recordLabel: `${emp.nameBn} — shift changed`, meta: req.body });
    res.json(successResponse("Shift assigned", emp));
  } catch (err) { next(err); }
}

export async function setAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const emp = await assignLoginAccount(req.params.id, req.body);
    res.json(successResponse("Login account assigned", emp));
  } catch (err) { next(err); }
}

export async function getDepartments(_req: Request, res: Response, next: NextFunction) {
  try {
    const depts = await listDepartments();
    res.json(successResponse("Departments fetched", depts));
  } catch (err) { next(err); }
}

export async function getShifts(_req: Request, res: Response, next: NextFunction) {
  try {
    const shifts = await listShifts();
    res.json(successResponse("Shifts fetched", shifts));
  } catch (err) { next(err); }
}
