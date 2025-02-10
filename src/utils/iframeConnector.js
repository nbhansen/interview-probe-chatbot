export const sendMessageToParent = (payload, origin) => {
    const targetOrigin = origin ? origin : '*';
    const stringifiedPayload = JSON.stringify(payload);

    window.parent.postMessage(stringifiedPayload, targetOrigin);
} 

export const onParentMessage = (messageHandler) => {
    window.addEventListener('message', messageHandler);
}
