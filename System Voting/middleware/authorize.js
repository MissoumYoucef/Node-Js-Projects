const authorizeRole = (role) => (req, res, next) => {
  // 2. Role Check
  if (!req.user || req.user.role !== role) {
    console.log("Role mismatch:", user.role, "vs.", role); 
    return res.status(403).json({ message: 'Forbidden - Insufficient privileges' });
  }
    console.log('authorized');
    next();
  };
  

module.exports = authorizeRole;
  