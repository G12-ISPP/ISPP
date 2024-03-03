import UserDetail from '../components/User';
import { render, waitFor, screen } from "@testing-library/react";
import { expect } from "chai";
import { vi } from 'vitest';

describe("User roles", () => {
    test("Printer", async () => {
        /* ARRANGE */
        const user = {
            address: "Avenida Reina Mercedes, 16, 4B",
            city: "Sevilla",
            email: "davidhernandez@gmail.com",
            first_name: "David",
            is_designer: false,
            is_printer: true,
            last_name: "Hernández de la Prada",
            postal_code: 41012
        };

        mockFetch(user);

        /* ACT */
        const { container } = render(<UserDetail />);

        await waitFor(() => {expect(screen.getByText("Detalles de usuario")).to.exist;});

        /* ASSERT */
        expect(() => {screen.getByText("Impresor").to.exist});
    });
});


// Auxiliar functions
function mockFetch(object) {
    vi.spyOn(window, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => Promise.resolve(object),
        });
    });
}