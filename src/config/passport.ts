import passport from "passport";
import {
  Strategy as Googlestrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { configEnv } from "./env";
import { User } from "../app/modules/Users/user.model";
import { UserRole } from "../app/modules/Users/user.interface";

// Serialize user for session storage
passport.serializeUser((user: Express.User, done) => {
  try {
    // Store only the user ID in the session
    const userId =
      (user as { _id?: string; id?: string })._id ||
      (user as { _id?: string; id?: string }).id;
    done(null, userId);
  } catch (error) {
    done(error);
  }
});

// Deserialize user from session storage
passport.deserializeUser(async (id: string, done) => {
  try {
    // Fetch user from database using the stored ID
    const user = await User.findById(id).select("-password");

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new Googlestrategy(
    {
      clientID: configEnv.GOOGLE_CLIENT_ID,
      clientSecret: configEnv.GOOGLE_CLIENT_SECRET,
      callbackURL: configEnv.GOOGLE_CALL_BACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "No email found" });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: UserRole.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
