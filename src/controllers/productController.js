const cartModel = require("../models/cartModel")
const validator = require("../validations/validator")
const productModel = require("../models/productModel")
const { uploadFile } = require('../AWS_Upload/aws_s3')


//------------------ CREATING PRODUCT
const createProduct = async (req, res) => {
    try {

        // Extract data from request body
        let body = JSON.parse(JSON.stringify(req.body));

        // check Body is coming or not 
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, message: `Please Enter Product Details First!!` })
        }

        // Get File for uploading Product Image
        let files = req.files;
        console.log(files);
        if (files && files.length > 0) {

            if (!validator.isValidImage(files[0])) {
                return res.status(400).send({ status: false, message: `Invalid Image Type` })
            }
            else if (files.length == 0) {
                return res.status(400).send({ status: false, msg: "No file to Write ! Please Add the Product Image" })
            }
        }

        // Upload file Now 
        let uploadedFileURL = await uploadFile(files[0]);

        // Destructing the request body
        let { title, description, price, currencyId, currencyFormat, style, availableSizes, installments } = body

        // Check title is coming or not 
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: `Please Enter Product Title` })
        }

        // Validate the title
        if (!validator.isValidString(title)) {
            return res.status(400).send({ status: false, message: `Please Enter Valid Product Title` })
        }

        // Check Duplicate title is present or not
        let duplicateTitle = await productModel.findOne({ title: title, isDeleted: false })
        if (duplicateTitle) {
            return res.status(400).send({ status: false, message: `Product Already Exists with this title` })
        }

        // Check description is coming or not
        if (!validator.isValid(description)) {
            return res.status(400).send({ status: false, message: `Please Enter Product description` })
        }

        // Validate the description
        if (!validator.isValidString(description)) {
            return res.status(400).send({ status: false, message: `Please Enter Product Valid Product Description` })
        }

        // Check Price is Coming Or not
        if (!validator.isValid(price)) {
            return res.status(400).send({ status: false, message: `Please Enter Product Price` })
        }

        // Validate the price 
        if (!validator.isValidPrice(price)) {
            return res.status(400).send({ status: false, message: `Please Enter Valid Product description` })
        }

        // Check CurrencyID is coming or not
        if (!validator.isValid(currencyId)) {
            return res.status(400).send({ status: false, message: `Please Enter Product Currency ID` })
        }

        // Validate the CurrencyID 
        if (!validator.isvalidCurrencyId(currencyId)) {
            return res.status(400).send({ status: false, message: `Please Enter Valid Product Currency ID` })
        }

        // Check Currency Format is Coming or not
        if (!validator.isValid(currencyFormat)) {
            return res.status(400).send({ status: false, message: `Please Enter Product Currency Format` })
        }

        // Validate the Currency Format 
        if (!validator.isvalidCurrencyFormat(currencyFormat)) {
            return res.status(400).send({ status: false, message: `Please Enter Valid Product Currency Format` })
        }

        // Validate the  style 
        if (style && !validator.isValidString(style)) {
            return res.status(400).send({ status: false, message: `Please Enter Valid Product Style` })
        }

        // Validate the Available Sizes 
        if (availableSizes && !validator.isValidSize(availableSizes)) {
            return res.status(400).send({ status: false, message: `Please Enter Valid Product Available Sizes` })
        }

        //  Validate Installments
        if (!validator.isvalidNum(installments)) {
            return res.status(400).send({ status: false, message: `Please Enter Valid Product Installments` })
        }

        // Create a new Object and set all things
        let finalData = {
            title,
            description,
            price,
            currencyId,
            currencyFormat,
            productImage: uploadedFileURL,
            style,
            availableSizes,
            installments
        }

        const newProduct = await productModel.create(finalData);
        return res.status(201).send({ status: true, message: 'Product Created Successfully', data: newProduct })

    } catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
};

//------------------ GETTING PRODUCT
const getProducts = async (req, res) => {
    
};

//------------------ GETTING PRODUCT BY ID
const getProductsById = async (req, res) => {
    res.send({ message: "hii" })
};

//------------------ GETTING PRODUCT BY ID
const updateProductById = async (req, res) => {
    res.send({ message: "hii" })
};

//------------------ UPDATING CART
const deleteProductById = async (req, res) => {
    res.send({ message: "hii" })
};


module.exports = {
    createProduct,
    getProducts,
    getProductsById,
    updateProductById,
    deleteProductById
}