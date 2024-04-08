import {test} from 'vitest';
import {render, screen, fireEvent} from "@testing-library/react";
import Cart from '../components/Cart/Cart';
import '@testing-library/jest-dom';
import {MemoryRouter} from "react-router-dom";
import {AuthProvider} from "../context/AuthContext.jsx";

let messages = {
    errors: {
        email: 'Por favor, introduce tu correo electrónico.',
        city: 'Por favor, introduce el nombre de tu ciudad.',
        address: 'Por favor, introduce tu dirección.',
        cart: 'Debes añadir al menos un producto al carrito.',
        postalCode: 'El código postal debe estar entre 1000 y 52999.'
    },
    labels: {
        cartTitle: 'Mi carrito',
        subtotal: 'Subtotal',
        shipping: 'Envío',
        total: 'Total',
        checkout: 'Finalizar compra',
        minus: '-',
        plus: '+'
    }
};


describe('Tests cart', () => {

    test('render correctly', () => {
        const mockCart = [
            {id: 1, name: 'Product 1', price: 10.99, quantity: 1},
            {id: 2, name: 'Product 2', price: 20.99, quantity: 2}
        ];
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Cart cart={mockCart} setCart={() => {}}/>
                </AuthProvider>
            </MemoryRouter>
        );
        expect(screen.getByText(messages.labels.cartTitle)).toBeInTheDocument();
    });

    test('contains expected elements and buttons', () => {
        const mockCart = [
            {id: 1, name: 'Product 1', price: 10.99, quantity: 1},
            {id: 2, name: 'Product 2', price: 20.99, quantity: 2}
        ];
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Cart cart={mockCart} setCart={() => {}}/>
                </AuthProvider>
            </MemoryRouter>
        );

        expect(screen.getByText(messages.labels.subtotal)).toBeInTheDocument();
        expect(screen.getByText(messages.labels.shipping)).toBeInTheDocument();
        expect(screen.getByText(messages.labels.total)).toBeInTheDocument();
        expect(screen.getByText(messages.labels.checkout)).toBeInTheDocument();

        const minusButtons = screen.getAllByRole('button', {name: messages.labels.minus});
        expect(minusButtons.length).toBeGreaterThan(1);

        const plusButtons = screen.getAllByRole('button', {name: messages.labels.plus});
        expect(plusButtons.length).toBeGreaterThan(1);

        const trashButtons = screen.getAllByRole('link');
        expect(trashButtons.length).toBeGreaterThan(1);

        const inputFields = screen.getAllByRole('textbox');
        expect(inputFields.length).toBeGreaterThan(0);
    });

    test('deletes product from cart', () => {
        const mockCart = [
            {id: 1, name: 'Product 1', price: 10.99, quantity: 1},
            {id: 2, name: 'Product 2', price: 20.99, quantity: 2}
        ];
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Cart cart={mockCart} setCart={() => {}}/>
                </AuthProvider>
            </MemoryRouter>
        );

        const trashButton = screen.getAllByRole('link')[0];
        fireEvent.click(trashButton);
        expect(screen.queryByText('Product 1')).not.toBeInTheDocument();

        const trashButton2 = screen.getAllByRole('link')[1];
        fireEvent.click(trashButton2);
        expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
    });

    test('edits quantity of product in cart', () => {
        const mockCart = [
            {id: 1, name: 'Product 1', price: 10.99, quantity: 1},
            {id: 2, name: 'Product 2', price: 20.99, quantity: 2}
        ];
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Cart cart={mockCart} setCart={() => {}}/>
                </AuthProvider>
            </MemoryRouter>
        );

        const firstMinusButton = screen.getAllByRole('button', {name: messages.labels.minus})[1];
        const firstPlusButton = screen.getAllByRole('button', {name: messages.labels.plus})[1];
        fireEvent.click(firstMinusButton);
        expect(screen.getByDisplayValue('1')).toBeInTheDocument();
        fireEvent.click(firstPlusButton);
        expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    });


    test('validate empty form', () => {
        const mockCartVacio = [];
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Cart cart={mockCartVacio}/>
                </AuthProvider>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText(messages.labels.checkout));

        expect(screen.getByText(messages.errors.email)).toBeInTheDocument();
        expect(screen.getByText(messages.errors.city)).toBeInTheDocument();
        expect(screen.getByText(messages.errors.address)).toBeInTheDocument();
        expect(screen.getByText(messages.errors.cart)).toBeInTheDocument();
    });
});

