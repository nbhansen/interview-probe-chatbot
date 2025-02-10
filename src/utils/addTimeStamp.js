export const addTimeStamp = (obj) => ({
    ...obj,
    timestamp: Date.now()
}) 