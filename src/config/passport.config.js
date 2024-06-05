const passport = require('passport');
const github = require('passport-github2')
const SpotifyStrategy = require('passport-spotify').Strategy;
const UserModel = require('../dao/db/models/users.model')
const config = require("./config")

const initPassport = () => {
    passport.use('github', new github.Strategy(
        {
            clientID: config.GITHUB_CLIENTID,
            clientSecret: config.GITHUB_SECRET,
            callbackURL: `http://localhost:${config.PORT}/api/sessions/callback`
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
                    user.last_connection = new Date();
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
            clientID: config.SPOTIFY_CLIENTID,
            clientSecret: config.SPOTIFY_SECRET,
            callbackURL: `http://localhost:${config.PORT}/api/sessions/callback/spotify`
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
                    user.last_connection = new Date();
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