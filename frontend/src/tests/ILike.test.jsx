import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {getFollowStatus, getUser, login, toggleFollow} from "../api/users.api.jsx";
import Post from "../components/Post/Post.jsx";
import {MemoryRouter} from "react-router-dom";
import {AuthProvider} from "../context/AuthContext.jsx";
import {savePost} from "../api/community.api.jsx";

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

describe('I Like tests', () => {

    let user = undefined;
    let friends = undefined;

    let token = null;
    let tokenFriend = null;

    let post = undefined;


    beforeAll(async () => {
        localStorage.removeItem('token');

        user = (await (await getUser(12)).json());
        friends = (await (await getUser(13)).json());

        token = (await (await login(messages.token.user, messages.token.user)).json()).token;
        tokenFriend = (await (await login(messages.token.friend, messages.token.friend)).json()).token;

        localStorage.setItem('token', token);

        // Create a file object
        const file = new File([''], 'test.jpg', {type: 'image/jpeg'});
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
    });

    beforeEach(
        () => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <Post/>
                    </AuthProvider>
                </MemoryRouter>
            );
        }
    )

    test('Like a post', async () => {
        await waitFor(() => {
            expect(screen.getByTestId('dislike')).to.exist;
        });
        let bottom = screen.getByTestId('dislike');
        fireEvent.click(bottom);

        await waitFor(() => {
            expect(screen.getByTestId('like')).to.exist;
        });
    });

    test('Dislike a post', async () => {
        await waitFor(() => {
            expect(screen.getByTestId('like')).to.exist;
        });
        let bottom = screen.getByTestId('like');
        fireEvent.click(bottom);

        await waitFor(() => {
            expect(screen.getByTestId('like')).to.exist;
        });
    })
})