import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import {Icon, Col, Card, Row, Carousel} from 'antd';
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import { continents, price } from './Sections/Datas';
import RadioBox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continents : [],
        price : []
    })
    const [SearchTerm, setSearchTerm] = useState("")

    useEffect(() => {

        let body = {
            skip : Skip,
            limit : Limit
        }

        getProducts(body)

    }, [])
    
    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                if(response.data.success) {
                    if(body.loadMore) {
                        setProducts([...Products,...response.data.productInfo])
                    }else {
                        //console.log(response.data)
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)
                }else {
                    alert("상품들을 가져오는데 실패 했습니다.")
                }
            })
    }

    const loadMoreHandler = () => {
        let skip = Skip + Limit

        let body = {
            skip : skip,
            limit : Limit,
            loadMore : true
        }

        getProducts(body)
        setSkip(skip)
    }

    const renderCards = Products.map((product, index) => {

        //console.log('product', product)
        return <Col lg={6} md ={8} xs = {24} key = {index}>
            <Card 
                cover={<a href={`/product/${product._id}`}><ImageSlider images = {product.images}/></a>}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    const showFileteredResults = (filters) => {
        let body = {
            skip : 0,
            limit : Limit,
            filters: filters
        }

        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for (let key in data) {
            if(data[key]._id === parseInt(value)) {
                array = data[key].array;
            } 
        }
        return array
    }
    const handleFilters = (filters, catagory) => {
        const newFilters = {...Filters}
        newFilters[catagory] = filters
        // checkBox에서 온 1,2,3 -> const Filters의 continents로
        //console.log('filters', filters)

        if(catagory == "price") {
            let priceValue = handlePrice(filters)
            newFilters[catagory] = priceValue // [0,199] or [200,249]...등
        }
        showFileteredResults(newFilters)
        setFilters(newFilters)
    }

    //const [SearchTerm, setSearchTerm] = useState("")
    const updateSearchTerm = (newSearchTerm) => {
        //newSearchTerm 받은 파라미터는 
        //SearchFeature.js의 searchHandler의
        //props.refreshFunction(event.currentTarget.value) 로 받은값

        let body = {
            skip : 0,
            limit : Limit,
            filters : Filters,
            searchTerm : newSearchTerm
        }
        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }

    return (
        <div style={{width : '75%', margin : '3rem auto'}}>
            <div style={{textAlign : 'center'}}>
                <h2>Let's Travel Anywhere <Icon type = "rocket"/> </h2>
            </div>

            {/* Filter */}

            <Row gutter = {[16,16]}>
                <Col lg={12} xs = {24}>
                    {/* CheckBox */}
                    <CheckBox list = {continents} handleFilters = {filters => handleFilters(filters, "continents")} />
                </Col>
                <Col lg={12} xs = {24}>
                    {/* RadioBox */}
                    <RadioBox list = {price} handleFilters = {filters => handleFilters(filters, "price")}/>
                </Col>
            </Row>

            {/* Search */}
            <div style={{display : 'flex', justifyContent : 'flex-end', margin : '1rem auto'}}>
                <SearchFeature
                    refreshFunction = {updateSearchTerm}
                />
            </div>
            {/* Cards */}

            <Row gutter = {[16,16]}>
                {renderCards}
            </Row>

            <br/>
            {PostSize >= Limit &&
                <div style={{display : 'flex',justifyContent : 'center'}}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }
            
        </div>
    )
}

export default LandingPage
