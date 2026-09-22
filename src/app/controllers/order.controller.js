const productModel = require("../models/products.model");
const orderModel = require("../models/orders.model");
const customerModel = require("../models/customers.model");


class OrderController {
    // :)))))
    


    // [GET] /employee/order
    index = async (req, res) => {
        res.render('pages/employee.order.hbs', { navActive: 'order', username: req.session.user.fullname });
    };


    // [POST] /employee/order
    findPrd = async (req, res) => {
        const keyword = req.body.keyword;
        // console.log(keyword); // find product by barcode or name
        const products1 = await productModel.find({ barcode: { $regex: new RegExp(keyword, 'i') } });
        const products2 = await productModel.find({ name: { $regex: new RegExp(keyword, 'i') } });
        const products = [...products1, ...products2];

        if (products.length > 0) {

            return res.json({
                status: true,
                message: "Product list",
                data: { products },
            });
        } else {
            return res.json({
                status: false,
                message: "Product not found",
                data: { },
            });
        }
    }
    

    // [POST] /employee/order/create
    createOrder = async (req, res) => {
        const { productsData } = req.body;
        
        const salesperson = req.session.user;
        if (!salesperson) {
            return res.status(401).json({
                status: false,
                message: "You must login to use this feature",
                data: { },
            });
        }

        if (!Array.isArray(productsData) || productsData.length === 0) {
            return res.status(400).json({
                status: false,
                message: "An order must contain at least one product",
                data: { },
            });
        }

        try {
            const trustedProducts = [];
            const productsInDb = [];
            const productIds = new Set();
            let totalInCents = 0;

            for (const product of productsData) {
                if (!product || typeof product !== "object") {
                    return res.status(400).json({
                        status: false,
                        message: "Invalid product",
                        data: { },
                    });
                }

                const quantity = Number(product.quantity);
                if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
                    return res.status(400).json({
                        status: false,
                        message: "Product quantity must be an integer between 1 and 100",
                        data: { },
                    });
                }

                const productId = String(product.productId || "");
                if (!productId || productIds.has(productId)) {
                    return res.status(400).json({
                        status: false,
                        message: "Each product may only appear once in an order",
                        data: { },
                    });
                }
                productIds.add(productId);

                // Reuse the product read that was already needed to set beenPurchased.
                // Client-provided product names and totals are never persisted.
                const productInDb = await productModel.findOne({ _id: productId });
                if (!productInDb) {
                    return res.status(400).json({
                        status: false,
                        message: "Product not found",
                        data: { },
                    });
                }

                const priceInCents = Math.round(Number(productInDb.retailPrice) * 100);
                if (!Number.isSafeInteger(priceInCents) || priceInCents < 0) {
                    throw new Error(`Invalid retail price for product ${productId}`);
                }

                const lineTotalInCents = priceInCents * quantity;
                if (!Number.isSafeInteger(lineTotalInCents) || !Number.isSafeInteger(totalInCents + lineTotalInCents)) {
                    throw new Error("Order total exceeds the supported amount");
                }

                totalInCents += lineTotalInCents;
                trustedProducts.push({
                    productId: productInDb._id,
                    productName: productInDb.name,
                    quantity,
                    totalOne: lineTotalInCents / 100,
                });
                productsInDb.push(productInDb);
            }

            const newOrder = new orderModel({
                customerId: null,
                products: trustedProducts,
                totalAll: totalInCents / 100,
                createdBy: salesperson._id,
            });

            await newOrder.save();
            const orderId = newOrder._id;
            for (const productInDb of productsInDb) {
                productInDb.beenPurchased = true;
                await productInDb.save();
            }
            return res.json({
                status: true,
                message: "Create order successfully",
                data: { orderId },
            });
        } catch (error) {
            console.log(error);
            const status = error.name === "CastError" ? 400 : 500;
            return res.status(status).json({
                status: false,
                message: status === 400 ? "Invalid product" : "Could not create order",
                data: { },
            });
        }
    }
    // [GET] /employee/customer/history/:phone
    history = async (req, res) => {
        const phone = req.params.phone;
        const customer = await customerModel.findOne({ phoneNumber: phone });
        if (!customer) {
            return res.status(400).json({
                // status: false,
                message: "Customer not found",
                // data: { },
            });
        }
        const ordersH = await orderModel.find({ customerId: customer._id });
        const orders = ordersH.map(order => order.toObject());
        return res.render('pages/products.update.hbs', { navActive: 'customers', customer: customer.toObject(), orders });
    }
}


module.exports = new OrderController();
