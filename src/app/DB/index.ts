import mongoose from "mongoose";
import { AdminModel } from "../modules/Admin/admin.model";
import { User } from "../modules/User/user.model";

const superUser = {
  adminId: "A-001",
  email: "ahmedmihad962@gmail.com",
  password: "botmiyad360",
  role: "admin",
};

const admin = {
  adminId: "A-001",
  name: {
    firstName: "Montasir",
    lastName: "Mihad",
  },
  email: "ahmedmihad962@gmail.com",
  password: "botmiyad360",
  phoneNumber: "+524352115242544",
  profilePhotoUrl:
    "https://i.ibb.co/MHpMRvT/c9c023a7-7a94-4101-b73e-c4b5bea09c38-enhanced.png",
};

const seedSuperAdmin = async () => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const isSuperAdminExist = await User.findOne({
      email: superUser.email,
    });
    const isAdminExist = await AdminModel.findOne({
      adminId: isSuperAdminExist?.adminId,
    });
    let addUserAdmin;
    if (!isSuperAdminExist) {
      addUserAdmin = await User.create([superUser], { session });
    }
    let addAdmin;
    if (!isAdminExist) {
      addAdmin = await AdminModel.create(
        [
          {
            ...admin,
            user: addUserAdmin?.[0]._id,
          },
        ],
        { session },
      );
    }
    await session.commitTransaction();
    await session.endSession();
    return addAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    console.log(error);
  }
};

export default seedSuperAdmin;
