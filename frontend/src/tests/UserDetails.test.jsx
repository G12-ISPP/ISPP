import UserDetail from '../components/User';
import { render, waitFor, screen } from "@testing-library/react";
import { expect } from "chai";
import { vi } from 'vitest';

describe("OK User Details", () => {
    test("Normal", async () => {
        /* ARRANGE */
        const user = {
            address: "Avenida Reina Mercedes, 16, 4B",
            city: "Sevilla",
            email: "davidhernandez@gmail.com",
            first_name: "David",
            is_designer: false,
            is_printer: false,
            last_name: "Hernández de la Prada",
            postal_code: 41012
        };

        mockFetch(user);

        /* ACT */
        const { container } = render(<UserDetail />);

        await waitFor(() => {expect(screen.getByText("Detalles de usuario")).to.exist;});

        /* ASSERT */
        assertOKUserDetails(user, container);
    });

    test("User with Oriental Characters", async () => {
        /* ARRANGE */
        const user = {
            address: "東京都中央区",
            city: "東京東京",
            email: "hanako@example.com",
            first_name: "花子花",
            is_designer: true,
            is_printer: false,
            last_name: "山田山田",
            postal_code: 100001
        };

        mockFetch(user);

        /* ACT */
        const { container } = render(<UserDetail />);

        await waitFor(() => {expect(screen.getByText("Detalles de usuario")).to.exist;});

        /* ASSERT */
        assertOKUserDetails(user, container);
    });

    test("User with Extreme Postal Code", async () => {
        /* ARRANGE */
        const user = {
            address: "123 Main Street",
            city: "Cityville",
            email: "john.doe@example.com",
            first_name: "John",
            is_designer: false,
            is_printer: true,
            last_name: "Doe",
            postal_code: 999999 // Extremely high postal code
        };

        mockFetch(user);

        /* ACT */
        const { container } = render(<UserDetail />);

        await waitFor(() => {expect(screen.getByText("Detalles de usuario")).to.exist;});

        /* ASSERT */
        assertOKUserDetails(user, container);
    });
});

// Additional tests for injection scenarios
describe("Injection User Details", () => {
    test("User with JavaScript Injection", async () => {
        /* ARRANGE */
        const user = {
            address: "<script>alert('JavaScript Injection');</script>",
            city: "Cityville",
            email: "john.doe@example.com",
            first_name: "John",
            is_designer: true,
            is_printer: true,
            last_name: "Doe",
            postal_code: 12345
        };

        mockFetch(user);

        /* ACT */
        const { container } = render(<UserDetail />);

        await waitFor(() => {expect(screen.getByText("Detalles de usuario")).to.exist;});

        /* ASSERT */
        assertInjectionUserDetails(user, container);
    });

    test("User with HTML Injection", async () => {
        /* ARRANGE */
        const user = {
            address: "<div style='color:red;'>HTML Injection</div>",
            city: "Cityville",
            email: "john.doe@example.com",
            first_name: "John",
            is_designer: true,
            is_printer: true,
            last_name: "Doe",
            postal_code: 12345
        };

        mockFetch(user);

        /* ACT */
        const { container } = render(<UserDetail />);

        await waitFor(() => {expect(screen.getByText("Detalles de usuario")).to.exist;});

        /* ASSERT */
        assertInjectionUserDetails(user, container);
    });

    test("User with SQL Injection", async () => {
        /* ARRANGE */
        const user = {
            address: "User with SQL Injection ADDRESS; DROP TABLE Users;",
            city: "Cityville",
            email: "john.doe@example.com",
            first_name: "User with SQL Injection NAME; DROP TABLE Users;",
            is_designer: true,
            is_printer: true,
            last_name: "Doe",
            postal_code: "User with SQL Injection POSTAL CODE; DROP TABLE Users;"
        };

        mockFetch(user);

        /* ACT */
        const { container } = render(<UserDetail />);

        await waitFor(() => {expect(screen.getByText("Detalles de usuario")).to.exist;});

        /* ASSERT */
        assertInjectionUserDetails(user, container);
    });
});
describe("User roles", () => {
    test("Designer", async () => {
        /* ARRANGE */
        const user = {
            address: "Avenida Reina Mercedes, 16, 4B",
            city: "Sevilla",
            email: "davidhernandez@gmail.com",
            first_name: "David",
            is_designer: true,
            is_printer: false,
            last_name: "Hernández de la Prada",
            postal_code: 41012
        };

        mockFetch(user);

        /* ACT */
        const { container } = render(<UserDetail />);

        await waitFor(() => {expect(screen.getByText("Detalles de usuario")).to.exist;});

        /* ASSERT */
        expect(() => {screen.getByText("Diseñador").to.exist});
    });
});


// Auxiliar functions
function assertOKUserDetails(user, container) {
    const checkText = ["address", "city", "email", "first_name", "last_name"]

    for (let i = 0; i < checkText.length; i++) {
        const expectedText = new RegExp(user[checkText[i]]);
        expect(() => screen.queryByText(expectedText)).to.exist;
    }
}

function assertInjectionUserDetails(user, container) {
    const checkText = ["address", "city", "email", "first_name", "last_name"]

    for (let i = 0; i < checkText.length; i++) {
        const expectedText = parseScriptAndHtml(user[checkText[i]]);
        expect(() => screen.queryByText(expectedText)).to.exist;
    }
}

function mockFetch(object) {
    vi.spyOn(window, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => Promise.resolve(object),
        });
    });
}

function parseScriptAndHtml(input) {
    const sanitizedInput = input.replace(/[<>"&'`]/g, function (match) {
        const escapeMap = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '&': '&amp;',
            "'": '&#39;',
            '`': '&#x60;'
        };
        return escapeMap[match];
    });

    return sanitizedInput;
}
