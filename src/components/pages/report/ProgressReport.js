import React from "react";
import { Tag } from "antd";
import { FormOutlined } from "@ant-design/icons";


export default function ProgressReport() {

    return (
        <>

            <div className="row">
                <div className="col-md-12">
                    <h2>Явцын үр дүн</h2>
                    <hr />


                    <br />

                    <div className="row">
                        <div className="col-md-12 col-xs-12">
                            <div className="card">
                                <div className="card-header">
                                    <h6 className="card-title">ШАЛГУУР ҮЗҮҮЛЭЛТ</h6>
                                </div>
                                <div className="card-body">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Шалгуур</th>

                                                <th>
                                                    <Tag color="geekblue" icon={<FormOutlined />}>Үнэлгээ: <b></b></Tag>
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1.	Эрүүл мэндийн суурь үйлчилгээг тогтмол авч буй байдал
                                                </td>

                                                <td>
                                                    <span></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2.	Нийгмийн хамгааллын механизмд холбогдсон байдал
                                                </td>

                                                <td>
                                                    <span></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>3.	Анхны орлогын хэмжээнээс өсөн нэмэгдсэн орлого
                                                </td>

                                                <td>
                                                    <span></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>4.	Бүтээмжтэй хөрөнгийн үр ашигтай байдал
                                                </td>

                                                <td>
                                                    <span></span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>5.	Техникийн болон мэргэжлийн ур чадвараа нэмэгдүүлсэн байдал
                                                </td>
                                                <td>
                                                    <span></span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>6.	Тогтмол хадгаламж үүсгэж буй байдал
                                                </td>
                                                <td>
                                                    <span></span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>7.	Зээлийн үйлчилгээнд хамрагдсан байдал
                                                </td>
                                                <td>
                                                    <span></span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>8.	Олон нийтийн үйлчилгээ, бүлэгт нэгдсэн байдал /Бүлгийн, дүүрэг, хорооны, бусад байгууллагын үйл ажиллагаа/
                                                </td>
                                                <td>
                                                    <span></span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>9.	Өрхийн хөгжлийн төлөвлөгөө боловсруулсан байдал
                                                </td>
                                                <td>
                                                    <span></span>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>10.	Амьдрах ур чадварт суралцсан байдал
                                                </td>
                                                <td>
                                                    <span></span>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    );
}
