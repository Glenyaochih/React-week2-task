import PropTypes from "prop-types";
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import Pagination from '../components/Pagination'
import ProductModal from '../components/productModal'
import DelProductModal from '../components/DelProductModal'
import { Offcanvas } from 'bootstrap'
import { BiLogOut } from 'react-icons/bi'





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

function ProductPage({setIsLoggedIn}) {
    const [modalType, setModalType] = useState('');
    const [tempProduct, setTempProduct] = useState(defaultModalState);
    const [pageState, setPageState]=useState({});
    const[products,setProducts] = useState([]);
    const[isProductModalOpen,setIsProductModalOpen]=useState(false);
    
    const[isDelProductModalOpen,setIsDelProductModalOpen]= useState(false);
    
    const loginOffcanvas = useRef(null)
    const loginOffcanvasLink=useRef()
    useEffect(()=>{
        loginOffcanvas.current = new Offcanvas (loginOffcanvasLink.current)
    })
    const turnOnLoginOffcanvas = ()=>{
        loginOffcanvas.current.show()
    }

    

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
        setIsProductModalOpen(true);
    }
    const turnOnDelModal=(product)=>{
        setTempProduct(product)
        setIsDelProductModalOpen(true)
    }
    
    const getProductData = async (page)=>{
        try{
        const getProducts = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`)
            setProducts(getProducts.data.products)//發送請求取得資料
            setPageState(getProducts.data.pagination)
        }catch{
        console.log('取得產品失敗')
        }
    }
    useEffect(()=>{
        getProductData();
    },[])//要記得加依賴，不然頁面無法轉換，因為頁面使用useState更新資料畫面會一直更新，未加依賴也會一直更新


    const logOutHandler = async ()=>{
        try {
            await axios.post(`${BASE_URL}/v2/logout`);
            setIsLoggedIn(false)
            alert('登出成功')
        } catch (error) {
            console.log(error,'登出失敗')
        }
    }






   
    return(
    <>
        <div className="container">
                <div className="row mt-4">
                    <div className="col">
                    <div className='d-flex'>
                        <h2>產品列表</h2>
                        <button type='button' className='btn btn-primary ms-5' onClick={()=>{
                        turnOnModal('create');
                        }}>新增產品</button>
                        <div className="d-flex ms-auto align-items-center">
                            <div className="flex-shrink-0">
                                <a href="#" onClick={turnOnLoginOffcanvas}>
                                <img className="rounded-circle object-fit-cover" style={{height:40, width:40}} src='images/andychen.jpeg' alt="andy"/>
                                </a>
                            </div>
                            <div className="ms-3">
                            <h1 className="h6">Andy Chen</h1>
                            </div>
                        </div>
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
                                turnOnDelModal(product);
                                }}>刪除</button>
                            </td>
                            </tr>)
                        })
                        }
                        </tbody>
                    </table>
                    </div>
                </div>
                {<Pagination pageState={pageState} getProductData={getProductData}/>}
                {<ProductModal 
                tempProduct={tempProduct} 
                isOpen={isProductModalOpen} 
                setIsOpen={setIsProductModalOpen}
                modalType={modalType}
                getProductData={getProductData}
                />}
        </div> 
                {<DelProductModal 
                getProductData={getProductData}
                tempProduct={tempProduct}
                isOpen={isDelProductModalOpen}
                setIsOpen={setIsDelProductModalOpen}
                />}
                

                <div ref={loginOffcanvasLink} className="offcanvas offcanvas-end"  id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasRightLabel">管理者設定</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <div>
                            <small><a className=" text-secondary" href="mailto:andy0401@mail.com">andy0401@mail.com</a></small>
                        </div>
                        <div>
                            <a className='btn' type='button' href="#">偏好設定</a>
                        </div>
                        <div className='mt-auto'>
                            <button type='button' className='btn btn-outline-secondary w-100' onClick={
                                logOutHandler
                            }><BiLogOut size={32}/><span className='fs-5'>logout</span></button>
                        </div>
                    </div>
                </div>

    </>)
}
ProductPage.propTypes ={
    setIsLoggedIn:PropTypes.bool.isRequired
}
export default ProductPage