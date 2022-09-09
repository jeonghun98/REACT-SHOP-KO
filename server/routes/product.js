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

module.exports = router;
