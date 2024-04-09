import {getFollowStatus, getUser, login, toggleFollow} from "../api/users.api.jsx";
import FollowingList from "../components/FollowingList.jsx";
import {AuthProvider} from "../context/AuthContext.jsx";
import {MemoryRouter} from "react-router-dom";
import {render, screen, waitFor} from "@testing-library/react";

let messages = {
    token: {
        user: 'test1Frontend',
        password: 'test1Frontend',
        friend: 'test2Frontend',
        friend_password: 'test2Frontend'
    }
}

describe('Test para listar seguidores', () => {
    let user = undefined;
    let friend = undefined;
    let token = undefined;
    let token_friend = undefined;

    beforeEach(async () => {
        localStorage.removeItem('token')

        user = (await (await getUser(12)).json())
        friend = (await (await getUser(13)).json())

        token = (await (await login(messages.token.user, messages.token.user)).json()).token;

        token_friend = (await (await login(messages.token.friend, messages.token.friend_password)).json()).token;

        localStorage.setItem('token', token_friend);

        console.log(await (await getFollowStatus(user.id)).json());
        if ((await (await getFollowStatus(user.id)).json())['follows'] === false) {
            let response = await toggleFollow(user.id);
            console.log(await response.json());
        }

        localStorage.setItem('userId', user.id);

        localStorage.setItem('token', token);




        render(
            <MemoryRouter>
                <AuthProvider>
                    <FollowingList/>
                </AuthProvider>
            </MemoryRouter>
        );
    });

    test('render correctly', async () => {
        await waitFor(() => {
            expect(screen.getByText(friend.username)).to.exist;
        });
    })
});