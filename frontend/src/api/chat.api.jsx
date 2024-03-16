const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND).replace(/"/g, '');

export const createChatRoom = (token, currentUserID, otherUserID) => {
    return fetch(backend + '/chat/chatroom/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentUserID, otherUserID })
    });
}

export const getMessages = (token, roomID) => {
    return fetch(backend + '/chat/' + roomID + '/messages/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

}