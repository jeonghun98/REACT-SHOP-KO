import React, {useState} from 'react'
import {Typography, Button, Form, Input} from 'antd'
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';
//import { response } from 'express';
//import {useNavigate} from 'react-router-dom'

const {Title} = Typography;
const {TextArea} = Input;

const Continents = [
  {Key : 1, value : "Africa"},
  {Key : 2, value : "Europe"},
  {Key : 3, value : "Asia"},
  {Key : 4, value : "North America"},
  {Key : 5, value : "South America"},
  {Key : 6, value : "Australia"},
  {Key : 7, value : "Antarctica"}
]

function UPloadProductPage(props) {
  const [Title, setTitle] = useState("")
  const [Description, setDescription] = useState("")
  const [Price, setPrice] = useState(0)
  const [Continent, setContinent] = useState(1)
  const [Images, setImages] = useState([])

  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value)
  }

  const descriptionChangeHandler = (event) => {
    setDescription(event.currentTarget.value)
  }

  const priceChangeHandler = (event) => {
    setPrice(event.currentTarget.value)
  }

  const continentChangeHandler = (event) => {
    setContinent(event.currentTarget.value)
  }

  const updateImages = (newImages) => {
    setImages(newImages)
  }

  //let navigate = useNavigate()

  const sumbitHandler = (event) => {
    event.preventDefault();

    if(!(Title && Description && Price && Continent && Images))
      return alert("모든 값을 넣어주셔야 합니다.")

      //서버에 채운 값들을 request로 보낸다.


      const body = {
        // 로그인 된 사람의 ID
        wirter : props.user.userData._id,
        title : Title,
        description : Description,
        price : Price,
        images : Images,
        continents : Continent
      }

      Axios.post("/api/product", body)
          .then(response => {
            if(response.data.success) {
              alert("상품 업로드에 성공 했습니다.")
              props.history.push("/")
              //navigate('/')
            } else {
              alert("상품 업로드에 실패 했습니다.")
            }
          })
  }

  return (
    <div style={{maxWidth : '700px', margin : '2rem auto'}}> 
      <div style={{textAlign : 'center', marginBotton : '2rem'}}>
        <h2>여행 상품 업로드</h2>
      </div>
        
        <Form onSubmitCapture={sumbitHandler}>
          {/*DropZone*/}

          <FileUpload refreshFunction = {updateImages}/>
          <br/><br/>
          <label>이름</label>
          <Input onChange = {titleChangeHandler} value = {Title}/>
          <br/><br/>
          <label>설명</label>
          <TextArea onChange = {descriptionChangeHandler} value = {Description}/>
          <br/><br/>
          <label>가격($)</label>
          <Input type = "number" onChange = {priceChangeHandler} value = {Price}/>
          <br/><br/>
          <select onChange = {continentChangeHandler} value = {Continent}>

            {Continents.map(item => (
              <option key={item.Key} value = {item.Key}>{item.value} </option>
            ))}
          </select>
          <br/><br/>
          <Button htmlType = "submit">확인</Button>
        </Form>
    </div>
  )
}

export default UPloadProductPage