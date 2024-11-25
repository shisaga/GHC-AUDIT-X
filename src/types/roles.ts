/* eslint-disable no-unused-vars */
export enum USER_ROLE {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  AUDITOR = "AUDITOR",
  CONTRACTOR = "CONTRACTOR",
  SO = "SO",
}

export const userRoles: Array<{ label: string; role: USER_ROLE }> = [
  {
    label: "Admin",
    role: USER_ROLE.ADMIN,
  },
  {
    label: "Manager",
    role: USER_ROLE.MANAGER,
  },
  {
    label: "Auditor",
    role: USER_ROLE.AUDITOR,
  },
  {
    label: "Contractor",
    role: USER_ROLE.CONTRACTOR,
  },
];

export const roleCheck = (
  role:
    | USER_ROLE.ADMIN
    | USER_ROLE.MANAGER
    | USER_ROLE.AUDITOR
    | USER_ROLE.CONTRACTOR
    | string
    | undefined,
  accessRoles: [
    | USER_ROLE.ADMIN
    | USER_ROLE.MANAGER
    | USER_ROLE.AUDITOR
    | USER_ROLE.CONTRACTOR,
  ]
) => {
  if (role) {
    return accessRoles.includes(
      role as
        | USER_ROLE.ADMIN
        | USER_ROLE.MANAGER
        | USER_ROLE.AUDITOR
        | USER_ROLE.CONTRACTOR
    );
  }
  return false;
};

export const getUserRole = (role: string) => {
  const data: any = {
    ADMIN: 1,
    MANAGER: 2,
    AUDITOR: 3,
    CONTRACTOR: 4,
    SO: 5,
  };
  return data[`${role}`];
};
