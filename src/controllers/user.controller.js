import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

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


        const { fullName, email, username, password } = req.body;

        if ([fullName, email, username, password].some((field) => {
            return field?.trim() === ""
        })) {
            throw new ApiError(400, "All field is required");
        }



        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existedUser) {
            throw new ApiError(409, "User with email or username already exist");
        }



        const avatarLocalPath = req.files?.avatar[0]?.path;
        //const coverImageLocalPath = req.files?.coverImage[0]?.path;
        let coverImageLocalPath;

        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files.coverImage[0].path;
        }
        console.log(avatarLocalPath);

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar filed is required");
        }


        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);


        if (!avatar) {
            throw new ApiError(400, "Avatar filed is required");
        }

        const user = await User.create({
            fullName,
            avatar: avatar?.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        })


        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )


        if (!createdUser) {
            throw new ApiError(500, "Error while registering user");
        }



        return res.status(201).json(
            new ApiResponse(200, createdUser, "User register successfully")
        )






    }
)

const loginUser = asyncHandler(async (req, res) => {
    //req body-->data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookie


    const { username, email, password } = req.body;

    if (!username || !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{
            username
        },
        { email }
        ]
    })

    if (!user) {
        throw new ApiError(404, "User doesn't exists");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(404, "Invalid user credentials");

    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }



    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(
            200, {
            user: loggedInUser,
            accessToken,
            refreshToken
        },
            "User logged in successfully"
        )
    )


})



const logoutUser=asyncHandler(async(req,res)=>{
    
})




export { registerUser, loginUser }