import { User } from "./user.model";

const findLastCustomer = async () => {
  const result = await User.findOne(
    {
      role: "customer",
    },
    {
      customerId: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();
  return result?.customerId ? result?.customerId : undefined;
};

export const generateCustomerId = async () => {
  let currentId = (0).toString();
  const lastCustomerId = await findLastCustomer();
  if (lastCustomerId) {
    currentId = lastCustomerId.split("-")[1];
    let incrementId = (Number(currentId) + 1).toString().padStart(3, "0");
    incrementId = `CUS-${incrementId}`;
    //   console.log(incrementId)
    return incrementId;
  } else {
    return "CUS-001";
  }
};

const findLastManager = async () => {
  const result = await User.findOne(
    {
      role: "manager",
    },
    {
      managerId: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();
  return result?.managerId ? result?.managerId : undefined;
};

export const generateManagerId = async () => {
  let currentId = (0).toString();
  const lastCustomerId = await findLastManager();
  if (lastCustomerId) {
    currentId = lastCustomerId.split("-")[1];
    let incrementId = (Number(currentId) + 1).toString().padStart(3, "0");
    incrementId = `MAN-${incrementId}`;
    //   console.log(incrementId)
    return incrementId;
  } else {
    return "MAN-001";
  }
};

const findLastAdmin = async () => {
  const result = await User.findOne(
    {
      role: "admin",
    },
    {
      adminId: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();
  return result?.adminId ? result?.adminId : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdmin();
  if (lastAdminId) {
    currentId = lastAdminId.split("-")[1];
    let incrementId = (Number(currentId) + 1).toString().padStart(3, "0");
    incrementId = `A-${incrementId}`;
    //   console.log(incrementId)
    return incrementId;
  } else {
    return "A-001";
  }
};
