const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let bids = [];

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://uptime-auction-api.azurewebsites.net/api/Auction');
        const auctions = response.data;

        let categories = [];
        auctions.forEach(auction => {
            if (!categories.includes(auction.productCategory)) {
                categories.push(auction.productCategory);
            }
        });

        res.render('index', { auctions, categories, filter: null });
    } catch (error) {
        console.error('Error fetching auctions:', error);
        res.status(500).send('Error fetching auctions');
    }
});

app.post('/bid', (req, res) => {
    const { productId, name, amount } = req.body;
    const bid = {
        productId,
        name,
        amount,
        date: new Date()
    };
    bids.push(bid);
    res.redirect('/');
});

app.get('/category/:category', async (req, res) => {
    try {
        const response = await axios.get('http://uptime-auction-api.azurewebsites.net/api/Auction');
        const auctions = response.data;

        let categories = [];
        auctions.forEach(auction => {
            if (!categories.includes(auction.productCategory)) {
                categories.push(auction.productCategory);
            }
        });

        const filteredAuctions = auctions.filter(auction => auction.productCategory === req.params.category);

        res.render('index', { auctions: filteredAuctions, categories, filter: req.params.category });
    } catch (error) {
        console.error('Error fetching auctions:', error);
        res.status(500).send('Error fetching auctions');
    }
});

app.listen(port, () => {
    console.log(`Bacchus Auction app listening at http://localhost:${port}`);
});
