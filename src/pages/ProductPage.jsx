import axios from 'axios'
import { useEffect, useState } from 'react'
import Pagination from '../components/Pagination'
import ProductModal from '../components/productModal'
import DelProductModal from '../components/DelProductModal'





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

function ProductPage() {
    
    const [modalType, setModalType] = useState(null);
    const [tempProduct, setTempProduct] = useState(defaultModalState);
    const [pageState, setPageState]=useState({});
    const[products,setProducts] = useState([]);
    const[isProductModalOpen,setIsProductModalOpen]=useState(false);
    
    const[isDelProductModalOpen,setIsDelProductModalOpen]= useState(false);
    
    
    

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




   
    return(
    <>
        <div className="container">
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

    </>)
}

export default ProductPage