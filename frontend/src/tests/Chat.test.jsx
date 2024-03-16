import {expect, test, vi} from 'vitest';
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {ChatPage} from '../pages/ChatPage';
import {BrowserRouter as Router} from 'react-router-dom';
import ChatComponent from '../components/Chat/ChatComponent';
import '@testing-library/jest-dom';
import {getUser, register} from "../api/users.api";
import {createChatRoom} from "../api/chat.api.jsx";

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
        user1 = await (await getUser(12)).json()
        user2 = await (await getUser(13)).json()

        console.log(user1)

        token = await getToken(user1.username, user1.password);
        console.log('Token: ', token.access);

        localStorage.setItem('token', token.access);

        chat_room = await (await createChatRoom(user1.id, user2.id)).json();
    }

    test('probar funcionalidad', async () => {
        await tearUp();

        /*
        console.log(chat_room);
        render(<Router>
            <ChatComponent roomId={chat_room.id} roomName={user2.username} roomMate={user2.id} />
        </Router>);

        expect(screen.getByText('Enviar')).toBeInTheDocument();
        expect(screen.findByPlaceholderText('Escribe un mensaje...'));
        expect(screen.getByText('Volver')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Escribe un mensaje...')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /enviar/i})).toBeInTheDocument();

        // Simular la escritura de un mensaje en el input
        fireEvent.change(screen.getByPlaceholderText('Escribe un mensaje...'), {target: {value: 'Hello, World!'}});

        // Simular el clic en el botón de enviar
        fireEvent.click(screen.getByText('Enviar'));

        // Verificar que el mensaje se haya enviado
        waitFor(() => screen.getByText('Hello, World!'));


        expect(screen.getByText('Hello, World!')).toBeInTheDocument();

         */
    })
});


async function getToken(name, password) {
    let response = await fetch(`${backend}/users/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: name, password: password}),
    });
    console.log(response);
    return await response.json();
}