import PropTypes from "prop-types";
import axios from 'axios'
import { useEffect, useRef, useState} from 'react'
import { Modal } from 'bootstrap'




const BASE_URL =import.meta.env.VITE_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH


function ProductModal ({
  tempProduct,
  modalType,
  isOpen,
  setIsOpen,
  getProductData
}) {
    const [modalData ,setModalData]= useState(tempProduct)
    useEffect(()=>{
      setModalData({
        ...tempProduct
      })
    },[tempProduct])
    const modalLink = useRef(null)
    const myModal = useRef(null)
    useEffect(()=>{
      myModal.current = new Modal (modalLink.current,{backdrop : false});
  },[])

  useEffect(()=>{
    if(isOpen){
      myModal.current.show();
    }
  },[isOpen])
  
    const turnoffModal =()=>{
        myModal.current.hide();
        setIsOpen(false);
      }

    const handleModalInputChange = (e)=>{
        const {value,name,checked,type} = e.target;
        setModalData({
          ...modalData,
          [name]:type === 'checkbox' ? checked : value
        })
      }

    const handleImageChange = (e,index)=>{
        const {value} = e.target;
        const newImages = [...modalData.imagesUrl]
        
        newImages[index]=value
        setModalData({
          ...modalData,
          imagesUrl:newImages
        })
      }
    
      const addImageHandler = ()=>{
        const newImages = [...modalData.imagesUrl,'']
        setModalData({
          ...modalData,
          imagesUrl:newImages
        })
      }
      const removeImageHandler = ()=>{
        const newImages = [...modalData.imagesUrl]
          newImages.pop()
          setModalData({
          ...modalData,
          imagesUrl:newImages
        })
      }

    const insertProduct = async () => {
        try {
          await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`,{
            data:{
              ...modalData,
              origin_price:Number(modalData.origin_price),
              price:Number(modalData.price),
              is_enabled:modalData.is_enabled ? 1 : 0
            }
          })
          alert('新增成功')
        } catch (error) {
          alert('新增失敗',error)
        }
      }

    const editProduct = async () => {
        try {
          await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${modalData.id}`,{
            data:{
              ...modalData,
              origin_price:Number(modalData.origin_price),
              price:Number(modalData.price),
              is_enabled:modalData.is_enabled ? 1 : 0
            }
          })
          alert('修改成功')
        } catch (error) {
          alert('修改失敗',error)
        }
      }


    const updateProductConfirm = async()=>{
        const apiSwitch = modalType === 'create'? insertProduct : editProduct
        try {
          await apiSwitch();
          getProductData();
          turnoffModal();
    
        } catch (error) {
          alert('新增產品失敗')
          console.log(error);
        }
      }

    const fileUpdateHandler = async(e)=>{
           
            const file = e.target.files[0];
            const formData = new FormData(); 
            formData.append("file-to-upload",file)
            try {
              const res= await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`,
                formData);
              const mainImageUrl = res.data.imageUrl;
              setModalData({
                ...modalData,
                imageUrl:mainImageUrl
              })
            } catch (error) {
              error
            }
          }
          

    return(
        <div
        ref={modalLink}
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content border-0">
            <div className="modal-header bg-dark text-white">
                <h5 id="productModalLabel" className="modal-title">
                <span>{modalType === 'create' ? '新增產品':'編輯產品'}</span>
                </h5>
                <button
                type="button"
                className="btn btn-primary btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ></button>
            </div>
            <div className="modal-body">
                <div className="row">
                <div className="col-sm-4">
                    <div className="mb-2">
                    <div className="mb-5">
                        <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                        <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="form-control"
                        id="fileInput"
                        onChange={fileUpdateHandler}
                        />
                    </div>
                    <div className="mb-3">
                        <h5>主圖</h5>
                        <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                        </label>
                        <input
                        value={modalData.imageUrl}
                        onChange={handleModalInputChange}
                        name='imageUrl'
                        type="text"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        />
                    </div>
                    <img className="img-fluid" src={modalData.imageUrl} alt="" />
                    <div className="mb-3">
                        <h5>副圖</h5>
                        <div className="border border-2 border-dashed rounded-3 p-3">
                        {modalData.imagesUrl?.map((image, index) => (
                            <div key={index} className="mb-2">
                            <label
                                htmlFor={`imagesUrl-${index + 1}`}
                                className="form-label"
                            >
                                副圖 {index + 1}
                            </label>
                            <input
                                value={image}
                                onChange={(e)=> handleImageChange(e,index)}
                                id={`imagesUrl-${index + 1}`}
                                type="text"
                                placeholder={`圖片網址 ${index + 1}`}
                                className="form-control mb-2"
                            />
                            {image && (
                                <img
                                src={image}
                                alt={`副圖 ${index + 1}`}
                                className="img-fluid mb-2"
                                />
                            )}
                            </div>
                        ))}
                        </div>
                    </div>
                    </div>
                    <div className='btn-group w-100'>
                        {modalData.imagesUrl.length < 5 &&
                        modalData.imagesUrl[modalData.imagesUrl.length -1 ]!== '' &&(
                        <button 
                        className="btn btn-outline-primary btn-sm d-blocks"
                        onClick={addImageHandler}
                        >新增圖片
                        </button>)
                        }
                        {modalData.imagesUrl.length > 1 &&(
                        <button 
                        className="btn btn-outline-danger btn-sm d-block"
                        onClick={removeImageHandler}
                        >刪除圖片
                        </button>)}
                    </div>
                </div>
                <div className="col-sm-8">
                    <div className="mb-3">
                    <label htmlFor="title" className="form-label h5">標題</label>
                    <input
                        value={modalData.title}
                        onChange={handleModalInputChange}
                        name='title'
                        id="title"
                        type="text"
                        className="form-control"
                        placeholder="請輸入標題"
                        />
                    </div>

                    <div className="row">
                    <div className="mb-3 col-md-6">
                        <label htmlFor="category" className="form-label h5">分類</label>
                        <input
                        value={modalData.category}
                        onChange={handleModalInputChange}
                        name='category'
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="unit" className="form-label h5">單位</label>
                        <input
                        value={modalData.unit}
                        onChange={handleModalInputChange}
                        name='unit'
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        />
                    </div>
                    </div>

                    <div className="row">
                    <div className="mb-3 col-md-6">
                        <label htmlFor="origin_price" className="form-label h5">原價</label>
                        <input
                        value={modalData.origin_price}
                        onChange={handleModalInputChange}
                        name='origin_price'
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                        <label htmlFor="price" className="form-label h5">售價</label>
                        <input
                        value={modalData.price}
                        onChange={handleModalInputChange}
                        name='price'
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        />
                    </div>
                    </div>
                    <hr />

                    <div className="mb-3">
                    <label htmlFor="description" className="form-label h5">產品描述</label>
                    <textarea
                        value={modalData.description}
                        onChange={handleModalInputChange}
                        name='description'
                        id="description"
                        className="form-control"
                        placeholder="請輸入產品描述"
                        ></textarea>
                    </div>
                    <div className="mb-3">
                    <label htmlFor="content" className="form-label h5">說明內容</label>
                    <textarea
                        value={modalData.content}
                        onChange={handleModalInputChange}
                        name='content'
                        id="content"
                        className="form-control"
                        placeholder="請輸入說明內容"
                        ></textarea>
                    </div>
                    <div className="mb-3">
                    <div className="form-check">
                        <input
                        checked={modalData.is_enabled}
                        onChange={handleModalInputChange}
                        name='is_enabled'
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        />
                        <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                        </label>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="modal-footer">
                <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                onClick={turnoffModal}
                >
                取消
                </button>
                <button type="button" className="btn btn-primary" onClick={ updateProductConfirm}>確認</button>
            </div>
            </div>
        </div>
    </div>
    )
}
ProductModal.propTypes = {
  modalType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen:PropTypes.bool.isRequired,
  tempProduct: PropTypes.shape({
    id: PropTypes.string,
    imageUrl: PropTypes.string,
    title: PropTypes.string,
    category: PropTypes.string,
    unit: PropTypes.string,
    originPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    content: PropTypes.string,
    isEnabled: PropTypes.bool,
    imagesUrl: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  getProductData: PropTypes.func.isRequired,
};


export default ProductModal