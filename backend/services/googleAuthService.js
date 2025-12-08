import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const googleLogin = async (profile) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = new User({
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        alias: profile.emails[0].value.split("@")[0], // Or generate a unique alias
      });
      await user.save();
    }

    const token = generateToken({ id: user._id, role: user.role });
    return { token, user };
  } catch (error) {
    throw new Error(error.message || "Error logging in with Google");
  }
};