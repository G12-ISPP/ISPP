import {test} from 'vitest';
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {ChatPage} from '../pages/ChatPage';
import {BrowserRouter as Router, MemoryRouter} from 'react-router-dom';
import ChatComponent from '../components/Chat/ChatComponent';
import '@testing-library/jest-dom';
import {getUser, login} from "../api/users.api";
import {createChatRoom, getMessages} from "../api/chat.api.jsx";
import {act} from 'react-dom/test-utils';
import {AuthProvider} from "../context/AuthContext.jsx";

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND).replace(/"/g, '');

let messages = {
    errors: {
        send: 'Por favor, introduce tu mensaje.'
    },
    labels: {
        send: 'Enviar',
        back: 'Volver',
        messagePlaceholder: 'Escribe un mensaje...'
    }
};

describe('Test para Chat', () => {

    let user1 = undefined;
    let user2 = undefined;
    let token = undefined;
    let chat_room = undefined;

    beforeEach(async () => {
        localStorage.removeItem('token')

        user1 = await (await getUser(12)).json()
        user2 = await (await getUser(13)).json()


        token = (await (await login('test1Frontend', 'test1Frontend')).json()).token;

        localStorage.setItem('token', token);

        chat_room = await (await createChatRoom(token, user1.id, user2.id)).json();

        render(
            <MemoryRouter>
                <AuthProvider>
                    <ChatComponent roomId={chat_room.chatroomID} roomName={user2.username} roomMate={user2.id}/>
                </AuthProvider>
            </MemoryRouter>
        );
    });

    function checkPage() {
        expect(screen.getByText(messages.labels.send)).toBeInTheDocument();
        expect(screen.getByText(messages.labels.back)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(messages.labels.messagePlaceholder)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: messages.labels.send})).toBeInTheDocument();
    }

    function writeMessage(message) {
        fireEvent.change(screen.getByPlaceholderText(messages.labels.messagePlaceholder), {target: {value: message}});
    }

    function sendMessage() {
        let button = screen.getByText(messages.labels.send);
        button.click();
    }

    async function checkMessage(message) {
        let messages_chat;
        await act(async () => {
            messages_chat = await (await getMessages(token, chat_room.chatroomID)).json();
        });

        expect(messages_chat.some(msg => {
            console.log("====");
            console.log(msg.content);
            console.log(message);

            return msg.content == message
        })).toBe(true);

    }

    test('Renderiza', async () => {
        render(<Router><ChatPage/></Router>);
    });

    test('Comprueba estado de la página', async () => {
        checkPage();
    });

    test(`Enviar mensaje normal`, async () => {
        // Simular la escritura de un mensaje en el input
        writeMessage('Hello, World!¡Hola, Mundo!123345');

        // Simular el clic en el botón de enviar
        sendMessage();

        // Esperar a que aparezca el mensaje enviado
        await checkMessage('Hello, World!¡Hola, Mundo!123345');
    });

    test(`Enviar mensaje con caracteres especiales`, async () => {
        // Simular la escritura de un mensaje en el input
        writeMessage('!@#$%^&*()_+{}|:"<>?`-=[]\;\',.😊🚀🌟🍕🍔🍟🌮🍿🥤');

        // Simular el clic en el botón de enviar
        sendMessage();

        // Esperar a que aparezca el mensaje enviado
        checkMessage('!@#$%^&*()_+{}|:"<>?`-=[]\;\',.😊🚀🌟🍕🍔🍟🌮🍿🥤');
    });

    test(`Enviar mensaje largo`, async () => {
        // Simular la escritura de un mensaje en el input
        writeMessage('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fringilla lacinia risus, ac convallis ex ultrices in. Nullam ut ex quis sapien tincidunt rhoncus id at ligula. Nam volutpat nulla sed nibh malesuada vehicula. Sed id arcu at libero lacinia ultricies sit amet id nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et tortor sem. Ut vestibulum felis nisi, vel efficitur leo suscipit ac. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fringilla lacinia risus, ac convallis ex ultrices in. Nullam ut ex quis sapien tincidunt rhoncus id at ligula. Nam volut pat nulla sed nibh malesuada vehicula. Sed id arcu at libero lacinia ultricies sit amet id nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et tortor sem. Ut vestibulum felis nisi, vel efficitur leo suscipit ac.');

        // Simular el clic en el botón de enviar
        sendMessage();

        // Esperar a que aparezca el mensaje enviado
        checkMessage('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fringilla lacinia risus, ac convallis ex ultrices in. Nullam ut ex quis sapien tincidunt rhoncus id at ligula. Nam volutpat nulla sed nibh malesuada vehicula. Sed id arcu at libero lacinia ultricies sit amet id nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et tortor sem. Ut vestibulum felis nisi, vel efficitur leo suscipit ac. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fringilla lacinia risus, ac convallis ex ultrices in. Nullam ut ex quis sapien tincidunt rhoncus id at ligula. Nam volut pat nulla sed nibh malesuada vehicula. Sed id arcu at libero lacinia ultricies sit amet id nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et tortor sem. Ut vestibulum felis nisi, vel efficitur leo suscipit ac.');
    });
});
