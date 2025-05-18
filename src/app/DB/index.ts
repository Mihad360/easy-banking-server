import { User } from "../modules/User/user.model";

const superUser = {
  customerId: 'A-001',
  email: "ahmedmihad962@gmail.com",
  password: "botmiyad360",
  role: "admin",
};

const seedSuperAdmin = async () => {
  const isSuperAdminExist = await User.findOne({
    email: superUser.email,
  });
  if (!isSuperAdminExist) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
