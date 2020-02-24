const User = require('../../models/user');

exports.auth = async (req, res) => {
    res.status(200).json({
        success: true,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email,
        role: req.user.role,
        history: req.user.history,
        cart: req.user.cart,
    })
}

exports.register = async (req, res) => {
    try {
        const newUser = new User(req.body)
        let user = await newUser.save();
        return res.status(200).json({ success: true })
    } catch (error) {
        res.status(400).json({ success: false, data: error.message })
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).json({ success: false, data: "Invalid Email!" })

        let isMatch = await user.comparePassword(req.body.password)
        if (!isMatch) return res.status(400).json({ success: false, data: "Invalid Password!" })

        let userWithToken = await user.generateToken()
        res.cookie('w_auth', userWithToken.token).json({ success: true })

    } catch (error) {
        res.status(400).json({ success: false, data: error.message })
    }
}

exports.logout = async (req, res) => {
    try {
        let user = await User.findOneAndUpdate({ _id: req.user._id }, { token: '' }).lean()
        return res.status(200).json({ success: true, data: "User Logged out!" })
    } catch (error) {
        return res.status(400).json({ success: false, data: error.message })
    }
}