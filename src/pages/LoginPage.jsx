import PropTypes from 'prop-types';
import axios from 'axios'
import {useState,useEffect} from 'react'
const BASE_URL =import.meta.env.VITE_BASE_URL


function LoginPage({setIsLoggedIn}) {
    
    const [account , setAccount] = useState({
        username: "example@test.com",
        password: "example"
      });
    

    const loginHandler = async (e)=>{
        try{
          setIsLoggedIn(true);
          console.log('已送出')
          e.preventDefault()
          const signinData =  await axios.post(`${BASE_URL}/v2/admin/signin`,account);
          const {token ,expired} = signinData.data;
          document.cookie = `glenToken=${token}; expires=${new Date(expired)}`;
          axios.defaults.headers.common['Authorization'] = token;//發送get請求時需發送這一行將token 帶入驗證
        }catch(error){alert('登入失敗',error)}
    }

    const inputChangeHandler = (e)=>{
        const {value,name}=e.target
        setAccount({
        ...account,
        [name]:value
        })
    }

    const checkUserState=async()=> {
      try {
        console.log('確認完成')
        await axios.post(`${BASE_URL}/v2/api/user/check`);
        console.log('登入成功')
        setIsLoggedIn(true);
      } catch (error) {
        console.log(error)
        alert('請輸入登入資訊');
      }
    }
      
      //
      useEffect(()=>{
        console.log('已被觸發')
        const token = document.cookie.replace(
          /(?:(?:^|.*;\s*)glenToken\s*=\s*([^;]*).*$)|^.*$/,
          "$1",
        );
        axios.defaults.headers.common['Authorization'] =token ;
        checkUserState();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[])

    return(
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
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
            <button type='submit' className="btn btn-primary">登入</button>
            </form>
            <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
    )
}
LoginPage.protoType={
  setIsLoggedIn:PropTypes.bool.isRequired
}

export default LoginPage