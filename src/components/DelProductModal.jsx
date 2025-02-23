import PropTypes from "prop-types";
import axios from "axios";
import { useRef, useEffect, useState } from "react";
import { Modal } from "bootstrap";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function DelProductModal({ getProductData, tempProduct, isOpen, setIsOpen }) {
  const [delModalData, setDelModalData] = useState(tempProduct);
  useEffect(() => {
    setDelModalData({
      ...tempProduct,
    });
  }, [tempProduct]);
  const delModalLink = useRef(null);
  const delModal = useRef(null);

  useEffect(() => {
    delModal.current = new Modal(delModalLink.current, { backdrop: false });
  }, []);
  useEffect(() => {
    if (isOpen) {
      delModal.current.show();
      setIsOpen(true);
    }
  }, [isOpen, setIsOpen]);

  const turnoffDelModal = () => {
    delModal.current.hide();
    setIsOpen(false);
  };

  const removeProduct = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/v2/api/${API_PATH}/admin/product/${delModalData.id}`,
      );
      console.log(delModalData);
      alert("已刪除成功");
    } catch (error) {
      alert("ಥ_ಥ ᖗ", error);
    }
  };

  const delProductConfirm = async () => {
    try {
      await removeProduct();
      getProductData();
      turnoffDelModal();
    } catch (error) {
      alert(error);
    }
  };

  return (
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
              onClick={turnoffDelModal}
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除
            <span className="text-danger fw-bold">{delModalData.title}</span>
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
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DelProductModal.propTypes = {
  getProductData: PropTypes.func.isRequired,
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
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default DelProductModal;
