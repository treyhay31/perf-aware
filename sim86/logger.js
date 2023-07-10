const is_logger_on = true

const log = (message, ...args) => {
    if (is_logger_on) {
        console.log(message, ...args)
    }
}

export default log