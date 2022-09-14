const express = require('express');
const router = express.Router();
const multer = require('multer');
const {Product} = require('../models/Product');

//=================================
//             product
//=================================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      //cb(null, Date.now() + '_' +file.fieldname)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage }).single("file")

//index.js에서 이미 api/product를 타고 왔기 때문
router.post('/image', (req,res) => {

    //가져온 이미지를 저장을 해주면 됨
    upload(req, res, err => {
        if(err) {
            return req.json({success:false, err})
        }
        return res.json({success : true, filePath : res.req.file.path, fileName : res.req.file.filename})
    })

})

router.post('/', (req,res) => {
    //받아온 정보들은 db에 넣어준다.
    const product = new Product(req.body)
    product.save((err) => {
        if(err) return res.status(400).json({success : false, err})
        return res.status(200).json({success: true})
    })
})

router.post('/products', (req,res) => {

    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let term = req.body.searchTerm

    let findArgs = {};

    // key - >continents or price
    for(let key in req.body.filters) {
        //key -> continents, price
        //req.body.filters -> { continents: [ 1, 3, 2 ], price: [] }
        if(req.body.filters[key].length > 0) {

            if(key === "price") {
                findArgs[key] = {
                    //greater than equal
                    //less than equal
                    $gte :req.body.filters[key][0],
                    $lte : req.body.filters[key][1]
                }
            }else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    console.log('findArgs', findArgs)
    // -> findArgs { continents: [ 1, 2, 3 ] }
    //products collection에 들어 있는 모든 상품 정보를 가져오기

    if(term) {
        Product.find(findArgs)
        .find({$text : {$search : term}})
        .populate("writer")
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
            if(err) return res.status(400).json({success : false, err})
            return res.status(200).json({
                success : true,
                productInfo,
                postSize : productInfo.length})
        })

    }else {
        Product.find(findArgs)
        .populate("writer")
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
            if(err) return res.status(400).json({success : false, err})
            return res.status(200).json({
                success : true,
                productInfo,
                postSize : productInfo.length})
        })

    }
})

// id = 12321321, 456875465, 7894565 type = array
router.get('/products_by_id', (req,res) => {
    let type = req.query.type
    let productIds = req.query.id

    // 아래에서 productIds = ['12321321', '456875465', '7894565']로 변경
    if(type === "array") {
        let ids = req.query.id.split(',')
        productIds = ids.map(item => {
            return item
        })
    }

    //productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져온다.
    Product.find({_id:{$in : productIds}})
        .populate('writer')
        .exec((err, product) => {
            if(err) return res.status(400).send(err)
            return res.status(200).send(product)
        })
})


module.exports = router;
