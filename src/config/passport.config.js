const passport = require('passport');
const github = require('passport-github2')
const SpotifyStrategy = require('passport-spotify').Strategy;
const UserModel = require('../dao/db/mongo/models/users.model')

const initPassport = () => {
    passport.use('github', new github.Strategy(
        {
            clientID: "Iv1.15c5ac9e6f92f333",
            clientSecret: "4b42aebe4032e0d73399d43281069093beceea9e",
            callbackURL: "http://localhost:8080/api/sessions/callback"
        },
        async ( accessToken, refreshToken, profile, done)=> {
            try{
                let {name, email} = profile._json;
                let user = await UserModel.findOne({email});
                
                if(!user){                    
                    user = await UserModel.create({
                        first_name: name,
                        email,
                        profilePicture: profile._json.avatar_url,
                        github: profile
                    });
                } else {
                    user.first_name = name;
                    user.profilePicture = profile._json.avatar_url;
                    user.github = profile;
                    await user.save();
                }

                return done(null, user)
            } catch(error)  {
                return done(error)
            }
        }
    ))

    passport.use('spotify', new SpotifyStrategy(
        {
            clientID: "45259f3a7e8a4aec854271a74e4ed734",
            clientSecret: "c02b85d2598646df9c9fa8a01892e155",
            callbackURL: "http://localhost:8080/api/sessions/callback/spotify"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let { id, displayName, emails, photos } = profile;
                let email = emails && emails.length > 0 ? emails[0].value : null;

                let user = await UserModel.findOne({ spotifyId: id });

                if (!user) {
                    user = await UserModel.create({
                        first_name: displayName,
                        email,
                        profilePicture: photos && photos.length > 0 ? photos[0].value : null,
                        spotify: profile
                    });
                } else {
                    user.first_name = displayName;
                    user.profilePicture = photos && photos.length > 0 ? photos[0].value : null;
                    user.spotify = profile;
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
}

passport.serializeUser((user, done)=>{
    done(null, user);
})

passport.deserializeUser((user, done)=>{
    done(null, user);
})

module.exports = initPassport;