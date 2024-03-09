import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatPage } from '../pages/ChatPage';
import { BrowserRouter as Router } from 'react-router-dom';
import ChatComponent from '../components/Chat/ChatComponent';
import '@testing-library/jest-dom';

test('renderiza ChatComponent sin fallos', () => {
    mockFetchWithHeader({members: [{username: 'user1'}, {username: 'user2'}]});
    const mockFetchMessages = vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ messages: ['message1', 'message2'] }),
    })
  );
    const mockFetchUser = vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user_id: 1 }),
    })
    );
    render(    <Router>
        <ChatComponent />
    </Router>);
    // Verificar la presencia de elementos en la página
    expect( screen.getByText('Enviar')).toBeInTheDocument();
    expect( screen.findByPlaceholderText('Escribe un mensaje...'));
    expect(screen.getByText('Volver')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe un mensaje...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  
    expect(mockFetchMessages).toHaveBeenCalled();
    expect(mockFetchUser).toHaveBeenCalled();
    
    // Simular la escritura de un mensaje en el input
    fireEvent.change(screen.getByPlaceholderText('Escribe un mensaje...'), { target: { value: 'Hello, World!' } });

    // Simular el clic en el botón de enviar
    fireEvent.click(screen.getByText('Enviar'));

    
});

test('renderiza ChatPage sin fallos', () => {
    mockFetchWithHeader({members: [{username: 'user1'}, {username: 'user2'}]});
    const mockFetchMessages = vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ messages: ['message1', 'message2'] }),
    })
  );
    const mockFetchUser = vi.spyOn(global, 'fetch').mockImplementationOnce(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user_id: 1 }),
    })
    );
    render(    <Router>
        <ChatPage />
    </Router>);
    
    expect(mockFetchMessages).toHaveBeenCalled();
    expect(mockFetchUser).toHaveBeenCalled();
}
);

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
    );}