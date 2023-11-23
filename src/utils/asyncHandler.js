//*using promise

const asyncHandler = (requestHandler) => 
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    
}

export { asyncHandler };



//*Using async and await and try catch
/*const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            res.status(error.code || 500).json({
                success: false,
                message: error.message
            })

        }
    }
}

export { asyncHandler };

*/