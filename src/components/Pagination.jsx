function Pagination({getProductData,pageState}) {
    const pageHandler=(page)=>{
        getProductData(page)
    } 


    return(
        pageState.total_pages > 0 ?<div className="d-flex justify-content-center">
                    <nav>
                    <ul className="pagination">
                        <li className={`page-item ${!pageState.has_pre && 'disabled'}`}>
                        <a 
                        onClick={()=>pageHandler(pageState.current_page - 1)}
                        className="page-link" href="#">
                            上一頁
                        </a>
                        </li>
                        
                        {Array.from({length:pageState.total_pages}).map((_,index)=>{
                        return <li 
                        key={index}
                        className={`page-item ${pageState.current_page === index+1 && 'active'}`}>
                        <a
                        onClick={()=>{pageHandler(index+1)}} 
                        className="page-link" href="#">
                            {index+1}
                        </a>
                        </li>
                        })}
                        
                        <li className={`page-item ${!pageState.has_next && 'disabled'}`}>
                        <a 
                        onClick={()=>pageHandler(pageState.current_page + 1)}
                        className="page-link" href="#">
                            下一頁
                        </a>
                        </li>
                    </ul>
                    </nav>
        </div>:<></>

    )


}

export default Pagination;