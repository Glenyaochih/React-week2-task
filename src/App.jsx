import axios from 'axios'
import { useState } from 'react'

const BASE_URL =import.meta.env.VITE_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH
function App() {

  const [ isLoggedIn, setIsLoggedIn] = useState(false);
  const [tempProduct, setTempProduct] = useState({});
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

      const getProducts = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`)
      setProducts(getProducts.data.products)//發送請求取得資料
      setIsLoggedIn(true)
    }catch(error){alert('登入失敗',error)}
  }

  const checkUserState = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`)
      alert('使用者登入成功')
    } catch (error) {
      alert (error)
    }

  }


  return (
    <>
    {isLoggedIn ? <div className="container">
          <div className="row mt-4">
            <div className="col-6">
              <div className='d-flex'>
                <h2>產品列表</h2>
                <button type='button' className='btn btn-primary ms-5' onClick={checkUserState}>使用者登入狀態確認</button>
              </div>
              
              <table className="table table-primary table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody >
                  {
                  products.map((product) => {
                    return (<tr key={product.id}>
                      <th scope="row">{product.itemNum}</th>
                      <td>{product.title}</td>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled ? '啟用':'未啟用'}</td>
                      <td>
                        <button type="button" className="btn btn-primary" onClick={()=>{
                          setTempProduct(product)
                        }}>查看細節</button>
                      </td>
                    </tr>)
                  })
                  }
                </tbody>
              </table>
            </div>
            <div className="col-6">
              <h2 className="text-center">單一產品細節</h2>
              {tempProduct.title ?(
                <div className="card">
                  <img src={tempProduct.imageUrl} className="card-img-top img-fluid" alt={tempProduct.imageUrl}></img>
                  <div className="card-body">
                    <h3 className="card-title">{tempProduct.title} <span className="badge text-bg-warning rounded-pill ">{tempProduct.category}</span></h3>
                    <p className="card-text fs-5">產品描述：{tempProduct.description}</p>
                    <p className="card-text fs-5">產品尺寸：{tempProduct.content}</p>
                    <hr />
                    <h3 className="card-title">更多圖片</h3>
                    {tempProduct.imagesUrl ?.map((image,index)=>{
                      return <img key={index} src={image} alt={image} className="img-fluid"></img>
                    })}
                  </div>
              </div>) : <p className="h3 text-center">請點選產品查看</p>}
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
  </>
  )
}

export default App
