import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { Modal } from 'bootstrap'

const BASE_URL =import.meta.env.VITE_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH
const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""]
};


function App() {
  //useState
  const [ isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [account , setAccount] = useState({
    username: "example@test.com",
    password: "example"
  });

  
  const inputChangeHandler = (e)=>{
    const {value,name}=e.target
    setAccount({
      ...account,
      [name]:value
    })
  }
  
  const loginHandler = async (e)=>{
    try{
      e.preventDefault()
      const signinData =  await axios.post(`${BASE_URL}/v2/admin/signin`,account);
      const {token ,expired} = signinData.data;
      document.cookie = `glenToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common['Authorization'] = token;//發送get請求時需發送這一行將token 帶入驗證
    }catch(error){alert('登入失敗',error)}
  }

  const getProductData = async ()=>{
    const getProducts = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`)
      setProducts(getProducts.data.products)//發送請求取得資料
  }
  
  const removeProduct = async ()=>{
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`)
      getProductData();
      alert('已刪除成功')
    } catch (error) {
      alert('ಥ_ಥ ᖗ', error)
    }
  }
  
  async function checkUserState() {
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`);
      getProductData();
      setIsLoggedIn(true);
    } catch (error) {
      alert(error);
    }
  }
  
  
  //
  useEffect(()=>{
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)glenToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    axios.defaults.headers.common['Authorization'] =token ;
    checkUserState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


//modal 控制
  const delModalLink =useRef(null)
  const delModal = useRef(null)
  const modalLink = useRef(null)
  const myModal = useRef(null)
  const [modalType, setModalType] = useState(null)

  const turnOnModal= (type, product) =>{
    switch (type) {
      case 'create':
        setTempProduct(defaultModalState)
        break;
      case 'edit':
        setTempProduct(product)
        break;
      default:
        break;
    }
    setModalType(type)
    myModal.current.show();
  }

  const turnoffModal =()=>{
    myModal.current.hide();
  }
  const turnonDelModal =(product)=>{
    setTempProduct(product)
    delModal.current.show();
  }
  const turnoffDelModal =()=>{
    delModal.current.hide();
  }

  useEffect(()=>{
    myModal.current = new Modal (modalLink.current,{backdrop : false});
    delModal.current = new Modal (delModalLink.current,{backdrop : false});
  },[])




  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const handleModalInputChange = (e)=>{
    const {value,name,checked,type} = e.target;
    setTempProduct({
      ...tempProduct,
      [name]:type === 'checkbox' ? checked : value
    })
  }

  const handleImageChange = (e,index)=>{
    const {value} = e.target;
    const newImages = [...tempProduct.imagesUrl]
    
    newImages[index]=value
    setTempProduct({
      ...tempProduct,
      imagesUrl:newImages
    })
  }

  const addImageHandler = ()=>{
    const newImages = [...tempProduct.imagesUrl,'']
    setTempProduct({
      ...tempProduct,
      imagesUrl:newImages
    })
  }
  const removeImageHandler = ()=>{
    const newImages = [...tempProduct.imagesUrl]
      newImages.pop()
    setTempProduct({
      ...tempProduct,
      imagesUrl:newImages
    })
  }
  
  const insertProduct = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`,{
        data:{
          ...tempProduct,
          origin_price:Number(tempProduct.origin_price),
          price:Number(tempProduct.price),
          is_enabled:tempProduct.is_enabled ? 1 : 0
        }
      })
      alert('新增成功')
    } catch (error) {
      alert('新增失敗',error)
    }
  }

  const editProduct = async () => {
    try {
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`,{
        data:{
          ...tempProduct,
          origin_price:Number(tempProduct.origin_price),
          price:Number(tempProduct.price),
          is_enabled:tempProduct.is_enabled ? 1 : 0
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
      console.log(apiSwitch)
      await apiSwitch();
      getProductData();
      turnoffModal();

    } catch (error) {
      alert('新增產品失敗')
      console.log(error);
    }
  }

  const delProductConfirm = async()=>{
    try {
      await  removeProduct();
      getProductData();
      turnoffDelModal();
    } catch (error) {
      alert(error)
    }
  }

  console.log(tempProduct)

  return (
  <>
    {isLoggedIn ? <div className="container">
          <div className="row mt-4">
            <div className="col">
              <div className='d-flex'>
                <h2>產品列表</h2>
                <button type='button' className='btn btn-primary ms-auto' onClick={()=>{
                  turnOnModal('create');
                }}>新增產品</button>
              </div>
              
              <table className="table table-Secondary table-hover">
                <thead>
                  <tr>
                    <th>分類</th>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                  </tr>
                </thead>
                <tbody >
                  {
                  products.map((product) => {
                    return (<tr key={product.id}>
                      <th scope="row">{product.category}</th>
                      <td>{product.title}</td>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled ? <span className='text-success'>啟用</span> :'未啟用'}</td>
                      <td>
                        <button type='button' className='btn btn-outline-primary me-2 ' onClick={()=>{
                          turnOnModal('edit',product);
                        }}>編輯</button>
                        <button type='button' className='btn btn-outline-danger' onClick={()=>{
                          turnonDelModal(product);
                        }}>刪除</button>
                      </td>
                    </tr>)
                  })
                  }
                </tbody>
              </table>
            </div>
          </div>
    </div> 
    : <div className="d-flex flex-column justify-content-center align-items-center vh-100">
    <h1 className="mb-5">請先登入</h1>
    <form onSubmit={loginHandler} className="d-flex flex-column gap-3">
      <div className="form-floating mb-3">
        <input name="username" type="email" value={account.username} onChange={inputChangeHandler} className="form-control" id="username" placeholder="name@example.com" />
        <label htmlFor="username">Email address</label>
      </div>
      <div className="form-floating">
        <input name="password" type="password" value={account.password} onChange={inputChangeHandler} className="form-control" id="password" placeholder="Password" />
        <label htmlFor="password">Password</label>
      </div>
      <button className="btn btn-primary">登入</button>
    </form>
    <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>}
  
    <div
          ref={modalLink}
          className="modal fade"
          tabIndex="-1"
          aria-labelledby="productModalLabel"
          aria-hidden="true"
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
                      <div className="mb-3">
                        <h5>主圖</h5>
                        <label htmlFor="imageUrl" className="form-label">
                          輸入圖片網址
                        </label>
                        <input
                          value={tempProduct.imageUrl}
                          onChange={handleModalInputChange}
                          name='imageUrl'
                          type="text"
                          className="form-control"
                          placeholder="請輸入圖片連結"
                          />
                      </div>
                      <img className="img-fluid" src={tempProduct.imageUrl} alt="" />
                      <div className="mb-3">
                        <h5>副圖</h5>
                        <div className="border border-2 border-dashed rounded-3 p-3">
                          {tempProduct.imagesUrl?.map((image, index) => (
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
                        {tempProduct.imagesUrl.length < 5 &&
                        tempProduct.imagesUrl[tempProduct.imagesUrl.length -1 ]!== '' &&(
                        <button 
                        className="btn btn-outline-primary btn-sm d-blocks"
                        onClick={addImageHandler}
                        >新增圖片
                        </button>)
                        }
                        {tempProduct.imagesUrl.length > 1 &&(
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
                        value={tempProduct.title}
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
                          value={tempProduct.category}
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
                          value={tempProduct.unit}
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
                          value={tempProduct.origin_price}
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
                          value={tempProduct.price}
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
                        value={tempProduct.description}
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
                        value={tempProduct.content}
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
                          checked={tempProduct.is_enabled}
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
                  >
                  取消
                </button>
                <button type="button" className="btn btn-primary" onClick={ updateProductConfirm}>確認</button>
              </div>
            </div>
          </div>
    </div>

    <div
      ref={delModalLink}
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">刪除產品</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除 
            <span className="text-danger fw-bold">{tempProduct.title}</span>
          </div>
          <div className="modal-footer">
            <button
              onClick={turnoffDelModal}
              type="button"
              className="btn btn-secondary"
            >
              取消
            </button>
            <button 
            type="button" 
            className="btn btn-danger"
            onClick={delProductConfirm}
            >刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default App
