import React, {useState, useEffect}from 'react'
import ImageGallery from 'react-image-gallery'

function ProductImage(props) {

    const [Images, setImages] = useState([])

    useEffect(() => {
      if(props.detail.images && props.detail.images.length > 0) {
        let images = []

        props.detail.images.map(item => {
            images.push({
                original: `http://localhost:5000/${item}`,
                thumbnail: `http://localhost:5000/${item}`
            })
        })
        setImages(images)
      }
    }, [props.detail])
    //위에 줄은 props.detail이 바뀔때 마다
    // useEffect의 life cycle을 한번 더 실행을 요구함 
    
  return (
    <ImageGallery items={Images} />
  )
}

export default ProductImage