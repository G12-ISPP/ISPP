import { getUser, login } from "../api/users.api.jsx";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext.jsx";
import Admin from "../components/Admin/Admin.jsx";
import { MemoryRouter } from "react-router-dom";
import UsersList from "../components/UsersList/UsersList.jsx";

const messages = {
    token: {
        admin: import.meta.env.VITE_PASSWORD_ADMIN,
        no_admin: 'test1Frontend',
    },
    labels: {
        title: 'Listado de usuarios',
        error: 'No tienes permisos para acceder a esta página'
    }
}

describe('Admin test page', () => {
    const jsdomAlert = window.alert;
    window.alert = vi.fn(); // Mock de window.alert

    let admin = undefined;
    let no_admin = undefined;

    let token_admin = undefined;
    let token_no_admin = undefined;

    beforeEach(async () => {
        localStorage.removeItem('token');

        admin = (await (await getUser(1)).json());
        no_admin = (await (await getUser(12)).json());

        token_admin = (await (await login(admin.username, messages.token.admin)).json()).token;

        token_no_admin = (await (await login(no_admin.username, messages.token.no_admin)).json()).token;
    });

    test('Admin', async () => {
        localStorage.setItem('token', token_admin);
        localStorage.setItem('userId', admin.id);

        render(
            <MemoryRouter>
                <AuthProvider>
                    <UsersList/>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText(messages.labels.title)).to.exist);
    });

    test('No admin', async () => {
        localStorage.setItem('token', token_no_admin);
        localStorage.setItem('userId', no_admin.id);

        render(
            <MemoryRouter>
                <AuthProvider>
                    <UsersList/>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(messages.labels.error);
        });
    });
});