import axios from 'axios'
import { useEffect, useState } from 'react'

const BASE_URL =import.meta.env.VITE_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH
function App() {

  const [ isLoggedIn, setIsLoggedIn] = useState(false);
  // const [tempProduct, setTempProduct] = useState({});
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
  
  const removeProduct = async (id)=>{
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${id}`)
    } catch (error) {
      alert('ಥ_ಥ ᖗ', error)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function checkUserState() {
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`);
      getProductData();
      setIsLoggedIn(true);
    } catch (error) {
      alert(error);
    }
  }
  


  useEffect(()=>{
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)glenToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    axios.defaults.headers.common['Authorization'] =token ;
    checkUserState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
  <>
    {isLoggedIn ? <div className="container">
          <div className="row mt-4">
            <div className="col">
              <div className='d-flex'>
                <h2>產品列表</h2>
                <button type='button' className='btn btn-primary ms-auto' >新增產品</button>
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
                      <th scope="row">{product.itemNum}</th>
                      <td>{product.title}</td>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled ? '啟用':'未啟用'}</td>
                      <td>
                        <button type='button' className='btn btn-outline-primary '>編輯</button>
                        <button type='button' className='btn btn-outline-danger' onClick={()=>{
                          removeProduct(product.id)
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
          id="productModal"
          className="modal fade"
          tabIndex="-1"
          aria-labelledby="productModalLabel"
          aria-hidden="true"
          >
          <div className="modal-dialog modal-xl">
            <div className="modal-content border-0">
              <div className="modal-header bg-dark text-white">
                <h5 id="productModalLabel" className="modal-title">
                  <span>新增產品</span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-sm-4">
                    <div className="mb-2">
                      <div className="mb-3">
                        <label htmlFor="imageUrl" className="form-label">
                          輸入圖片網址
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="請輸入圖片連結"
                          />
                      </div>
                      <img className="img-fluid" src="" alt="" />
                    </div>
                    <div>
                      <button className="btn btn-outline-primary btn-sm d-block w-100">
                        新增圖片
                      </button>
                    </div>
                    <div>
                      <button className="btn btn-outline-danger btn-sm d-block w-100">
                        刪除圖片
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">標題</label>
                      <input
                        id="title"
                        type="text"
                        className="form-control"
                        placeholder="請輸入標題"
                        />
                    </div>

                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="category" className="form-label">分類</label>
                        <input
                          id="category"
                          type="text"
                          className="form-control"
                          placeholder="請輸入分類"
                          />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="unit" className="form-label">單位</label>
                        <input
                          id="unit"
                          type="text"
                          className="form-control"
                          placeholder="請輸入單位"
                          />
                      </div>
                    </div>

                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="origin_price" className="form-label">原價</label>
                        <input
                          id="origin_price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入原價"
                          />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="price" className="form-label">售價</label>
                        <input
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
                      <label htmlFor="description" className="form-label">產品描述</label>
                      <textarea
                        id="description"
                        className="form-control"
                        placeholder="請輸入產品描述"
                        ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">說明內容</label>
                      <textarea
                        id="content"
                        className="form-control"
                        placeholder="請輸入說明內容"
                        ></textarea>
                    </div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
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
                <button type="button" className="btn btn-primary">確認</button>
              </div>
            </div>
          </div>
        </div>
  </>
  )
}

export default App
