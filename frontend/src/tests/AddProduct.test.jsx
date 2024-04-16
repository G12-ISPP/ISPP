import {test} from 'vitest'
import {render, screen, fireEvent, act, waitFor} from "@testing-library/react";
import Product from '../components/AddProduct';
import '@testing-library/jest-dom'
import {AuthProvider} from "../context/AuthContext.jsx";
import {MemoryRouter} from "react-router-dom";
import React from "react";
import {getProducts} from "../api/products.api.jsx";
import {login} from "../api/users.api.jsx";

let messages = {
    labels: {
        title: 'Subir producto',
        photo: 'Seleccionar imagen',
        name: 'Nombre',
        description: 'Descripción',
        show: 'Destacar el producto',
        price: 'Precio',
        type: 'Tipo',
        stockQuantity: 'Cantidad',
        button: 'Añadir producto'
    },
    token: {
        user: 'test1Frontend',
        password: 'test1Frontend'
    },
    errors: {
        photo: 'La foto es obligatoria',
        name: 'El nombre debe tener entre 3 y 30 caracteres',
        description: 'La descripción debe tener entre 20 y 200 caracteres',
        formatPrice: 'El precio debe tener el formato correcto (por ejemplo, 5.99)',
        rangePrice: 'El precio debe estar entre 0 y 1,000,000',
        type: 'Tipo de producto no válido',
        stockQuantity: 'La cantidad debe ser un número entero entre 1 y 100',
        show: 'Ya hay 3 productos destacados',
    }
}

describe('Tests to add product', () => {

    const jsdomAlert = window.alert;
    window.alert = () => {
    };
    let token = null;


    beforeEach(async () => {
        localStorage.removeItem('token')

        token = (await (await login(messages.token.user, messages.token.user)).json()).token;

        localStorage.setItem('token', token);

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Product/>
                </AuthProvider>
            </MemoryRouter>
        );
    });

    const fillFormAndSubmit = async (fileInputValue, nameInputValue, descriptionInputValue, priceInputValue, typeInputValue, stockQuantityValue, typeFileInputValue='image/jpeg') => {
        const fileInput = screen.getByLabelText(messages.labels.photo);
        const nameInput = screen.getByLabelText(messages.labels.name);
        const descriptionInput = screen.getByLabelText(messages.labels.description);
        const priceInput = screen.getByLabelText(messages.labels.price);
        const stockQuantityInput = screen.getByLabelText(messages.labels.stockQuantity);
    
        // Seleccionar el tipo de producto
        const productTypeButtons = screen.getAllByText(/Impresora|Diseño|Material|Pieza/);
        // const selectedProductTypeButton = productTypeButtons.find(button => button.textContent === typeInputValue);
        //if (!selectedProductTypeButton) {
        //    throw new Error(`Tipo de producto "${typeInputValue}" no encontrado.`);
        //}
    
        await act(async () => {
            fireEvent.change(fileInput, { target: { files: [new File(['dummy'], fileInputValue, { type: typeFileInputValue })] } });
            fireEvent.change(nameInput, { target: { value: nameInputValue } });
            fireEvent.change(descriptionInput, { target: { value: descriptionInputValue } });
            fireEvent.change(priceInput, { target: { value: priceInputValue } });
            // fireEvent.click(selectedProductTypeButton); // Simular clic en el botón del tipo de producto
            fireEvent.change(stockQuantityInput, { target: { value: stockQuantityValue } });
        });
    };
    


    async function addProductAndCheckAmount(difference) {
        let oldProducts = await getProducts();
        let oldProductsLength = oldProducts.length;

        await act(async () => {
            // Simula hacer clic en el botón "Añadir Producto"
            fireEvent.click(screen.getByText(messages.labels.button));
            await waitFor(() => {
                // Espera a que los cambios se reflejen en la interfaz
                return expect(getProducts()).resolves.toHaveLength(oldProductsLength + difference);
            });
        });
    }



    test('Page has all elements', async () => {
        expect(screen.getByText(messages.labels.title)).toBeInTheDocument();
        expect(screen.getByLabelText(messages.labels.photo)).toBeInTheDocument();
        expect(screen.getByLabelText(messages.labels.name)).toBeInTheDocument();
        expect(screen.getByLabelText(messages.labels.description)).toBeInTheDocument();
        expect(screen.getByLabelText(messages.labels.show)).toBeInTheDocument();
        expect(screen.getByLabelText(messages.labels.price)).toBeInTheDocument();
        const productTypeButtons = screen.getAllByText(/Impresora|Diseño|Material|Pieza/);
        expect(productTypeButtons.length).toBeGreaterThanOrEqual(4);
        expect(screen.getByText(messages.labels.stockQuantity)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: messages.labels.button})).toBeInTheDocument();
    });
    
    

    test('Test empty form', () => {
        // Simula hacer clic en el botón "Añadir Producto" sin llenar ningún campo
        fireEvent.click(screen.getByText(messages.labels.button));

        // Verifica que los mensajes de error esperados aparezcan
        expect(screen.getByText(messages.errors.photo)).toBeInTheDocument();
        expect(screen.getByText(messages.errors.name)).toBeInTheDocument();
        expect(screen.getByText(messages.errors.description)).toBeInTheDocument();
        expect(screen.getByText(messages.errors.rangePrice)).toBeInTheDocument();
    })


    test('Test valid form', async () => {
        await fillFormAndSubmit('test.jpg', 'Test Product', 'Test Description Test Description Test Description',  '10.99', 'Impresora', 1);

        await act(async () => {
            await addProductAndCheckAmount(1)
        })


        // Verifica que no haya mensajes de error presentes
        expect(screen.queryByText(messages.errors.photo)).not.toBeInTheDocument();
        expect(screen.queryByText(messages.errors.name)).not.toBeInTheDocument();
        expect(screen.queryByText(messages.errors.description)).not.toBeInTheDocument();
        expect(screen.queryByText(messages.errors.rangePrice)).not.toBeInTheDocument();
    });

    /* Foto */
    test('Test photo not selected', async () => {
        await fillFormAndSubmit('', 'Test Product', 'Test Description', '10.99', 'Impresora', 1);

        await act(async () => {
            await addProductAndCheckAmount(0)
        })

        // Verifica que aparezca el mensaje de error por foto no seleccionada
        expect(screen.getByText(messages.errors.photo)).toBeInTheDocument();
    });

    test('Test incorrect file format', async () => {
        const incorrectFormats = [
            ['test.stl', 'application/sla'],
            ['test.bmp', 'image/bmp'],
            ['test.gif', 'image/gif'],
            ['test.tiff', 'image/tiff'],
            ['test.webp', 'image/webp'],
            ['test.svg', 'image/svg+xml'],
            ['test.pdf', 'application/pdf'],
            ['test.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            ['test.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
            ['test.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
            ['test.mp4', 'video/mp4'],
            ['test.mov', 'video/quicktime'],
            ['test.avi', 'video/x-msvideo'],
            ['test.mkv', 'video/x-matroska'],
            ['test.flv', 'video/x-flv'],
            ['test.zip', 'application/zip'],
            ['test.rar', 'application/x-rar-compressed'],
            ['test.tar.gz', 'application/gzip'],
            ['test.txt', 'text/plain'],
            ['test.xml', 'application/xml']
        ];

        for (let i = 0; i < incorrectFormats.length; i++) {
            await fillFormAndSubmit(incorrectFormats[i][0], 'Test Product', 'Test Description',  '10.99', 'Impresora', 1, incorrectFormats[i][1]);

            await act(async () => {
                await addProductAndCheckAmount(0)
            })

            // Verifica que aparezca el mensaje de error por foto incorrecta
            expect(screen.getByText(messages.errors.photo)).toBeInTheDocument();
        }
        fillFormAndSubmit('test.jpg', 'Test Product', 'Test Description', '10.99', 'Impresora', 1);
    });

    /* Nombre */
    test('Test name too short', async () => {
        await fillFormAndSubmit('test.jpg', 'Ab', 'Test Description', '10.99', 'Impresora', 1);

        await act(async () => {
            await addProductAndCheckAmount(0)
        })

        // Verifica que aparezca el mensaje de error por nombre corto
        expect(screen.getByText(messages.errors.name)).toBeInTheDocument();
    });

    test('Test name too long', async () => {
        await fillFormAndSubmit('test.jpg', 'Very Long Name'.repeat(5), 'Test Description', '10.99', 'Impresora', 1);

        await act(async () => {
            await addProductAndCheckAmount(0)
        })

        // Verifica que aparezca el mensaje de error por nombre largo
        expect(screen.getByText(messages.errors.name)).toBeInTheDocument();
    });

    /* Descripción */
    test('Test description too short', async () => {
        await fillFormAndSubmit('test.jpg', 'Test Product', 'Short', '10.99', 'Impresora', 1);

        await act(async () => {
            await addProductAndCheckAmount(0)
        })

        // Verifica que aparezca el mensaje de error por descripción corta
        expect(screen.getByText(messages.errors.description)).toBeInTheDocument();
    });

    test('Test description too long', async () => {
        await fillFormAndSubmit('test.jpg', 'Test Product', 'Very long description'.repeat(10), '10.99', 'Impresora', 1);

        await act(async () => {
            await addProductAndCheckAmount(0)
        })

        // Verifica que aparezca el mensaje de error por descripción larga
        expect(screen.getByText(messages.errors.description)).toBeInTheDocument();
    });

    /* Precios */
    test('Test price not a number', async () => {
        await fillFormAndSubmit('test.jpg', 'Test Product', 'Test Description', 'aa', 'Impresora', 1);

        await act(async () => {
            await addProductAndCheckAmount(0)
        })

        expect(screen.getByText(messages.errors.formatPrice)).toBeInTheDocument();
    });

    test('Test price out of range', async () => {
        await fillFormAndSubmit('test.jpg', 'Test Product', 'Test Description', '1000001', 'Impresora',1);

        await act(async () => {
            await addProductAndCheckAmount(0)
        })

        // Verifica que aparezca el mensaje de error por precio fuera de rango
        expect(screen.getByText(messages.errors.rangePrice)).toBeInTheDocument();
    });

    /* Cantidad */
    test('Test stock quantity out of range', async () => {
        await fillFormAndSubmit('test.jpg', 'Test Product', 'Test Description', '10.99', 'Impresora', -1);

        await act(async () => {
            await addProductAndCheckAmount(0)
        })

        // Verifica que aparezca el mensaje de error por cantidad incorrecta
        expect(screen.getByText(messages.errors.stockQuantity)).toBeInTheDocument();
    });

    test('Test stock quantity not a number', async () => {
        fillFormAndSubmit('test.jpg', 'Test Product', 'Test Description', '10.99', 'Impresora', 101);

        await act(async () => {
            await addProductAndCheckAmount(0)
        })

        // Verifica que aparezca el mensaje de error por cantidad incorrecta
        expect(screen.getByText(messages.errors.stockQuantity)).toBeInTheDocument();

    })
});
