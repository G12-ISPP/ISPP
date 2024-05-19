import {expect, test} from 'vitest';
import {render, screen} from "@testing-library/react";
import Footer from '../components/Footer/Footer';
import '@testing-library/jest-dom';
import {MemoryRouter} from "react-router-dom";
import {AuthProvider} from "../context/AuthContext.jsx";

const messages = {
    expectedTexts: [
        'Seguimiento de pedidos',
        'Sobre nosotros',
        'Contacto',
        'Política de privacidad',
        'Términos y condiciones'
    ],
    images: [
        'logo.png',
        'bxl-facebook-circle.svg',
        'bxl-instagram.svg',
        'bxl-twitter.svg',
        'bxl-tiktok.svg',
        'bxl-twitch.svg',
        'bxl-youtube.svg'
    ],
    labels: {
        link: 'link',
        image: 'img'
    }
}
;
describe('Test para Footer', () => {

    beforeEach(
        () => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <Footer/>
                    </AuthProvider>
                </MemoryRouter>
            );
        }
    )

    test('contains expected texts and images', () => {

        const buttons = screen.getAllByRole("button");

        expect(buttons.length).toBe(7);

        const links = screen.getAllByRole(messages.labels.link);
        expect(links.length).toBe(messages.expectedTexts.length);

        messages.expectedTexts.forEach((text, index) => {
            expect(links[index].textContent).toBe(text);
        });

        buttons.forEach((button, index) => {
            expect(button.src).toContain(`${messages.images[index]}`);
        });
    });
})

