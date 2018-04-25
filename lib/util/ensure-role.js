module.exports = function(requiredRole) {
    return (req, res, next) => {
        if(req.reviewer.roles.every(role => role !== requiredRole)) {
            next({
                status: 403,
                error: `Requires ${requiredRole} authorization`
            });
        }
        else next();
    };
};