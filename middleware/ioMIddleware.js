
function ioMiddleware(io) {
    return function(req, res, next) {
      req.io = io;
      next();
    }
  }
  
  export default ioMiddleware;
  