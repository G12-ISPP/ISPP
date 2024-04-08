import {test} from 'vitest'
import {render, screen} from "@testing-library/react";
import DesignsPage from '../pages/DesignsPage'
import PiecesPage from '../pages/PiecesPage'
import PrintersPage from '../pages/PrintersPage'
import MaterialsPage from '../pages/MaterialsPage'
import ArtistsPage from '../pages/ArtistsPage'
import '@testing-library/jest-dom'
import {MemoryRouter} from "react-router-dom";
import {AuthProvider} from "../context/AuthContext.jsx";

let messages = {
    labels: {
        designs: 'Diseños',
        pieces: 'Piezas',
        printers: 'Impresoras',
        materials: 'Materiales',
        artists: 'Artistas'
    }
};

describe('Test para ListsPage', () => {
    describe('Test para DesignsPage', () => {
        beforeEach(() => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <DesignsPage/>
                    </AuthProvider>
                </MemoryRouter>
            );
        });

        test('DesignsPage contiene todos los objetos', () => {
            expect(screen.getByText(messages.labels.designs)).toBeInTheDocument()
        });
    });


    describe('Test para PiecesPage', () => {
        beforeEach(() => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <PiecesPage/>
                    </AuthProvider>
                </MemoryRouter>
            )
        })

        test('Pieces contiene todos los objetos', () => {
            expect(screen.getByText(messages.labels.pieces)).toBeInTheDocument()
        });
    });

    describe('Test para PrintersPage', () => {
        beforeEach(() => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <PrintersPage/>
                    </AuthProvider>
                </MemoryRouter>
            )
        })

        test('Printers contiene todos los objetos', () => {
            expect(screen.getByText(messages.labels.printers)).toBeInTheDocument()
        });
    });

    describe('Test para MaterialsPage', () => {

        beforeEach(() => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <MaterialsPage/>
                    </AuthProvider>
                </MemoryRouter>
            )
        })

        test('Materials contiene todos los objetos', () => {
            expect(screen.getByText(messages.labels.materials)).toBeInTheDocument()
        });
    });

    describe('Test para ArtistsPage', () => {
        beforeEach(() => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <ArtistsPage/>
                    </AuthProvider>
                </MemoryRouter>
            );
        });

        test('Artists contiene todos los objetos', () => {

            expect(screen.getByText(messages.labels.artists)).toBeInTheDocument()
        });
    });
});
