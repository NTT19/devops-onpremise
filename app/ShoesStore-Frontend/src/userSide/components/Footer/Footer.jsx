import React from "react";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";

import "./footer.css";
import logo from "../../../assets/images/eco-logo.png";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <Container>
                <Row>
                    <Col lg="4" className="mb-4" md="12">
                        <div className="footer__quick-links">
                            <h1 className="text-white">SHIP HÀNG TOÀN QUỐC</h1>
                        </div>
                        <p className="footer__text mt-4">
                            Cửa hàng chúng tôi ship toàn quốc và bạn vui lòng kiểm tra kỹ hàng !!!.
                        </p>
                    </Col>
                    <Col lg="5" className="mb-4" md="3">
                        <div className="footer__quick-links">
                            <h1 className="text-white">
                                BẢO HÀNH
                            </h1>
                        </div>
                        <p className="footer__text mt-4">
                            Chúng tôi không chiu bất kỳ bảo hành nào do bạn làm va đập và hưu hỏng.
                            
                        </p>
                    </Col>
                    <Col lg="3" md="3">
                        <div className="footer__quick-links">
                            <h1 className="text-white">THÔNG TIN LIÊN HỆ</h1>
                            <ListGroup className="mb-3 footer__contact mt-4">
                                <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                                    <span>
                                        <i className="ri-map-pin-line"></i>
                                    </span>
                                    <p>Chi nhánh 1 : Huỳnh Tấn Phát - TP HCM</p>
                                    <p>Chi nhánh 2 : Nguyễn Thị Thập - TP HCM</p>
                                </ListGroupItem>
                                <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                                    <span>
                                        <i className="ri-phone-line"></i>
                                    </span>
                                    <p>+84123456789</p>
                                </ListGroupItem>
                                <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                                    <span>
                                        <i className="ri-mail-line"></i>
                                    </span>
                                    <p>2T@gmail.com</p>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                    </Col>
                    <Col md="12">
                        <p className="footer__copyright">
                            Copyrignt {year} by Giày dép TOKO. All
                            rights reserved.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
