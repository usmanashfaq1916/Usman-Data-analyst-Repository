export type Resource =
  | "dashboard"
  | "students"
  | "teachers"
  | "employees"
  | "departments"
  | "programs"
  | "subjects"
  | "classes"
  | "timetable"
  | "attendance"
  | "exams"
  | "marks"
  | "fees"
  | "finance"
  | "payroll"
  | "leaves"
  | "notices"
  | "reports"
  | "settings"
  | "users"
  | "institutes";

export type Action = "create" | "read" | "update" | "delete" | "approve" | "manage";

export type Role = "SUPER_ADMIN" | "ADMIN" | "CHAIRMAN" | "DIRECTOR" | "PRINCIPAL" | "HOD" | "TEACHER" | "HR" | "STUDENT" | "PARENT";

const PERMISSION_MATRIX: Record<Role, Partial<Record<Resource, Action[]>>> = {
  SUPER_ADMIN: {
    dashboard: ["read"],
    institutes: ["manage"],
    users: ["manage"],
    departments: ["manage"],
    programs: ["manage"],
    subjects: ["manage"],
    classes: ["manage"],
    attendance: ["read", "manage"],
    exams: ["manage"],
    marks: ["read", "manage"],
    fees: ["read", "manage"],
    finance: ["read", "manage"],
    payroll: ["manage"],
    leaves: ["manage"],
    notices: ["manage"],
    reports: ["read", "manage"],
    settings: ["manage"],
    students: ["manage"],
    teachers: ["manage"],
    employees: ["manage"],
    timetable: ["manage"],
  },
  ADMIN: {
    dashboard: ["read"],
    institutes: ["read"],
    users: ["manage"],
    departments: ["manage"],
    programs: ["manage"],
    subjects: ["manage"],
    classes: ["manage"],
    attendance: ["read", "manage"],
    exams: ["manage"],
    marks: ["read", "manage"],
    fees: ["read", "manage"],
    finance: ["read", "manage"],
    payroll: ["manage"],
    leaves: ["manage"],
    notices: ["manage"],
    reports: ["read", "manage"],
    settings: ["read", "update"],
    students: ["manage"],
    teachers: ["manage"],
    employees: ["manage"],
    timetable: ["manage"],
  },
  CHAIRMAN: {
    dashboard: ["read"],
    departments: ["read"],
    finance: ["read"],
    reports: ["read"],
    students: ["read"],
    teachers: ["read"],
    employees: ["read"],
    fees: ["read"],
    attendance: ["read"],
    exams: ["read"],
    marks: ["read"],
    institutes: ["read"],
    notices: ["read"],
    leaves: ["approve"],
  },
  DIRECTOR: {
    dashboard: ["read"],
    departments: ["read", "update"],
    students: ["read"],
    teachers: ["read"],
    employees: ["read"],
    attendance: ["read"],
    exams: ["read"],
    marks: ["read"],
    programs: ["read", "update"],
    reports: ["read"],
    subjects: ["read"],
    classes: ["read"],
    timetable: ["read"],
    leaves: ["approve"],
    notices: ["create"],
  },
  PRINCIPAL: {
    dashboard: ["read"],
    students: ["manage"],
    teachers: ["read", "update"],
    attendance: ["read", "manage"],
    exams: ["manage"],
    marks: ["read", "manage"],
    classes: ["manage"],
    timetable: ["manage"],
    departments: ["read"],
    programs: ["read"],
    subjects: ["read"],
    reports: ["read"],
    fees: ["read"],
    notices: ["create", "manage"],
    leaves: ["approve"],
  },
  HOD: {
    dashboard: ["read"],
    teachers: ["read"],
    subjects: ["read", "update"],
    attendance: ["read"],
    marks: ["read"],
    students: ["read"],
    classes: ["read"],
    timetable: ["read"],
    exams: ["read"],
    programs: ["read"],
    reports: ["read"],
  },
  TEACHER: {
    dashboard: ["read"],
    students: ["read"],
    attendance: ["create", "read"],
    marks: ["create", "read"],
    exams: ["read"],
    classes: ["read"],
    timetable: ["read"],
    subjects: ["read"],
  },
  HR: {
    dashboard: ["read"],
    employees: ["manage"],
    leaves: ["manage"],
    payroll: ["manage"],
    attendance: ["read"],
    reports: ["read"],
    notices: ["create"],
  },
  STUDENT: {
    dashboard: ["read"],
    attendance: ["read"],
    marks: ["read"],
    fees: ["read"],
    subjects: ["read"],
    timetable: ["read"],
  },
  PARENT: {
    dashboard: ["read"],
    attendance: ["read"],
    marks: ["read"],
    fees: ["read"],
  },
};

export function hasPermission(role: string, resource: Resource, action: Action): boolean {
  const roleKey = role as Role;
  const permissions = PERMISSION_MATRIX[roleKey];
  if (!permissions) return false;
  const actions = permissions[resource];
  if (!actions) return false;
  return actions.includes("manage") || actions.includes(action);
}

export function canAccess(role: string, resource: Resource, action: Action): boolean {
  return hasPermission(role, resource, action);
}

export function getRoleHierarchy(role: string): number {
  const hierarchy: Record<string, number> = {
    SUPER_ADMIN: 100,
    ADMIN: 90,
    CHAIRMAN: 80,
    DIRECTOR: 70,
    PRINCIPAL: 60,
    HOD: 50,
    TEACHER: 40,
    HR: 35,
    STUDENT: 10,
    PARENT: 5,
  };
  return hierarchy[role] ?? 0;
}

export function isHigherRank(roleA: string, roleB: string): boolean {
  return getRoleHierarchy(roleA) > getRoleHierarchy(roleB);
}
