const authorizeRole = (role) => (req, res, next) => {
  console.log(role);
    if (req.user.role !== role) {
        console.log('forbidden');
        return res.sendStatus(403);
    }
    console.log('authorized');
    next();
  };
  

module.exports = authorizeRole;
  