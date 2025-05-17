import { UserModel } from "../modules/User/user.model";

const superUser = {
  name: {
    firstName: "Montasir",
    lastName: "Mihad",
  },
  email: "ahmedmihad962@gmail.com",
  password: "botmiyad360",
  role: "admin",
  phoneNumber: "+8801604223336",
  address: "Adamjinagar, Siddhirgonj, Narayangonj",
};

const seedSuperAdmin = async () => {
  const isSuperAdminExist = await UserModel.findOne({
    email: "ahmedmihad962@gmail.com",
  });
  if (!isSuperAdminExist) {
    await UserModel.create(superUser);
  }
};

export default seedSuperAdmin;
