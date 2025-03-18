import React, { useEffect } from "react";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { IoArrowBack } from 'react-icons/io5';
import { Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Meta title={"Chính Sách Hoàn Trả"} />
      <BreadCrumb title="Chính Sách Hoàn Trả" />
      <Link to='/'>
        <IoArrowBack className='icon-container' size={30} />
      </Link>
      <Container class1="policy-wrapper py-4">
        <div className="row">
          <div className="col-12">
          <div className="policy">
              <h5 className="title text-uppercase text-center text-black">
                Chính sách hoàn trả của chúng tôi
              </h5>
              <div className="py-3">
                <p>
                  <strong>1. Điều kiện hoàn trả</strong>
                </p>
                <p>
                  1.1. Chúng tôi chấp nhận hoàn trả sản phẩm trong vòng 7 ngày
                  kể từ ngày mua, với điều kiện sản phẩm chưa sử dụng và giữ
                  nguyên tem mác, bao bì.
                </p>

                <p>
                  <strong>2. Quy trình hoàn trả</strong>
                </p>
                <p>
                  2.1. Để yêu cầu hoàn trả, vui lòng liên hệ với chúng tôi qua
                  địa chỉ email hoặc số hotline.
                </p>

                <p>
                  <strong>3. Chi phí hoàn trả</strong>
                </p>
                <p>
                  3.1. Chi phí vận chuyển cho quá trình hoàn trả sẽ được chịu
                  bởi khách hàng trừ khi sản phẩm có lỗi do chất lượng hoặc gửi
                  nhầm từ phía chúng tôi.
                </p>

                <p>
                  <strong>4. Thời gian xử lý hoàn trả</strong>
                </p>
                <p>
                  4.1. Chúng tôi cam kết xử lý yêu cầu hoàn trả trong vòng 3
                  ngày làm việc kể từ khi nhận được sản phẩm hoàn trả.
                </p>

                <p>
                  <strong>5. Liên hệ</strong>
                </p>
                <p>
                  Nếu bạn có bất kỳ câu hỏi hoặc ý kiến nào về chính sách hoàn
                  trả của chúng tôi, vui lòng liên hệ với chúng tôi qua địa chỉ
                  email: <a href="mailto:your@email.com">Babyboo@email.com</a>{" "}
                  hoặc số hotline: <a href="tel:+123456789">+84 12345678</a>.
                </p>

                <p>Cảm ơn bạn đã chọn chúng tôi!</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default RefundPolicy;
