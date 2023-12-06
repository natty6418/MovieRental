//fucntion replaced by express-async-errors

module.exports = function(handler) {
    return async (req, res, next) => {
        try{
            await handler(req, res);
        }
        catch(ex) {
            next(ex);
        }
    }
}