exports.is_authenticated = (req, res, next) => {
    if(!req.user){
        return res.status(401).json({message: "You are not authenticated"})
    }
    next();
}