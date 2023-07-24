const isNullOrUndefined = (data) => {
    if (data === undefined || data === null) {
        return true;
    } else {
        return false;
    }
}

const CoreUtils = {
    isNullOrUndefined: isNullOrUndefined,
}

export default CoreUtils;