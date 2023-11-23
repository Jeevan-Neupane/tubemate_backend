import { asyncHandler } from "../utils/asyncHandler.js";



const registerUser = asyncHandler(
    async (req, res) => {
        //?get user details info

        //?Validation --- not empty
        //?Check if user already exist :username,email
        //?Check for images ,check for avatar 
        //?upload them to the coludinary
        //?create user object -create entry in db
        //?remove password and refersh token field from response
        //?Check for user creation
        //?return res


        // const { fullName, email, username, password } = req.body;

        res.send("Hello From Youtube Backend");




    }
)










export { registerUser }