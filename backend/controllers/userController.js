import User from "../models/users.models.js"

export const getUserDetails = async (req, res) => {
    try {
        // console.log(req);
        // console.log("req. is "+JSON.stringify(req.user));
        // console.log("req.is "+JSON.stringify(req.user._id));
        
        const user = await User.findById(req.user._id); // Find user by ID extracted from the JWT token

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // console.log("user is "+user);
        

        // Return user details excluding password
        const { name, email, profilePhoto, subjects } = user;
        // console.log("user details",{ name, email, profilePhoto, subjects } );
        

        res.json({
            name,
            email,
            profilePhoto,
            subjects, 
        });
    } catch (error) {
        console.log("error is "+
        error);
        
        return res.status(500).json({ message: "Server error" });
    }
};
