const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.log("Error Details:", {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode
    });

    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        // In production, you might want to hide the stack trace
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export default globalErrorHandler;
