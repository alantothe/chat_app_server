import User from '../models/User.js';
import bcrypt from 'bcryptjs';


export const createUser = async (req, res) => {
    const { firstName, lastName, email, password, avatar} = req.body;
    let user;

    try {
        // check if user already exists
        user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // hash 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            avatar,
            friendRequest: [],
            isOnline: false,
            friends: [],
            conversations:[],
            
            
        });

       const savedUser = await user.save();

          // Emit the event // 
        req.io.emit('new user', JSON.stringify(savedUser));
        
        
        res.status(201).json({ message: 'User registered successfully', user: savedUser   });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export const getUsers = async (req, res) => {
    try{
        let users = await User.find()

        res.json(
            users
        )


    }catch{
        console.log(error);
            res.status(500).json({ error: error.message });
    }
}
