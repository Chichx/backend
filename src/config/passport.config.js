const passport = require('passport');
const github = require('passport-github2')
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
                        password: null,
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
}

passport.serializeUser((user, done)=>{
    done(null, user);
})

passport.deserializeUser((user, done)=>{
    done(null, user);
})

module.exports = initPassport;