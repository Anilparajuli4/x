import jwt from 'jsonwebtoken'

export const  generateTokenAndSetCookie = (userid, res) =>{
   const token = jwt.sign({userid}, process.env.JWT_SECRET)

   res.cookie("jwttoken", token , {
    httpOnly:true,
    secure:true,
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    maxAge: 15 * 24 * 60 * 60 * 1000, //MS
   })
}