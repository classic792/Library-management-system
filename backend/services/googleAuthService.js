import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

export const googleSignup = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const {
      email,
      given_name: firstName,
      family_name: lastName,
      sub: googleId,
    } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        googleId,
        firstName,
        lastName,
        email,
        alias: email.split("@")[0],
      });
      await user.save();
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    const token = generateToken({ id: user._id, role: user.role });
    return { token, user };
  } catch (error) {
    throw new Error(error.message || "Error signing up with Google");
  }
};