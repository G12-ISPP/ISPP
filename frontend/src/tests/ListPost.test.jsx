import {getFollowStatus, getUser, login, toggleFollow} from "../api/users.api.jsx";
import {render, screen, waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {AuthProvider} from "../context/AuthContext.jsx";
import React from "react";
import Post from "../components/Post/Post.jsx";
import {savePost} from "../api/comunity.api.jsx";

let messages = {
    token: {
        user: 'test1Frontend',
        password: 'test1Frontend',
        friend: 'test2Frontend',
        friendPassword: 'test2Frontend'
    },
    labels: {
        publish: 'Publicado por: '
    }
}

describe('Test list posts', () => {
    let user = undefined;
    let friends = undefined;

    let token = null;
    let tokenFriend = null;

    let post = undefined;


    beforeEach(async () => {
        localStorage.removeItem('token');

        user = (await (await getUser(12)).json());
        friends = (await (await getUser(13)).json());

        token = (await (await login(messages.token.user, messages.token.user)).json()).token;
        tokenFriend = (await (await login(messages.token.friend, messages.token.friend)).json()).token;

        localStorage.setItem('token', token);

        // Create a file object
        const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
        post = {
            name: 'test_name',
            description: 'test_description',
            file: file,
            users: user,
        }

        let response = (await (await savePost(post)).json());

        if ((await (await getFollowStatus(user.id)).json())['follows'] === false) {
            let response = await toggleFollow(user.id);
            console.log(await response.json());
        }

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Post/>
                </AuthProvider>
            </MemoryRouter>
        );
    });


    test('Test list posts', async () => {
        await waitFor(() => screen.getByText(post.name));
        await waitFor(() => screen.getByText(post.description));
        await waitFor(() => screen.getByText(messages.labels.publish + user.username));
    });
})