import {expect, test, vi} from 'vitest';
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {ChatPage} from '../pages/ChatPage';
import {BrowserRouter as Router} from 'react-router-dom';
import ChatComponent from '../components/Chat/ChatComponent';
import '@testing-library/jest-dom';
import {getUser, login, register} from "../api/users.api";
import {createChatRoom, getMessages} from "../api/chat.api.jsx";
import { act } from 'react-dom/test-utils';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND).replace(/"/g, '');

describe('Test unitarios de Chat', () => {

    function mockFetchWithHeader(object) {
        vi.spyOn(window, 'fetch').mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                headers: {
                    get: vi.fn((headerName) => {
                        if (headerName === 'Authorization') {
                            return `Bearer ${token}`; // Asegúrate de definir `token` en tu prueba
                        } else if (headerName === 'Content-Type') {
                            return 'application/json';
                        }
                    }),
                },
                json: () => Promise.resolve(object),
            })
        );
    }

    test('renderiza ChatComponent sin fallos', () => {
        mockFetchWithHeader({members: [{username: 'user1'}, {username: 'user2'}]});
        const mockFetchMessages = vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({messages: ['message1', 'message2']}),
            })
        );
        const mockFetchUser = vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({user_id: 1}),
            })
        );
        render(<Router>
            <ChatComponent/>
        </Router>);
        // Verificar la presencia de elementos en la página
        expect(screen.getByText('Enviar')).toBeInTheDocument();
        expect(screen.findByPlaceholderText('Escribe un mensaje...'));
        expect(screen.getByText('Volver')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Escribe un mensaje...')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /enviar/i})).toBeInTheDocument();

        expect(mockFetchMessages).toHaveBeenCalled();
        expect(mockFetchUser).toHaveBeenCalled();

        // Simular la escritura de un mensaje en el input
        fireEvent.change(screen.getByPlaceholderText('Escribe un mensaje...'), {target: {value: 'Hello, World!'}});

        // Simular el clic en el botón de enviar
        fireEvent.click(screen.getByText('Enviar'));


    });

    test('renderiza ChatPage sin fallos', () => {
        mockFetchWithHeader({members: [{username: 'user1'}, {username: 'user2'}]});
        const mockFetchMessages = vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({messages: ['message1', 'message2']}),
            })
        );
        const mockFetchUser = vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({user_id: 1}),
            })
        );
        render(<Router>
            <ChatPage/>
        </Router>);

        expect(mockFetchMessages).toHaveBeenCalled();
        expect(mockFetchUser).toHaveBeenCalled();
    });
});


describe('Test de integración de Chat', () => {

    let user1 = undefined;
    let user2 = undefined;
    let token = undefined;
    let chat_room = undefined;

    async function tearUp() {
        localStorage.removeItem('token')

        user1 = await (await getUser(12)).json()
        user2 = await (await getUser(13)).json()


        token = (await (await login('test1Frontend', 'test1Frontend')).json()).token;

        localStorage.setItem('token', token);

        chat_room = await (await createChatRoom(token, user1.id, user2.id)).json();
    }

    function checkPage() {
        expect(screen.getByText('Enviar')).toBeInTheDocument();
        expect(screen.findByPlaceholderText('Escribe un mensaje...'));
        expect(screen.getByText('Volver')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Escribe un mensaje...')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /enviar/i})).toBeInTheDocument();
    }

    function writeMessage(message) {
        fireEvent.change(screen.getByPlaceholderText('Escribe un mensaje...'), {target: {value: message}});
    }

    function sendMessage() {
        let botton = screen.getByText('Enviar');
        botton.click();
    }

    async function checkMessage(message) {
        let messages;
        await act(async () => {
            messages = await (await getMessages(token, chat_room.chatroomID)).json();
        });

        expect(messages.some(msg => msg.content === 'Hello, World!¡Hola, Mundo!123345')).toBe(true);
    }

    test('Renderiza', async () => {
        await tearUp();
        render(<Router>
            <ChatPage/>
        </Router>);
    });

    test('Comprueba estado de la página', async () => {
        await tearUp();
        render(
            <Router>
                <ChatComponent roomId={chat_room.chatroomID} roomName={user2.username} roomMate={user2.id}/>
            </Router>
        );
        checkPage();
    });


    test(`Enviar mensaje normal `, async () => {
        await tearUp();
        render(
            <Router>
                <ChatComponent roomId={chat_room.chatroomID} roomName={user2.username} roomMate={user2.id}/>
            </Router>
        );

        // Simular la escritura de un mensaje en el input
        writeMessage('Hello, World!¡Hola, Mundo!123345');

        // Simular el clic en el botón de enviar
        sendMessage();

        // Esperar a que aparezca el mensaje enviado
        await checkMessage('Hello, World!¡Hola, Mundo!123345');
    });


    const code_messages = [
        'def hello_world():\n    print("Hello, World!")\n', // Código en Python
        'public static void main(String[] args) {\n    System.out.println("Hello, World!");\n}', // Código en Java
        'function helloWorld() {\n    console.log("Hello, World!");\n}', // Código en JavaScript
        '<script>alert("Error");</script>', // Script malicioso
        'SELECT * FROM users;', // Consulta SQL
        'DROP TABLE users;', // Consulta SQL maliciosa
    ]
    code_messages.forEach((message, index) => {
        test(`Enviar mensaje de código "${message}" (${index + 1}/${code_messages.length})`, async () => {
            await tearUp();
            render(
                <Router>
                    <ChatComponent roomId={chat_room.chatroomID} roomName={user2.username} roomMate={user2.id}/>
                </Router>
            );

            // Simular la escritura de un mensaje en el input
            writeMessage(message);

            // Simular el clic en el botón de enviar
            sendMessage();

            // Esperar a que aparezca el mensaje enviado
            checkMessage(message);
        });
    })


    test(`Enviar mensaje con caracteres especiales`, async () => {
        await tearUp();
        render(
            <Router>
                <ChatComponent roomId={chat_room.chatroomID} roomName={user2.username} roomMate={user2.id}/>
            </Router>
        );

        // Simular la escritura de un mensaje en el input
        writeMessage('!@#$%^&*()_+{}|:"<>?`-=[]\;\',.😊🚀🌟🍕🍔🍟🌮🍿🥤');

        // Simular el clic en el botón de enviar
        sendMessage();

        // Esperar a que aparezca el mensaje enviado
        checkMessage('!@#$%^&*()_+{}|:"<>?`-=[]\;\',.😊🚀🌟🍕🍔🍟🌮🍿🥤');
    });


    test(`Enviar mensaje largo `, async () => {
        await tearUp();
        render(
            <Router>
                <ChatComponent roomId={chat_room.chatroomID} roomName={user2.username} roomMate={user2.id}/>
            </Router>
        );

        // Simular la escritura de un mensaje en el input
        writeMessage('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fringilla lacinia risus, ac convallis ex ultrices in. Nullam ut ex quis sapien tincidunt rhoncus id at ligula. Nam volutpat nulla sed nibh malesuada vehicula. Sed id arcu at libero lacinia ultricies sit amet id nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et tortor sem. Ut vestibulum felis nisi, vel efficitur leo suscipit ac. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fringilla lacinia risus, ac convallis ex ultrices in. Nullam ut ex quis sapien tincidunt rhoncus id at ligula. Nam volut pat nulla sed nibh malesuada vehicula. Sed id arcu at libero lacinia ultricies sit amet id nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et tortor sem. Ut vestibulum felis nisi, vel efficitur leo suscipit ac.');

        // Simular el clic en el botón de enviar
        sendMessage();

        // Esperar a que aparezca el mensaje enviado
        checkMessage('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fringilla lacinia risus, ac convallis ex ultrices in. Nullam ut ex quis sapien tincidunt rhoncus id at ligula. Nam volutpat nulla sed nibh malesuada vehicula. Sed id arcu at libero lacinia ultricies sit amet id nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et tortor sem. Ut vestibulum felis nisi, vel efficitur leo suscipit ac. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fringilla lacinia risus, ac convallis ex ultrices in. Nullam ut ex quis sapien tincidunt rhoncus id at ligula. Nam volut pat nulla sed nibh malesuada vehicula. Sed id arcu at libero lacinia ultricies sit amet id nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et tortor sem. Ut vestibulum felis nisi, vel efficitur leo suscipit ac.');
    });
});