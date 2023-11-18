const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, h) => {
    const id = nanoid(16);
    const {
        name, year, author, summary, publisher, 
        pageCount, readPage, reading
    } = req.payload;
    const insertedAt =  new Date().toISOString();
    const updatedAt = insertedAt;

    const finished = pageCount === readPage;
    const checkName = name !== undefined;
    const checkPageCount = pageCount < readPage;

    const newBook = {
        id, name, year, author, summary, publisher, 
        pageCount, readPage, finished, reading, insertedAt, updatedAt 
    };

    if (checkName && !checkPageCount){
        books.push(newBook);
    }

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(isSuccess && !checkPageCount && checkName){
        const response = h.response({
            status: 'success',
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    if(checkPageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
}

const getAllBooksHandler = (req, h) => {
    const book = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }))

    const response = h.response({
        status: "success",
        data: {
            books: book
        }
    });

    response.code(200);
    return response;
    
};

const getBookByIdHandler = (req, h) => {
    const {id} = req.params;
    const book = books.filter((book) => book.id === id)[0];

    if(book !== undefined){
        return {
            status: 'success',
            data: {
                book,
            },
        };
    };

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
}

const editBookByIdHandler = (req, h) => {
    const {id} = req.params;
    const {name, year, author, summary, publisher, 
        pageCount, readPage, reading} = req.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);
    const checkName = name !== undefined
    const checkPageCount = readPage < pageCount;

    if(index !== -1 && checkName && checkPageCount){
        books[index] = {
            ...books[index],
            name, year, author, summary, publisher, 
            pageCount, readPage, reading, updatedAt
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    if(!checkName){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if(!checkPageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (req, h) => {
    const { id } = req.params;
    const index = books.findIndex((book) => book.id === id);

    if(index !== -1){
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};


module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
};