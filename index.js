import express from 'express'
import 'dotenv/config'
import logger from "./logger.js";
import morgan from "morgan";

const app = express()
const port = process.env.PORT
app.use(express.json()) //accept json data only

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let productsArr = []
let productId = 0

app.get('/', (req, res) => {
    res.send('Working')
})

// Get all products
app.get('/products', (req, res) => {
    res.send(productsArr)
})

// Get single product (by Id)
app.get('/products/:id', (req, res) => {
    const {id} = req.params
    const product = productsArr.find(item => item.id === parseInt(id))
    
    if(!product) {
        return res.status(404).send('Product Not Found')
    }
    res.status(200).send(product)
})


// Create product
app.post('/products', (req, res) => {
    const {title, price} = req.body
    if (title, price) {
        const newProduct = {
            id: ++productId,
            title,
            price
        }
        productsArr.push(newProduct)
        res.status(201).send('Product created successfully!')
        return
    } else {
        res.status(200).send('Title & price Required')
    }
})

// Update Product
app.put('/products/:id', (req, res) => {
    const {id} = req.params
    const productId = parseInt(id); 
    const product = productsArr.find(item => item.id === productId)
    
    if(!product) {
        return res.status(404).send('Product Not Found')
    }

    const {title, price} = req.body
    const newArr = productsArr.map(item => {
        if(item.id === productId) {
            return {
                ...item,
                title: title || item.title,
                price: price || item.price,
            } 
        } else {
            return item
        }
    })
    productsArr = newArr
    res.status(200).send("Product Updated Successfully!")
})

// Delete Product
app.delete('/products/:id', (req, res) => {
    const {id} = req.params
    const index = productsArr.findIndex(item => item.id === parseInt(id))
    
    if(index === -1) {
        return res.status(404).send('Product Not Found')
    }
    
    productsArr.splice(index, 1)
    res.status(200).send("Product Deleted Successfully!")
})

app.listen(port, () => {
    console.log(`Server is listening at ${port}...`);  
})